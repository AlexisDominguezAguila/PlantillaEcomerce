<?php
require_once __DIR__ . '/../../config/db.php';

class ProductoModel {
    private $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
    }

    // Crear nuevo producto
    public function crearProducto($data) {
        try {
            $sql = "INSERT INTO products 
                    (name, category_id, sku, price, old_price, stock, min_stock, description, active, is_new, is_hot, is_offer)
                    VALUES (:name, :category_id, :sku, :price, :old_price, :stock, :min_stock, :description, :active, :is_new, :is_hot, :is_offer)";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                'name'        => $data['name'] ?? '',
                'category_id' => $data['category_id'] ?? 1,
                'sku'         => $data['sku'] ?? '',
                'price'       => $data['price'] ?? 0,
                'old_price'   => $data['old_price'] ?? null,
                'stock'       => $data['stock'] ?? 0,
                'min_stock'   => $data['min_stock'] ?? 5,
                'description' => $data['description'] ?? '',
                'active'      => isset($data['active']) ? (int)$data['active'] : 1,
                'is_new'      => isset($data['is_new']) ? (int)$data['is_new'] : 0,
                'is_hot'      => isset($data['is_hot']) ? (int)$data['is_hot'] : 0,
                'is_offer'    => isset($data['is_offer']) ? (int)$data['is_offer'] : 0
            ]);

            $productId = $this->conn->lastInsertId();

            if (!empty($data['images']) && is_array($data['images'])) {
                $this->agregarImagenes($productId, $data['images']);
            }

            return true;
        } catch (PDOException $e) {
            error_log("Error crearProducto(): " . $e->getMessage());
            echo json_encode(['error' => $e->getMessage()]);
            return false;
        }
    }


    public function agregarImagenes($productId, $imagenes) {
    if (empty($imagenes) || !is_array($imagenes) || empty($productId)) {
        error_log("⚠️ agregarImagenes() no ejecutado: sin imágenes o sin product_id");
        return;
    }

    $sql = "INSERT INTO product_images (product_id, image_url) VALUES (:pid, :url)";
    $stmt = $this->conn->prepare($sql);

    foreach (array_unique($imagenes) as $img) {
        if (!empty($img)) {
            try {
                $stmt->execute([
                    'pid' => $productId,
                    'url' => basename($img)
                ]);
                error_log("Imagen insertada: PID=$productId → " . basename($img));
            } catch (PDOException $e) {
                error_log("Error insertar imagen: " . $e->getMessage());
            }
        }
    }
}


    // Obtener todas las categorías
    public function obtenerCategorias() {
        $sql = "SELECT id, name FROM categories ORDER BY name ASC";
        $stmt = $this->conn->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener productos con imágenes
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

    // Obtener un producto por ID
    public function obtenerProducto($id) {
        $sql = "SELECT p.*, c.name AS category_name,
                       GROUP_CONCAT(DISTINCT pi.image_url) AS image_urls
                FROM products p
                JOIN categories c ON p.category_id = c.id
                LEFT JOIN product_images pi ON p.id = pi.product_id
                WHERE p.id = :id
                GROUP BY p.id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Actualizar producto
    public function actualizarProducto($data) {
        try {
            $sql = "UPDATE products SET
                        name = :name, category_id = :category_id, sku = :sku, price = :price,
                        old_price = :old_price, stock = :stock, min_stock = :min_stock,
                        description = :description, active = :active,
                        is_new = :is_new, is_hot = :is_hot, is_offer = :is_offer,
                        updated_at = NOW()
                    WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute([
                'id'          => $data['id'],
                'name'        => $data['name'],
                'category_id' => $data['category_id'],
                'sku'         => $data['sku'],
                'price'       => $data['price'],
                'old_price'   => $data['old_price'],
                'stock'       => $data['stock'],
                'min_stock'   => $data['min_stock'],
                'description' => $data['description'],
                'active'      => (int)$data['active'],
                'is_new'      => (int)$data['is_new'],
                'is_hot'      => (int)$data['is_hot'],
                'is_offer'    => (int)$data['is_offer']
            ]);

            return true;
        } catch (PDOException $e) {
            error_log("Error al actualizar producto: " . $e->getMessage());
            echo json_encode(['error' => $e->getMessage()]);
            return false;
        }
    }

    // Eliminar producto
    public function eliminarProducto($id) {
        $sql = "DELETE FROM products WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute(['id' => $id]);
    }
}
?>
