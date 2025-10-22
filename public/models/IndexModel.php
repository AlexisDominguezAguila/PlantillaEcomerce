<?php
require_once __DIR__ . '/../../config/db.php';

class IndexModel {
    private PDO $conn;

    public function __construct(PDO $db) {
        $this->conn = $db;
    }

    /**
     * Lista cards activas para el público
     * @param int|null $limit Límite de resultados (null = sin límite)
     */
    public function listarActivas(?int $limit = 6): array {
        $sql = "SELECT
                    id,
                    image_mime, image_data, image_src, image_alt,
                    badge_text, title, description, footer_text,
                    button_label, button_url,
                    display_order
                FROM product_cards
                WHERE is_active = 1
                ORDER BY display_order ASC, id ASC";
        if ($limit !== null && $limit > 0) {
            $sql .= " LIMIT :lim";
        }

        $stmt = $this->conn->prepare($sql);
        if ($limit !== null && $limit > 0) {
            $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
        }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
