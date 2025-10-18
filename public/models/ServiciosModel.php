<?php
require_once __DIR__ . '/../../config/db.php'; // conexión PDO

class ServiciosModel {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Obtener todos los servicios activos (para vista pública)
    public function obtenerServiciosActivos() {
        $sql = "SELECT id, titulo, descripcion, caracteristicas, precio_min, precio_max, etiqueta, enlace, icono 
                FROM servicios
                WHERE active = 1
                ORDER BY id DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener un servicio individual (para modal detallado si lo deseas)
    public function obtenerServicioPorId($id) {
        $sql = "SELECT * FROM servicios WHERE id = :id AND active = 1 LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
