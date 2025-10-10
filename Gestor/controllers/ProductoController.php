<?php
// admin/controllers/ProductoController.php
header('Content-Type: application/json');
require_once __DIR__ . '/../models/ProductoModel.php';

$model = new ProductoModel();

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'listar':
        echo json_encode($model->obtenerProductos());
        break;

    case 'obtener':
        $id = $_GET['id'] ?? 0;
        echo json_encode($model->obtenerProducto($id));
        break;

    case 'crear':
    $data = $_POST;

    // Subida de imágenes
    $uploadedImages = [];
    if (!empty($_FILES['images']['name'][0])) {
        $uploadDir = __DIR__ . '/../../public/uploads/productos/';
        foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
            $fileName = uniqid('prod_') . '_' . basename($_FILES['images']['name'][$key]);
            $targetFile = $uploadDir . $fileName;
            if (move_uploaded_file($tmpName, $targetFile)) {
                $uploadedImages[] = 'public/uploads/productos/' . $fileName;
            }
        }
    }

    $data['images'] = $uploadedImages;
    echo json_encode(['success' => $model->crearProducto($data)]);
    break;


    case 'actualizar':
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode(['success' => $model->actualizarProducto($data)]);
        break;

    case 'eliminar':
        $id = $_GET['id'] ?? 0;
        echo json_encode(['success' => $model->eliminarProducto($id)]);
        break;

    default:
        echo json_encode(['error' => 'Acción no válida']);
}
?>
