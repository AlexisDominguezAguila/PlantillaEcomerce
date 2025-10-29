<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../models/GestionModel.php'; // Debe contener la clase ProductCard
require_once __DIR__ . '/../../config/db.php';

$db = (new Database())->connect();
$model = new ProductCard($db);

$action = $_GET['action'] ?? '';

function nullIfEmpty($v) { return ($v === '' || !isset($v)) ? null : $v; }
function b($ok, $extra = []) { echo json_encode(array_merge(['success' => (bool)$ok], $extra)); exit; }

// ---------- Paths de subida ----------
$ROOT        = dirname(__DIR__, 2);                 // /ruta/a/tu/app
$UPLOAD_DIR  = $ROOT . '/public/uploads/cards/';    // ruta en disco
$PUBLIC_BASE = '/public/uploads/cards/';            // ruta pública

if (!is_dir($UPLOAD_DIR)) @mkdir($UPLOAD_DIR, 0775, true);

// ---------- Validación subida ----------
const MAX_BYTES    = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = ['image/png','image/jpeg','image/webp','image/gif'];

function hasFile($key = 'image') {
  return isset($_FILES[$key]) && !empty($_FILES[$key]['name']);
}
function detectMime($tmpPath) {
  $f = new finfo(FILEINFO_MIME_TYPE);
  return $f->file($tmpPath) ?: 'application/octet-stream';
}
function safe_ext_from_mime($mime) {
  return match ($mime) {
    'image/png'  => '.png',
    'image/jpeg' => '.jpg',
    'image/webp' => '.webp',
    'image/gif'  => '.gif',
    default      => '.bin'
  };
}
function slugify($text) {
  $text = @iconv('UTF-8','ASCII//TRANSLIT',$text);
  $text = preg_replace('~[^\\pL\\d]+~u','-',$text);
  $text = trim($text,'-');
  $text = strtolower($text);
  $text = preg_replace('~[^-a-z0-9]+~','', $text);
  return $text ?: 'img';
}
function is_managed_path(string $image_src, string $PUBLIC_BASE): bool {
  return $image_src !== '' && str_starts_with($image_src, $PUBLIC_BASE);
}
function maybe_delete_old(string $image_src, string $UPLOAD_DIR, string $PUBLIC_BASE): void {
  if (!is_managed_path($image_src, $PUBLIC_BASE)) return;
  $rel = substr($image_src, strlen($PUBLIC_BASE));
  $full = $UPLOAD_DIR . $rel;
  if (is_file($full)) @unlink($full);
}

/** Guarda archivo subido y retorna [filename, publicPath, mime] */
function store_uploaded_image(array $file, string $UPLOAD_DIR, string $PUBLIC_BASE): array {
  if ($file['error'] !== UPLOAD_ERR_OK) throw new RuntimeException('Error subiendo archivo');
  if ($file['size'] > MAX_BYTES)        throw new RuntimeException('Archivo supera 5MB');

  $mime = detectMime($file['tmp_name']);
  if (!in_array($mime, ALLOWED_MIME, true)) throw new RuntimeException('Formato no permitido');
  $ext = safe_ext_from_mime($mime);

  $base = pathinfo($file['name'], PATHINFO_FILENAME);
  $base = slugify($base);
  $filename = $base . '-' . substr(sha1(random_bytes(8)), 0, 8) . $ext;

  $dest = $UPLOAD_DIR . $filename;
  if (!move_uploaded_file($file['tmp_name'], $dest))
    throw new RuntimeException('No se pudo guardar el archivo');

  return [$filename, $PUBLIC_BASE . $filename, $mime];
}

