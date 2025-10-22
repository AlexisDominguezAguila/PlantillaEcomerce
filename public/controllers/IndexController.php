<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../models/IndexModel.php';
require_once __DIR__ . '/../../config/db.php';

try {
    $db     = (new Database())->connect();
    $model  = new IndexModel($db);

    // Parámetros opcionales
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 6;

    $rows = $model->listarActivas($limit);

    // Normalizar salida: image_url (prioriza binario, si no hay, usa image_src)
    $out = [];
    foreach ($rows as $r) {
        $image_url = null;

        if (!empty($r['image_data']) && !empty($r['image_mime'])) {
            $image_url = 'data:' . $r['image_mime'] . ';base64,' . base64_encode($r['image_data']);
        } elseif (!empty($r['image_src'])) {
            // Compatibilidad con registros viejos que guardaban una ruta
            $image_url = $r['image_src'];
        } else {
            // Tu placeholder público si no hay imagen
            $image_url = 'public/assets/images/no-image.png';
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

    echo json_encode($out);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno', 'message' => $e->getMessage()]);
}
