<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../models/IndexModel.php';
require_once __DIR__ . '/../../config/db.php';

function is_base64_loose(string $s): bool {
    // Base64 “crudo” (sin prefijo data:) suele contener solo estos chars
    // Nota: esto es heurístico y tolerante; si falla, igual habrá fallbacks abajo.
    return (bool)preg_match('#^[A-Za-z0-9+/]+={0,2}$#', $s);
}

function looks_like_path_or_url(string $s): bool {
    // Rutas relativas o absolutas típicas o URLs
    if (preg_match('#^(https?:)?//#i', $s)) return true;        // http(s):// o //cdn...
    if ($s[0] === '/') return true;                             // /uploads/...
    if (str_starts_with($s, 'public/') || str_starts_with($s, 'uploads/')) return true;
    if (str_contains($s, '.')) return true;                     // algo.jpg, .png, .webp, etc.
    return false;
}

try {
    $db     = (new Database())->connect();
    $model  = new IndexModel($db);

    // Parámetro opcional
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 6;

    $rows = $model->listarActivas($limit);

    $placeholder = 'uploads/cards/no-image.png'; // ajusta a tu estructura real

    $out = [];
    foreach ($rows as $r) {
        $image_url = null;
        $raw = isset($r['image_data']) ? trim((string)$r['image_data']) : '';
        $mime = trim((string)($r['image_mime'] ?? ''));

        if ($raw !== '') {
            if (str_starts_with($raw, 'data:')) {
                // Caso 1: ya viene como data URL completo
                $image_url = $raw;
            } elseif (looks_like_path_or_url($raw)) {
                // Caso 2: ruta/URL
                $image_url = $raw;
            } elseif ($mime !== '' && is_base64_loose($raw)) {
                // Caso 3: parece base64 crudo + tenemos mime -> envolver
                $image_url = 'data:' . $mime . ';base64,' . $raw;
            }
        }

        // Fallbacks
        if (!$image_url && !empty($r['image_src'])) {
            $image_url = $r['image_src'];
        }
        if (!$image_url) {
            $image_url = $placeholder;
        }

        $out[] = [
            'id'            => (int)$r['id'],
            'image_url'     => $image_url,
            'image_alt'     => $r['image_alt'] ?: 'Imagen',
            'badge_text'    => $r['badge_text'] ?: null,
            'title'         => $r['title'] ?: '',
            'description'   => $r['description'] ?: '',
            'footer_text'   => $r['footer_text'] ?: '',
            'button_label'  => $r['button_label'] ?: 'Ver Detalles',
            'button_url'    => $r['button_url'] ?: '#',
        ];
    }

    echo json_encode($out, JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno', 'message' => $e->getMessage()]);
}
