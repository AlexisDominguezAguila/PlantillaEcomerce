<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../models/ServiciosModel.php';
require_once __DIR__ . '/../../config/db.php';

$db = (new Database())->connect();
$servicio = new ServiciosModel($db);

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'listar':
        echo json_encode($servicio->obtenerServiciosActivos());
        break;

    case 'detalle':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if ($id > 0) {
            $data = $servicio->obtenerServicioPorId($id);
            echo json_encode($data ?: []);
        } else {
            echo json_encode(['error' => 'ID inválido']);
        }
        break;

    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}
