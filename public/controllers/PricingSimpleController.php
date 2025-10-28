<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../models/PricingSimpleModel.php';

$model = new PricingSimpleModel();
$action = $_GET['action'] ?? 'list';

switch ($action) {
  case 'list':
  case 'listar': {
    $rows = $model->listarActivos();
    echo json_encode(['success'=>true, 'data'=>$rows], JSON_UNESCAPED_UNICODE);
    break;
  }
  case 'range':
  case 'rango': {
    $r = $model->rangoPrecios();
    echo json_encode(['success'=>true, 'data'=>$r], JSON_UNESCAPED_UNICODE);
    break;
  }
  default:
    echo json_encode(['success'=>false, 'error'=>'Acción no válida']);
}
