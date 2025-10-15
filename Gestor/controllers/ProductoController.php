<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../models/ProductoModel.php';
$model = new ProductoModel();

$action = $_GET['action'] ?? '';

switch ($action) {

    case 'listar':
        echo json_encode($model->obtenerProductos());
        break;

    case 'obtener':
        $id = (int)($_GET['id'] ?? 0);
        echo json_encode($model->obtenerProducto($id));
        break;

    case 'crear':
        try {
            $data = $_POST;
            $data['category_id'] = isset($_POST['productCategory']) ? (int)$_POST['productCategory'] : 1;

            // Procesar imágenes subidas
            $uploadedImages = [];
            if (!empty($_FILES['images']['name'][0])) {
                $uploadDir = __DIR__ . '/../../public/uploads/productos/';
                if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

                foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
                    $fileName = uniqid('prod_') . '_' . basename($_FILES['images']['name'][$key]);
                    $targetFile = $uploadDir . $fileName;
                    if (move_uploaded_file($tmpName, $targetFile)) {
                        $uploadedImages[] = $fileName;
                    }
                }
            }

            $data['images'] = array_unique($uploadedImages);
            $success = $model->crearProducto($data);

            echo json_encode(['success' => $success]);
        } catch (Exception $e) {
            http_response_code(500);
            error_log("Error crear: " . $e->getMessage());
            echo json_encode(['success' => false, 'error' => 'Error interno del servidor']);
        }
        break;

    case 'actualizar':
        try {
            $data = $_POST;
            $data['category_id'] = isset($_POST['productCategory']) ? (int)$_POST['productCategory'] : 1;

            $uploadedImages = [];
            if (!empty($_FILES['images']['name'][0])) {
                $uploadDir = __DIR__ . '/../../public/uploads/productos/';
                if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

                foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
                    $fileName = uniqid('prod_') . '_' . basename($_FILES['images']['name'][$key]);
                    $targetFile = $uploadDir . $fileName;
                    if (move_uploaded_file($tmpName, $targetFile)) {
                        $uploadedImages[] = $fileName;
                    }
                }
            }

            if (!empty($uploadedImages)) {
                $data['images'] = array_unique($uploadedImages);
            }

            $success = $model->actualizarProducto($data);
            echo json_encode(['success' => $success]);
        } catch (Exception $e) {
            http_response_code(500);
            error_log("Error actualizar: " . $e->getMessage());
            echo json_encode(['success' => false, 'error' => 'Error interno del servidor']);
        }
        break;

    case 'categorias':
        echo json_encode($model->obtenerCategorias());
        break;

    case 'eliminar':
        $id = (int)($_GET['id'] ?? 0);
        if ($id > 0) {
            echo json_encode(['success' => $model->eliminarProducto($id)]);
        } else {
            echo json_encode(['success' => false, 'error' => 'ID inválido']);
        }
        break;

    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}
