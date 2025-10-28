<?php
require_once __DIR__ . '/../../config/db.php';

class PricingSimpleModel {
    private PDO $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function listarActivos(): array {
        $sql = "SELECT id, slug, name, description, currency, price_amount, period_note,
                       is_featured, badge_text, features_json,
                       cta1_label, cta1_url, cta2_label, cta2_url,
                       display_order
                FROM pricing_plans_simple
                WHERE is_active = 1
                ORDER BY display_order ASC, id ASC";
        $stm = $this->conn->prepare($sql);
        $stm->execute();
        $rows = $stm->fetchAll(PDO::FETCH_ASSOC);

        // Decodificar JSON desde MySQL
        foreach ($rows as &$r) {
            $r['features'] = [];
            if (!empty($r['features_json'])) {
                $dec = json_decode($r['features_json'], true);
                if (is_array($dec)) $r['features'] = $dec;
            }
            unset($r['features_json']);
        }
        return $rows;
    }

    public function rangoPrecios(): array {
        $sql = "SELECT MIN(price_amount) AS min_price, MAX(price_amount) AS max_price
                FROM pricing_plans_simple
                WHERE is_active = 1";
        $stm = $this->conn->prepare($sql);
        $stm->execute();
        $r = $stm->fetch(PDO::FETCH_ASSOC) ?: ['min_price'=>0,'max_price'=>0];
        return $r;
    }
}
