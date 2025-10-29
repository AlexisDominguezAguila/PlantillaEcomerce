<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL); ini_set('display_errors', '0');

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../models/PricingModel.php';

// (Opcional) bloquear a no logueados con JSON (evita HTML de login que rompe fetch)
// session_start(); if (empty($_SESSION['usuario_id'])) { http_response_code(401); echo json_encode(['success'=>false,'error'=>'No autorizado']); exit; }

try {
  $pdo   = (new Database())->connect();
  $model = new PricingModel($pdo);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['success'=>false,'error'=>'DB: '.$e->getMessage()]);
  exit;
}

$action = $_GET['action'] ?? 'listar';

function ok($data=[], $extra=[]){ echo json_encode(array_merge(['success'=>true,'data'=>$data],$extra)); exit; }
function err($msg, $code=400){ http_response_code($code); echo json_encode(['success'=>false,'error'=>$msg]); exit; }

function slugify($s) {
  $s = mb_strtolower(trim($s),'UTF-8');
  $s = preg_replace('/[^\p{L}\p{Nd}]+/u','-', $s);
  return trim($s,'-') ?: 'plan';
}
function uniqueSlug(callable $existsFn, string $base, int $excludeId=0): string {
  $slug = $base; $i=2;
  while ($existsFn($slug, $excludeId)) { $slug = $base.'-'.$i; $i++; }
  return $slug;
}
function parseFeatures(): string {
  $features = [];
  if (isset($_POST['features_text'])) {
    $lines = preg_split("/\r\n|\r|\n/", (string)$_POST['features_text']);
    foreach ($lines as $ln) { $ln = trim($ln); if ($ln!=='') $features[] = $ln; }
  } elseif (!empty($_POST['caracteristicas'])) {
    $raw = trim((string)$_POST['caracteristicas']);
    $arr = json_decode($raw, true);
    if (is_array($arr)) foreach ($arr as $it) { $t=trim((string)$it); if ($t!=='') $features[]=$t; }
  }
  return json_encode($features, JSON_UNESCAPED_UNICODE);
}

switch ($action) {
  case 'listar': {
    ok($model->listar());
  }

  case 'obtener': {
    $id = (int)($_GET['id'] ?? 0);
    if ($id<=0) err('ID inválido');
    $r = $model->obtener($id);
    if (!$r) err('No encontrado',404);
    ok($r);
  }

  case 'crear': {
    $name = trim($_POST['name'] ?? '');
    if ($name==='') err('name requerido');

    $slugIn  = trim($_POST['slug'] ?? '');
    $base    = slugify($slugIn ?: $name);
    $slug    = uniqueSlug([$model,'existsSlug'], $base, 0);

    $data = [
      'slug'            => $slug,
      'name'            => $name,
      'description'     => trim($_POST['description'] ?? ''),
      'price_amount'    => (float)($_POST['price_amount'] ?? 0),
      'period_note'     => trim($_POST['period_note'] ?? '/mes · sin IGV'),
      'is_featured'     => isset($_POST['is_featured']) ? 1 : 0,
      'badge_text'      => trim($_POST['badge_text'] ?? ''),
      'cta1_label'      => trim($_POST['cta1_label'] ?? 'Empezar'),
      'cta1_url'        => trim($_POST['cta1_url'] ?? 'contacto.html'),
      'cta2_label'      => trim($_POST['cta2_label'] ?? 'Probar demo'),
      'cta2_url'        => trim($_POST['cta2_url'] ?? 'login.html'),
      'display_order'   => (int)($_POST['display_order'] ?? ($model->maxOrder()+1)),
      'caracteristicas' => parseFeatures(),
    ];
    $id = $model->crear($data);
    ok(['id'=>$id]);
  }

  case 'actualizar': {
    $id = (int)($_POST['id'] ?? 0);
    if ($id<=0) err('ID inválido');

    $curr = $model->obtener($id);
    if (!$curr) err('No encontrado',404);

    $name   = trim($_POST['name'] ?? $curr['name']);
    if ($name==='') err('name requerido');

    $slugIn = trim($_POST['slug'] ?? '');
    $base   = slugify($slugIn ?: $name);
    $slug   = uniqueSlug([$model,'existsSlug'], $base, $id);

    $data = [
      'slug'            => $slug,
      'name'            => $name,
      'description'     => trim($_POST['description'] ?? $curr['description']),
      'price_amount'    => (float)($_POST['price_amount'] ?? $curr['price_amount']),
      'period_note'     => trim($_POST['period_note'] ?? $curr['period_note']),
      'is_featured'     => isset($_POST['is_featured']) ? 1 : 0,
      'badge_text'      => trim($_POST['badge_text'] ?? $curr['badge_text']),
      'cta1_label'      => trim($_POST['cta1_label'] ?? $curr['cta1_label']),
      'cta1_url'        => trim($_POST['cta1_url'] ?? $curr['cta1_url']),
      'cta2_label'      => trim($_POST['cta2_label'] ?? $curr['cta2_label']),
      'cta2_url'        => trim($_POST['cta2_url'] ?? $curr['cta2_url']),
      'display_order'   => (int)($_POST['display_order'] ?? $curr['display_order']),
      'caracteristicas' => parseFeatures(),
    ];
    ok(['updated'=>$model->actualizar($id,$data)]);
  }

  case 'eliminar': {
    $id = (int)($_POST['id'] ?? 0);
    if ($id<=0) err('ID inválido');
    ok(['deleted'=>$model->eliminar($id)]);
  }

  case 'move': {
    $id  = (int)($_POST['id'] ?? 0);
    $dir = ($_POST['direction'] ?? 'up') === 'down' ? 'down' : 'up';
    if ($id<=0) err('ID inválido');
    ok(['moved'=>$model->move($id,$dir)]);
  }

  default:
    err('Acción no válida',404);
}
