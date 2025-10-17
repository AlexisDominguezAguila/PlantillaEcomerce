<?php
require_once __DIR__ . '/../../config/db.php';

class ProductosModel {
    private $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    /** Productos activos (opcional por categoría) – campos mínimos para público */
    public function listarProductos(?int $categoryId = null): array {
        $sql = "
            SELECT 
                p.id,
                p.name,
                p.price,
                p.description,
                p.category_id,
                c.name AS category_name,
                (SELECT pi.image_url 
                   FROM product_images pi 
                  WHERE pi.product_id = p.id 
                  ORDER BY pi.id ASC LIMIT 1) AS first_image
            FROM products p
            INNER JOIN categories c ON c.id = p.category_id
            WHERE p.active = 1
        ";

        $params = [];
        if ($categoryId) {
            $sql .= " AND p.category_id = :cid";
            $params[':cid'] = $categoryId;
        }

        $sql .= " ORDER BY p.id DESC";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    /** Categorías que tienen al menos 1 producto activo (o todas si prefieres) */
    public function listarCategorias(): array {
        $sql = "
            SELECT c.id, c.name, COUNT(p.id) AS total
            FROM categories c
            LEFT JOIN products p ON p.category_id = c.id AND p.active = 1
            GROUP BY c.id, c.name
            HAVING total > 0
            ORDER BY c.name ASC
        ";
        $stmt = $this->conn->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }
}
