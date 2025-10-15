<?php
header('Content-Type: application/json');

$component = $_GET['component'] ?? '';
if (!$component) {
    echo json_encode(['error' => 'No se especificó el componente']);
    exit;
}

// Mapeo de archivos según el tipo
$map = [
    'hero-1' => '../Components/heroes/hero1.php',
    'hero-2' => '../Components/heroes/hero2.php',
    'hero-3' => '../Components/heroes/hero3.php',
];

// Cargar datos del JSON
$dataFile = '../Data/components.json';
if (!file_exists($dataFile)) {
    echo json_encode(['error' => 'Archivo de datos no encontrado']);
    exit;
}
$data = json_decode(file_get_contents($dataFile), true);

if (!isset($map[$component]) || !isset($data[$component])) {
    echo json_encode(['error' => 'Componente no encontrado']);
    exit;
}

$props = $data[$component]['propiedades'];

// Iniciar buffer para capturar el HTML generado
ob_start();
include $map[$component];
$html = ob_get_clean();

echo json_encode(['html' => $html]);
