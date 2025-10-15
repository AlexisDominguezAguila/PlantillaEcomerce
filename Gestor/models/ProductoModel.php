<?php
require_once __DIR__ . '/../../config/db.php';

class ProductoModel {
    private $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    // ==================== CREAR PRODUCTO ====================
    public function crearProducto($data) {
        try {
            $this->conn->beginTransaction();

            $sql = "INSERT INTO products 
                    (name, category_id, sku, price, old_price, stock, min_stock, description, active, is_new, is_hot, is_offer)
                    VALUES (:name, :category_id, :sku, :price, :old_price, :stock, :min_stock, :description, :active, :is_new, :is_hot, :is_offer)";
            $stmt = $this->conn->prepare($sql);
            $ok = $stmt->execute([
                'name'        => $data['name'] ?? '',
                'category_id' => (int)($data['category_id'] ?? 1),
                'sku'         => $data['sku'] ?? '',
                'price'       => (float)($data['price'] ?? 0),
                'old_price'   => $data['old_price'] !== '' ? (float)$data['old_price'] : null,
                'stock'       => (int)($data['stock'] ?? 0),
                'min_stock'   => (int)($data['min_stock'] ?? 5),
                'description' => $data['description'] ?? '',
                'active'      => isset($data['active']) ? (int)$data['active'] : 1,
                'is_new'      => isset($data['is_new']) ? (int)$data['is_new'] : 0,
                'is_hot'      => isset($data['is_hot']) ? (int)$data['is_hot'] : 0,
                'is_offer'    => isset($data['is_offer']) ? (int)$data['is_offer'] : 0
            ]);

            if (!$ok) {
                $this->conn->rollBack();
                return false;
            }

            $productId = (int)$this->conn->lastInsertId();

            if (!empty($data['images']) && is_array($data['images'])) {
                $this->agregarImagenes($productId, $data['images']);
            }

            $this->conn->commit();
            return true;
        } catch (PDOException $e) {
            $this->conn->rollBack();
            error_log("Error crearProducto(): " . $e->getMessage());
            return false;
        }
    }

    // ==================== AGREGAR IMÁGENES ====================
    public function agregarImagenes($productId, $imagenes) {
        if (empty($imagenes) || !is_array($imagenes) || empty($productId)) return;

        $sql = "INSERT INTO product_images (product_id, image_url)
                SELECT :pid, :url
                WHERE NOT EXISTS (
                    SELECT 1 FROM product_images WHERE product_id = :pid AND image_url = :url
                )";
        $stmt = $this->conn->prepare($sql);

        foreach (array_unique($imagenes) as $img) {
            try {
                $stmt->execute([
                    'pid' => (int)$productId,
                    'url' => basename($img)
                ]);
            } catch (PDOException $e) {
                error_log("Error agregarImagenes(): " . $e->getMessage());
            }
        }
    }

    // ==================== ACTUALIZAR PRODUCTO ====================
    public function actualizarProducto($data) {
        try {
            $this->conn->beginTransaction();

            $sql = "UPDATE products SET
                        name = :name, category_id = :category_id, sku = :sku, price = :price,
                        old_price = :old_price, stock = :stock, min_stock = :min_stock,
                        description = :description, active = :active,
                        is_new = :is_new, is_hot = :is_hot, is_offer = :is_offer,
                        updated_at = NOW()
                    WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $ok = $stmt->execute([
                'id'          => (int)$data['id'],
                'name'        => $data['name'],
                'category_id' => (int)$data['category_id'],
                'sku'         => $data['sku'],
                'price'       => (float)$data['price'],
                'old_price'   => $data['old_price'] !== '' ? (float)$data['old_price'] : null,
                'stock'       => (int)$data['stock'],
                'min_stock'   => (int)$data['min_stock'],
                'description' => $data['description'],
                'active'      => (int)$data['active'],
                'is_new'      => (int)$data['is_new'],
                'is_hot'      => (int)$data['is_hot'],
                'is_offer'    => (int)$data['is_offer']
            ]);

            if (!$ok) {
                $this->conn->rollBack();
                return false;
            }

            if (!empty($data['images']) && is_array($data['images'])) {
                $this->agregarImagenes((int)$data['id'], $data['images']);
            }

            $this->conn->commit();
            return true;
        } catch (PDOException $e) {
            $this->conn->rollBack();
            error_log("Error actualizarProducto(): " . $e->getMessage());
            return false;
        }
    }

    // ==================== OBTENER CATEGORÍAS ====================
    public function obtenerCategorias() {
        $stmt = $this->conn->query("SELECT id, name FROM categories ORDER BY name ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ==================== OBTENER PRODUCTOS ====================
    public function obtenerProductos() {
        $sql = "SELECT 
                    p.*, 
                    c.name AS category_name,
                    GROUP_CONCAT(DISTINCT pi.image_url) AS image_urls
                FROM products p
                JOIN categories c ON p.category_id = c.id
                LEFT JOIN product_images pi ON p.id = pi.product_id
                GROUP BY p.id
                ORDER BY p.id DESC";
        $stmt = $this->conn->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ==================== OBTENER PRODUCTO POR ID ====================
    public function obtenerProducto($id) {
        $sql = "SELECT p.*, c.name AS category_name,
                       GROUP_CONCAT(DISTINCT pi.image_url) AS image_urls
                FROM products p
                JOIN categories c ON p.category_id = c.id
                LEFT JOIN product_images pi ON p.id = pi.product_id
                WHERE p.id = :id
                GROUP BY p.id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute(['id' => (int)$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // ==================== ELIMINAR PRODUCTO ====================
    public function eliminarProducto($id) {
        try {
            $this->conn->beginTransaction();

            $stmtImgs = $this->conn->prepare("SELECT image_url FROM product_images WHERE product_id = :id");
            $stmtImgs->execute(['id' => (int)$id]);
            $images = $stmtImgs->fetchAll(PDO::FETCH_COLUMN);

            foreach ($images as $img) {
                $path = __DIR__ . '/../../public/uploads/productos/' . $img;
                if (is_file($path)) @unlink($path);
            }

            $this->conn->prepare("DELETE FROM product_images WHERE product_id = :id")->execute(['id' => (int)$id]);
            $stmt = $this->conn->prepare("DELETE FROM products WHERE id = :id");
            $ok = $stmt->execute(['id' => (int)$id]);

            $this->conn->commit();
            return $ok;
        } catch (PDOException $e) {
            $this->conn->rollBack();
            error_log("Error eliminarProducto(): " . $e->getMessage());
            return false;
        }
    }
}