switch ($action) {

  // ===== LISTAR =====
  case 'listar':
  case 'list': {
    $onlyActive = isset($_GET['only_active']) ? (int)$_GET['only_active'] === 1 : false;
    $rows = $model->listar($onlyActive);

    // Normalizar salida: si image_src vacío pero image_data tiene filename, construir ruta pública
    foreach ($rows as &$r) {
      $r['image_src'] = $r['image_src'] ?? '';
      if ($r['image_src'] === '' && !empty($r['image_data'])) {
        $r['image_src'] = $PUBLIC_BASE . $r['image_data'];
      }
      // ya NO devolvemos base64 (image_data_url)
    }
    echo json_encode($rows);
    break;
  }

  // ===== CREAR =====
  case 'crear':
  case 'create': {
    $data = [
      // Imagen
      'image_src'     => '',          // siempre NOT NULL en BD
      'image_data'    => null,        // filename
      'image_mime'    => null,

      // Metadatos
      'image_alt'     => trim($_POST['image_alt'] ?? 'Imagen'),
      'badge_text'    => nullIfEmpty($_POST['badge_text'] ?? null),
      'title'         => trim($_POST['title'] ?? ''),
      'description'   => trim($_POST['description'] ?? ''),
      'footer_text'   => nullIfEmpty($_POST['footer_text'] ?? null),
      'button_label'  => trim($_POST['button_label'] ?? 'Ver Detalles'),
      'button_url'    => nullIfEmpty($_POST['button_url'] ?? null),
      'is_active'     => isset($_POST['is_active']) ? (int)$_POST['is_active'] : 1,
      'display_order' => (int)($_POST['display_order'] ?? 0),
    ];

    // Validación básica
    if ($data['title'] === '' || $data['description'] === '') {
      b(false, ['message' => 'title y description son obligatorios']);
    }

    try {
      // ¿Archivo subido?
      if (hasFile('image')) {
        [$filename, $publicPath, $mime] = store_uploaded_image($_FILES['image'], $UPLOAD_DIR, $PUBLIC_BASE);
        $data['image_src']  = $publicPath;
        $data['image_data'] = $filename;
        $data['image_mime'] = $mime;
      } else {
        // ¿URL pegada opcional?
        $url = trim($_POST['image_src_text'] ?? '');
        if ($url !== '') {
          $data['image_src']  = $url;
          $data['image_data'] = basename(parse_url($url, PHP_URL_PATH) ?? '') ?: null;
          $data['image_mime'] = null;
        } else {
          // sin imagen → image_src vacío (NOT NULL)
          $data['image_src'] = '';
        }
      }

      $newId = $model->crear($data);
      b(true, ['id' => $newId]);
    } catch (Throwable $e) {
      b(false, ['message' => 'Error al crear', 'error' => $e->getMessage()]);
    }
    break;
  }

  // ===== ACTUALIZAR =====
  case 'actualizar':
  case 'update': {
    $id = (int)($_POST['id'] ?? 0);
    if ($id <= 0) b(false, ['message' => 'ID inválido']);

    $keep = (int)($_POST['keep_current_image'] ?? 1) === 1;

    try {
      $current = $model->obtener($id);
      if (!$current) b(false, ['message' => 'Registro no encontrado']);

      $new_image_src  = null;
      $new_image_data = null;
      $new_image_mime = null;

      if (hasFile('image')) {
        // Subiste un archivo nuevo
        [$filename, $publicPath, $mime] = store_uploaded_image($_FILES['image'], $UPLOAD_DIR, $PUBLIC_BASE);
        // Borrar anterior si era nuestro
        maybe_delete_old($current['image_src'] ?? '', $UPLOAD_DIR, $PUBLIC_BASE);

        $new_image_src  = $publicPath;
        $new_image_data = $filename;
        $new_image_mime = $mime;

      } elseif (trim($_POST['image_src_text'] ?? '') !== '') {
        // Pegaste una URL
        $url = trim($_POST['image_src_text']);
        maybe_delete_old($current['image_src'] ?? '', $UPLOAD_DIR, $PUBLIC_BASE);

        $new_image_src  = $url;
        $new_image_data = basename(parse_url($url, PHP_URL_PATH) ?? '') ?: null;
        $new_image_mime = null;

      } else {
        // No hay archivo ni URL
        if ($keep) {
          // Conservar lo actual
          $new_image_src  = $current['image_src'] ?? '';
          $new_image_data = $current['image_data'] ?? null;
          $new_image_mime = $current['image_mime'] ?? null;
        } else {
          // Quitar imagen
          maybe_delete_old($current['image_src'] ?? '', $UPLOAD_DIR, $PUBLIC_BASE);
          $new_image_src  = '';     // NOT NULL
          $new_image_data = null;
          $new_image_mime = null;
        }
      }

      $data = [
        'image_src'     => $new_image_src,
        'image_data'    => $new_image_data,
        'image_mime'    => $new_image_mime,
        'image_alt'     => trim($_POST['image_alt'] ?? 'Imagen'),
        'badge_text'    => nullIfEmpty($_POST['badge_text'] ?? null),
        'title'         => trim($_POST['title'] ?? ''),
        'description'   => trim($_POST['description'] ?? ''),
        'footer_text'   => nullIfEmpty($_POST['footer_text'] ?? null),
        'button_label'  => trim($_POST['button_label'] ?? 'Ver Detalles'),
        'button_url'    => nullIfEmpty($_POST['button_url'] ?? null),
        'is_active'     => isset($_POST['is_active']) ? (int)$_POST['is_active'] : 1,
        'display_order' => (int)($_POST['display_order'] ?? 0),
      ];

      if ($data['title'] === '' || $data['description'] === '') {
        b(false, ['message' => 'title y description son obligatorios']);
      }

      $ok = $model->actualizar($id, $data);
      b($ok);
    } catch (Throwable $e) {
      b(false, ['message' => 'Error al actualizar', 'error' => $e->getMessage()]);
    }
    break;
  }

  // ===== ELIMINAR =====
  case 'eliminar':
  case 'delete': {
    $id = (int)($_POST['id'] ?? 0);
    if ($id <= 0) b(false, ['message' => 'ID inválido']);

    try {
      $current = $model->obtener($id);
      if (!$current) b(false, ['message' => 'Registro no encontrado']);

      $ok = $model->eliminar($id);
      if ($ok) {
        // borrar archivo si era nuestro
        maybe_delete_old($current['image_src'] ?? '', $UPLOAD_DIR, $PUBLIC_BASE);
      }
      b($ok);
    } catch (Throwable $e) {
      b(false, ['message' => 'Error al eliminar', 'error' => $e->getMessage()]);
    }
    break;
  }

  // ===== MOSTRAR/OCULTAR =====
  case 'toggle_active': {
    $id = (int)($_POST['id'] ?? 0);
    $is_active = (int)($_POST['is_active'] ?? 1);
    if ($id <= 0) b(false, ['message' => 'ID inválido']);

    try {
      $ok = $model->setActivo($id, $is_active);
      b($ok);
    } catch (Throwable $e) {
      b(false, ['message' => 'Error al cambiar estado', 'error' => $e->getMessage()]);
    }
    break;
  }

  default:
    echo json_encode(['error' => 'Acción no válida']);
    break;
}
