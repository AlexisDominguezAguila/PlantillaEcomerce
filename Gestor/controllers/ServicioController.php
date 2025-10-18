<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../models/ServiciosModel.php';
require_once __DIR__ . '/../../config/db.php';

$db = (new Database())->connect();
$servicio = new Servicio($db);

$action = $_GET['action'] ?? '';

function nullIfEmpty($v) {
    return ($v === '' || !isset($v)) ? null : $v;
}

switch ($action) {

    case 'listar':
        echo json_encode($servicio->obtenerServicios());
        break;

    case 'crear':
        // Normalizar entrada
        $data = [
            'titulo'         => trim($_POST['titulo'] ?? ''),
            'descripcion'    => trim($_POST['descripcion'] ?? ''),
            'caracteristicas'=> trim($_POST['caracteristicas'] ?? ''),
            'precio_min'     => nullIfEmpty($_POST['precio_min'] ?? null),
            'precio_max'     => nullIfEmpty($_POST['precio_max'] ?? null),
            'etiqueta'       => trim($_POST['etiqueta'] ?? ''),
            'enlace'         => trim($_POST['enlace'] ?? ''),
            'icono'          => trim($_POST['icono'] ?? ''),
            'destacado'      => isset($_POST['destacado']) ? 1 : 0,
            'active'         => isset($_POST['active']) ? 1 : 0
        ];

        // Validación mínima
        if ($data['titulo'] === '' || $data['descripcion'] === '') {
            echo json_encode(['success' => false, 'message' => 'Título y descripción son obligatorios']);
            break;
        }

        $ok = $servicio->crearServicio($data);
        echo json_encode(['success' => $ok]);
        break;

    case 'actualizar':
        $data = [
            'id'             => (int)($_POST['id'] ?? 0),
            'titulo'         => trim($_POST['titulo'] ?? ''),
            'descripcion'    => trim($_POST['descripcion'] ?? ''),
            'caracteristicas'=> trim($_POST['caracteristicas'] ?? ''),
            'precio_min'     => nullIfEmpty($_POST['precio_min'] ?? null),
            'precio_max'     => nullIfEmpty($_POST['precio_max'] ?? null),
            'etiqueta'       => trim($_POST['etiqueta'] ?? ''),
            'enlace'         => trim($_POST['enlace'] ?? ''),
            'icono'          => trim($_POST['icono'] ?? ''),
            'destacado'      => isset($_POST['destacado']) ? 1 : 0,
            'active'         => isset($_POST['active']) ? 1 : 0
        ];

        if ($data['id'] <= 0) {
            echo json_encode(['success' => false, 'message' => 'ID inválido']);
            break;
        }
        if ($data['titulo'] === '' || $data['descripcion'] === '') {
            echo json_encode(['success' => false, 'message' => 'Título y descripción son obligatorios']);
            break;
        }

        $ok = $servicio->actualizarServicio($data);
        echo json_encode(['success' => $ok]);
        break;

    case 'eliminar':
        $id = (int)($_POST['id'] ?? 0);
        if ($id <= 0) {
            echo json_encode(['success' => false, 'message' => 'ID inválido']);
            break;
        }
        $ok = $servicio->eliminarServicio($id);
        echo json_encode(['success' => $ok]);
        break;

    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}
