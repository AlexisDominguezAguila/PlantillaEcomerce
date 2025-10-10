<?php
// Gestor/controllers/ProductoController.php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../models/ProductoModel.php';

$model = new ProductoModel();
$action = $_GET['action'] ?? '';

switch ($action) {
    /* ===========================================================
       LISTAR PRODUCTOS
    ============================================================ */
    case 'listar':
        echo json_encode($model->obtenerProductos());
        break;

    /* ===========================================================
       OBTENER PRODUCTO POR ID
    ============================================================ */
    case 'obtener':
        $id = $_GET['id'] ?? 0;
        echo json_encode($model->obtenerProducto($id));
        break;

    /* ===========================================================
       CREAR PRODUCTO NUEVO
    ============================================================ */
    case 'crear':
    try {
        $data = $_POST;

        // Asegurar que venga el category_id
        $data['category_id'] = $_POST['productCategory'] ?? 1;

        // Subida de imágenes
        $uploadedImages = [];
        if (!empty($_FILES['images']['name'][0])) {
            $uploadDir = __DIR__ . '/../../public/uploads/productos/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
                // ✅ Guardar solo el nombre del archivo
                $fileName = uniqid('prod_') . '_' . basename($_FILES['images']['name'][$key]);
                $targetFile = $uploadDir . $fileName;

                if (move_uploaded_file($tmpName, $targetFile)) {
                    $uploadedImages[] = $fileName; 
                }
            }
        }

        $data['images'] = $uploadedImages;

        $success = $model->crearProducto($data);

        echo json_encode(['success' => $success]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    break;


    /* ===========================================================
       ACTUALIZAR PRODUCTO
    ============================================================ */
    case 'actualizar':
        // Si se envía como JSON (por fetch)
        if (stripos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
            $data = json_decode(file_get_contents("php://input"), true);
        } else {
            $data = $_POST;
        }

        // Procesar nuevas imágenes si existen
        $uploadedImages = [];
        if (!empty($_FILES['images']['name'][0])) {
            $uploadDir = __DIR__ . '/../../public/uploads/productos/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
                $fileName = uniqid('prod_') . '_' . basename($_FILES['images']['name'][$key]);
                $targetFile = $uploadDir . $fileName;

                if (move_uploaded_file($tmpName, $targetFile)) {
                    $uploadedImages[] = 'public/uploads/productos/' . $fileName;
                }
            }
        }

        // Si se suben nuevas imágenes, podrían agregarse a la tabla product_images
        if (!empty($uploadedImages) && !empty($data['id'])) {
            foreach ($uploadedImages as $img) {
                $imgStmt = $model->conn->prepare("INSERT INTO product_images (product_id, image_url) VALUES (:pid, :url)");
                $imgStmt->execute(['pid' => $data['id'], 'url' => $img]);
            }
        }

        echo json_encode(['success' => $model->actualizarProducto($data)]);
        break;
    /* ===========================================================
       OBTENER CATEGORÍAS
    ============================================================ */
    case 'categorias':
        echo json_encode($model->obtenerCategorias());
        break;

    /* ===========================================================
       ELIMINAR PRODUCTO
    ============================================================ */
    case 'eliminar':
        $id = $_GET['id'] ?? 0;
        echo json_encode(['success' => $model->eliminarProducto($id)]);
        break;

    /* ===========================================================
       ACCIÓN NO VÁLIDA
    ============================================================ */
    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}
?>
