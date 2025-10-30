<?php


header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../models/ProductosModel.php';
$model = new ProductosModel();

/* ==== helpers de respuesta ==== */
function ok($data, array $extra = []) {
  echo json_encode(array_merge(['success' => true, 'data' => $data], $extra), JSON_UNESCAPED_UNICODE);
  exit;
}
function fail($msg, int $httpCode = 400, array $extra = []) {
  http_response_code($httpCode);
  echo json_encode(array_merge(['success' => false, 'error' => $msg], $extra), JSON_UNESCAPED_UNICODE);
  exit;
}

/* ==== helpers de parámetros ==== */
function getInt($key, $default = null) {
  if (!isset($_GET[$key]) || $_GET[$key] === '') return $default;
  return (int)$_GET[$key];
}
function getFloat($key, $default = null) {
  if (!isset($_GET[$key]) || $_GET[$key] === '') return $default;
  return (float)$_GET[$key];
}
function getStr($key, $default = null) {
  if (!isset($_GET[$key])) return $default;
  $v = trim((string)$_GET[$key]);
  return $v === '' ? $default : $v;
}

$action = $_GET['action'] ?? '';

try {
  switch ($action) {

    /* Slide de productos destacados */
    case 'destacados': {
      $limit = getInt('limit', 12);
      $rows = $model->listarDestacados($limit);
      ok($rows);
    }

    /* Oferta relámpago activa  */
    case 'flash': {
      $deal = $model->obtenerFlashDealActiva();
      ok($deal); 
    }

    /* Top más vendidos  */
    case 'masvendidos': {
      $limit = getInt('limit', 10);
      $rows = $model->listarMasVendidos($limit);
      ok($rows);
    }

    /* Catálogo con filtros y paginación */
    case 'catalogo': {
      $cid    = getInt('category_id', null);
      $q      = getStr('q', null);
      $pmin   = getFloat('pmin', null);
      $pmax   = getFloat('pmax', null);
      $limit  = getInt('limit', 24);
      $offset = getInt('offset', 0);

      $rows = $model->listarCatalogo($cid, $q, $pmin, $pmax, $limit, $offset);
      ok($rows, [
        'meta' => [
          'category_id' => $cid, 'q' => $q, 'pmin' => $pmin, 'pmax' => $pmax,
          'limit' => $limit, 'offset' => $offset
        ]
      ]);
    }

    /* Compat: 'listar' = catálogo sin filtros */
    case 'listar': {
      $rows = $model->listarCatalogo(null, null, null, null, 24, 0);
      ok($rows);
    }

    /* Detalle de producto */
    case 'detalle': {
      $id = getInt('id');
      if (!$id) fail('Parámetro id requerido', 422);
      $prod = $model->obtenerProducto($id);
      if (!$prod) fail('Producto no encontrado', 404);
      ok($prod);
    }

    /* Recomendados por categoría */
    case 'recomendados': {
      $cid   = getInt('category_id');
      if (!$cid) fail('Parámetro category_id requerido', 422);
      $excl  = getInt('exclude_id', 0);
      $limit = getInt('limit', 8);
      $rows  = $model->listarRecomendadosPorCategoria($cid, $excl, $limit);
      ok($rows);
    }

    /* Listado de categorías con conteo  */
    case 'categorias': {
      $rows = $model->listarCategorias(true);
      ok($rows);
    }

    /* Rango de precios (min/max) para slider de filtros */
    case 'rango': {
      $r = $model->rangoPrecios();
      ok($r);
    }

    default:
      fail('Acción no válida', 400);
  }

} catch (Throwable $e) {
  error_log("ProductosController error: " . $e->getMessage());
  fail('Error interno', 500);
}
