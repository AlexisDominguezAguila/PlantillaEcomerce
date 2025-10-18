<?php
require_once __DIR__ . '/../../config/db.php'; // conexión PDO

class Servicio {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function obtenerServicios() {
        $query = "SELECT * FROM servicios ORDER BY id DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function crearServicio($data) {
        $sql = "INSERT INTO servicios 
            (titulo, descripcion, caracteristicas, precio_min, precio_max, etiqueta, enlace, icono, destacado, active)
            VALUES
            (:titulo, :descripcion, :caracteristicas, :precio_min, :precio_max, :etiqueta, :enlace, :icono, :destacado, :active)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($data);
    }

    public function actualizarServicio($data) {
        $sql = "UPDATE servicios SET 
            titulo = :titulo,
            descripcion = :descripcion,
            caracteristicas = :caracteristicas,
            precio_min = :precio_min,
            precio_max = :precio_max,
            etiqueta = :etiqueta,
            enlace = :enlace,
            icono = :icono,
            destacado = :destacado,
            active = :active
        WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($data);
    }

    public function eliminarServicio($id) {
        $stmt = $this->conn->prepare("DELETE FROM servicios WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
