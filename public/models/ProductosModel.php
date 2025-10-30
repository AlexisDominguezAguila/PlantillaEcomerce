<?php
require_once __DIR__ . '/../../config/db.php';

class ProductosModel {
    private PDO $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    /* ================================
       Helpers internos
    =================================== */

    /** Convierte "url1||url2||url3" → [url1, url2, url3] */
    private function splitImages(?string $concat): array {
        if (!$concat) return [];
        return array_values(array_filter(array_map('trim', explode('||', $concat))));
    }

    /** Convierte fila de specs (specification="a;b;c") a array de valores */
    private function parseSpecValues(string $spec): array {
        $raw = array_map('trim', explode(';', $spec));
        return array_values(array_filter($raw, fn($v) => $v !== ''));
    }

    /* ================================
       0) Rango de precios
    =================================== */
    public function rangoPrecios(): array {
        $sql = "SELECT 
                    MIN(p.price) AS min_price, 
                    MAX(p.price) AS max_price
                FROM products p
                WHERE p.active = 1";
        return $this->conn->query($sql)->fetch(PDO::FETCH_ASSOC) ?: ['min_price'=>0,'max_price'=>0];
    }

    /* ================================
       1) Slide: productos destacados
    =================================== */
    public function listarDestacados(int $limit = 12): array {
        $sql = "
            SELECT 
                p.id, p.name, p.price, p.old_price,
                p.is_new, p.is_hot, p.is_offer,
                c.id AS category_id, c.name AS category_name,
                (SELECT GROUP_CONCAT(pi.image_url ORDER BY pi.id SEPARATOR '||')
                   FROM product_images pi
                  WHERE pi.product_id = p.id) AS images_concat
            FROM products p
            INNER JOIN categories c ON c.id = p.category_id
            WHERE p.active = 1 AND p.is_featured = 1
            ORDER BY p.id DESC
            LIMIT :lim
        ";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        foreach ($rows as &$r) {
            $r['images'] = $this->splitImages($r['images_concat'] ?? null);
            unset($r['images_concat']);
        }
        return $rows;
    }

    /* ================================
       2) Oferta relámpago (exactamente 3)
          Devuelve cabecera + items + segundos restantes
    =================================== */
    public function obtenerFlashDealActiva(): ?array {
        // Trae la oferta activa cuyo NOW() está dentro del rango
        $sql = "
            SELECT 
                fd.id, fd.name, fd.starts_at, fd.ends_at, fd.active,
                GREATEST(0, TIMESTAMPDIFF(SECOND, NOW(), fd.ends_at)) AS seconds_left
            FROM flash_deals fd
            WHERE fd.active = 1
              AND NOW() BETWEEN fd.starts_at AND fd.ends_at
            ORDER BY fd.starts_at DESC
            LIMIT 1
        ";
        $deal = $this->conn->query($sql)->fetch(PDO::FETCH_ASSOC);
        if (!$deal) return null;

        // Trae 3 productos con su info e imágenes
        $sqlItems = "
            SELECT 
                fdi.position,
                p.id, p.name, p.price, p.old_price,
                p.is_new, p.is_hot, p.is_offer,
                c.id AS category_id, c.name AS category_name,
                (SELECT GROUP_CONCAT(pi.image_url ORDER BY pi.id SEPARATOR '||')
                   FROM product_images pi
                  WHERE pi.product_id = p.id) AS images_concat
            FROM flash_deal_items fdi
            INNER JOIN products p   ON p.id = fdi.product_id
            INNER JOIN categories c ON c.id = p.category_id
            WHERE fdi.flash_deal_id = :deal_id
            ORDER BY fdi.position ASC
        ";
        $stmt = $this->conn->prepare($sqlItems);
        $stmt->execute([':deal_id' => $deal['id']]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

        foreach ($items as &$it) {
            $it['images'] = $this->splitImages($it['images_concat'] ?? null);
            unset($it['images_concat']);
        }

        $deal['items'] = $items;
        return $deal;
    }

    /* ================================
       3) Más vendidos (top 10 por flag)
    =================================== */
    public function listarMasVendidos(int $limit = 10): array {
        $sql = "
            SELECT 
                p.id, p.name, p.price, p.old_price,
                p.is_new, p.is_hot, p.is_offer,
                c.id AS category_id, c.name AS category_name,
                (SELECT GROUP_CONCAT(pi.image_url ORDER BY pi.id SEPARATOR '||')
                   FROM product_images pi
                  WHERE pi.product_id = p.id) AS images_concat
            FROM products p
            INNER JOIN categories c ON c.id = p.category_id
            WHERE p.active = 1 AND p.is_best_seller = 1
            ORDER BY p.id DESC
            LIMIT :lim
        ";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        foreach ($rows as &$r) {
            $r['images'] = $this->splitImages($r['images_concat'] ?? null);
            unset($r['images_concat']);
        }
        return $rows;
    }

    /* ================================
       4) Catálogo con filtros (cards)
          - categoria, búsqueda por nombre, rango de precios
          - devuelve imágenes para slide + flags hot/new/offer
    =================================== */
    public function listarCatalogo(
        ?int $categoryId = null,
        ?string $search = null,
        ?float $minPrice = null,
        ?float $maxPrice = null,
        int $limit = 24,
        int $offset = 0
    ): array {
        $sql = "
            SELECT 
                p.id, p.name, p.price, p.old_price,
                p.is_new, p.is_hot, p.is_offer,
                c.id AS category_id, c.name AS category_name,
                (SELECT GROUP_CONCAT(pi.image_url ORDER BY pi.id SEPARATOR '||')
                   FROM product_images pi
                  WHERE pi.product_id = p.id) AS images_concat
            FROM products p
            INNER JOIN categories c ON c.id = p.category_id
            WHERE p.active = 1
        ";

        $params = [];
        if ($categoryId) { $sql .= " AND p.category_id = :cid"; $params[':cid'] = $categoryId; }
        if ($search)     { $sql .= " AND p.name LIKE :q";       $params[':q']  = "%$search%"; }
        if ($minPrice !== null) { $sql .= " AND p.price >= :pmin"; $params[':pmin'] = $minPrice; }
        if ($maxPrice !== null) { $sql .= " AND p.price <= :pmax"; $params[':pmax'] = $maxPrice; }

        $sql .= " ORDER BY p.id DESC LIMIT :lim OFFSET :off";

        $stmt = $this->conn->prepare($sql);
        foreach ($params as $k=>$v) $stmt->bindValue($k, $v);
        $stmt->bindValue(':lim', $limit,  PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        foreach ($rows as &$r) {
            $r['images'] = $this->splitImages($r['images_concat'] ?? null);
            unset($r['images_concat']);
            // Tip: en front calcula % desc si old_price > price
        }
        return $rows;
    }

    /* ================================
       5) Detalle de producto (para Ver Detalles)
          - incluye: descripción, sku, stock, min_stock, imágenes, specs
    =================================== */
    public function obtenerProducto(int $productId): ?array {
        $sql = "
            SELECT 
                p.id, p.name, p.sku, p.description,
                p.stock, p.min_stock,
                p.price, p.old_price,
                p.is_new, p.is_hot, p.is_offer,
                p.is_featured, p.is_best_seller,
                c.id AS category_id, c.name AS category_name,
                (SELECT GROUP_CONCAT(pi.image_url ORDER BY pi.id SEPARATOR '||')
                   FROM product_images pi
                  WHERE pi.product_id = p.id) AS images_concat
            FROM products p
            INNER JOIN categories c ON c.id = p.category_id
            WHERE p.id = :id AND p.active = 1
            LIMIT 1
        ";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':id' => $productId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) return null;

        $row['images'] = $this->splitImages($row['images_concat'] ?? null);
        unset($row['images_concat']);

        // Specs: variable + specification ("a;b;c")
        $sqlSpecs = "
            SELECT ps.variable, ps.specification
            FROM product_specs ps
            WHERE ps.product_id = :pid
            ORDER BY ps.sort_order ASC, ps.id ASC
        ";
        $stmt2 = $this->conn->prepare($sqlSpecs);
        $stmt2->execute([':pid' => $productId]);
        $specsRows = $stmt2->fetchAll(PDO::FETCH_ASSOC) ?: [];

        $specs = [];
        foreach ($specsRows as $s) {
            $specs[] = [
                'variable' => $s['variable'],
                'values'   => $this->parseSpecValues($s['specification'])
            ];
        }
        $row['specs'] = $specs;

        return $row;
    }

    /* ================================
       6) Recomendados por categoría
          (excluye el producto actual)
    =================================== */
    public function listarRecomendadosPorCategoria(int $categoryId, int $excludeProductId = 0, int $limit = 8): array {
        $sql = "
            SELECT 
                p.id, p.name, p.price, p.old_price,
                p.is_new, p.is_hot, p.is_offer,
                c.id AS category_id, c.name AS category_name,
                (SELECT GROUP_CONCAT(pi.image_url ORDER BY pi.id SEPARATOR '||')
                   FROM product_images pi
                  WHERE pi.product_id = p.id) AS images_concat
            FROM products p
            INNER JOIN categories c ON c.id = p.category_id
            WHERE p.active = 1
              AND p.category_id = :cid
              AND p.id <> :pid
            ORDER BY p.is_best_seller DESC, p.is_featured DESC, p.id DESC
            LIMIT :lim
        ";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':cid', $categoryId, PDO::PARAM_INT);
        $stmt->bindValue(':pid', $excludeProductId, PDO::PARAM_INT);
        $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        foreach ($rows as &$r) {
            $r['images'] = $this->splitImages($r['images_concat'] ?? null);
            unset($r['images_concat']);
        }
        return $rows;
    }

    /* ================================
       7) Listado de categorías con conteo (para filtros)
    =================================== */
    public function listarCategorias(bool $soloConProductosActivos = true): array {
        $sql = "
            SELECT 
                c.id, c.name,
                COUNT(p.id) AS total
            FROM categories c
            LEFT JOIN products p 
                   ON p.category_id = c.id " . ($soloConProductosActivos ? "AND p.active = 1" : "") . "
            GROUP BY c.id, c.name
            " . ($soloConProductosActivos ? "HAVING total > 0" : "") . "
            ORDER BY c.name ASC
        ";
        $stmt = $this->conn->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }
}
