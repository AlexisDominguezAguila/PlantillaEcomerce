<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../models/GestionModel.php'; // Debe contener la clase ProductCard
require_once __DIR__ . '/../../config/db.php';

$db = (new Database())->connect();
$model = new ProductCard($db);

$action = $_GET['action'] ?? '';

function nullIfEmpty($v) { return ($v === '' || !isset($v)) ? null : $v; }
function b($ok, $extra = []) { echo json_encode(array_merge(['success' => (bool)$ok], $extra)); exit; }

// ---------- Validación subida (una sola imagen a BD) ----------
$MAX_BYTES    = 5 * 1024 * 1024;
$ALLOWED_MIME = ['image/png','image/jpeg','image/webp','image/gif'];

function hasFile($key = 'image') {
  return isset($_FILES[$key]) && !empty($_FILES[$key]['name']);
}
function detectMime($tmpPath) {
  $f = new finfo(FILEINFO_MIME_TYPE);
  return $f->file($tmpPath) ?: 'application/octet-stream';
}

switch ($action) {

  // ===== LISTAR =====
  case 'listar':
  case 'list': {
    $onlyActive = isset($_GET['only_active']) ? (int)$_GET['only_active'] === 1 : false;
    $rows = $model->listar($onlyActive);

    // Crear dataURL y NO devolver el binario crudo
    foreach ($rows as &$r) {
      if (!empty($r['image_data']) && !empty($r['image_mime'])) {
        $r['image_data_url'] = 'data:' . $r['image_mime'] . ';base64,' . base64_encode($r['image_data']);
      } else {
        $r['image_data_url'] = null;
      }
      unset($r['image_data']); // ahorrar peso
    }
    echo json_encode($rows);
    break;
  }

  // ===== CREAR (requiere imagen) =====
  case 'crear':
  case 'create': {
    $data = [
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
    if (!hasFile('image')) {
      b(false, ['message' => 'Sube una imagen (campo "image")']);
    }

    try {
      $newId = $model->crear($data);

      $tmp  = $_FILES['image']['tmp_name'];
      $size = (int)$_FILES['image']['size'];
      if ($size <= 0 || $size > $MAX_BYTES) b(false, ['message' => 'Imagen inválida o demasiado grande']);

      $mime = detectMime($tmp);
      if (!in_array($mime, $ALLOWED_MIME, true)) b(false, ['message' => 'Formato de imagen no permitido']);

      $blob = file_get_contents($tmp);
      if ($blob === false) b(false, ['message' => 'Error leyendo la imagen']);

      $model->actualizarImagen($newId, $mime, $blob);
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

    $data = [
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

    try {
      // 1) Actualiza metadatos
      $model->actualizar($id, $data);

      // 2) Imagen: si subes nueva => reemplaza; si no y keep_current_image=0 => quita; si keep=1 => mantiene
      if (hasFile('image')) {
        $tmp  = $_FILES['image']['tmp_name'];
        $size = (int)$_FILES['image']['size'];
        if ($size <= 0 || $size > $MAX_BYTES) b(false, ['message' => 'Imagen inválida o demasiado grande']);

        $mime = detectMime($tmp);
        if (!in_array($mime, $ALLOWED_MIME, true)) b(false, ['message' => 'Formato de imagen no permitido']);

        $blob = file_get_contents($tmp);
        if ($blob === false) b(false, ['message' => 'Error leyendo la imagen']);

        $model->actualizarImagen($id, $mime, $blob);
      } else {
        $keep = (int)($_POST['keep_current_image'] ?? 1) === 1;
        if (!$keep) {
          $model->limpiarImagen($id);
        }
      }

      b(true);
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
      $ok = $model->eliminar($id);
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
