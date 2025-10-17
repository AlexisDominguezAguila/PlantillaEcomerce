<?php
header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../models/ProductosModel.php';
$model = new ProductosModel();

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'listar':
            // filtro por categoría opcional
            $cid = isset($_GET['category_id']) ? (int)$_GET['category_id'] : null;
            echo json_encode($model->listarProductos($cid));
            break;

        case 'categorias':
            echo json_encode($model->listarCategorias());
            break;

        default:
            echo json_encode(['error' => 'Acción no válida']);
            break;
    }
} catch (Throwable $e) {
    http_response_code(500);
    error_log("ProductosController error: " . $e->getMessage());
    echo json_encode(['error' => 'Error interno']);
}
