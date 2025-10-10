<?php
// admin/models/ProductoModel.php
require_once __DIR__ . '/../../config/db.php';

class ProductoModel {
    private $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
    }

    // Crear nuevo producto
    public function crearProducto($data) {
        $sql = "INSERT INTO products 
                (name, category_id, sku, price, old_price, stock, min_stock, description, active, is_new, is_hot, is_offer)
                VALUES (:name, :category_id, :sku, :price, :old_price, :stock, :min_stock, :description, :active, :is_new, :is_hot, :is_offer)";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($data);
        $productId = $this->conn->lastInsertId();

        if (!empty($data['images'])) {
            foreach ($data['images'] as $img) {
                $imgStmt = $this->conn->prepare("INSERT INTO product_images (product_id, image_url) VALUES (:pid, :url)");
                $imgStmt->execute(['pid' => $productId, 'url' => $img]);
            }
        }
        return true;
    }


    // Listar todos los productos
    public function obtenerProductos() {
        $sql = "SELECT p.*, c.name AS category_name 
                FROM products p 
                JOIN categories c ON p.category_id = c.id
                ORDER BY p.id DESC";
        $stmt = $this->conn->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener producto por ID
    public function obtenerProducto($id) {
        $sql = "SELECT * FROM products WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Actualizar producto
    public function actualizarProducto($data) {
        $sql = "UPDATE products SET
                name = :name, category_id = :category_id, sku = :sku, price = :price,
                old_price = :old_price, stock = :stock, min_stock = :min_stock,
                description = :description, active = :active,
                is_new = :is_new, is_hot = :is_hot, is_offer = :is_offer,
                updated_at = NOW()
                WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($data);
    }

    // Eliminar producto
    public function eliminarProducto($id) {
        $sql = "DELETE FROM products WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute(['id' => $id]);
    }
}
?>
