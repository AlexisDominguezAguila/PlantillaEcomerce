<?php
require_once __DIR__ . '/../../config/db.php'; // conexión PDO

/**
 * Modelo para la tabla pricing_plans_simple
 * Campos: id, slug, name, description, price_amount, period_note,
 *         is_featured, badge_text, cta1_label, cta1_url, cta2_label, cta2_url,
 *         display_order, caracteristicas (JSON/TEXT), created_at, updated_at
 */
class PricingPlan {
    private PDO $conn;
    private string $tbl = 'pricing_plans_simple';

    public function __construct(PDO $db) {
        $this->conn = $db;
    }

    /** Listado */
    public function listar(): array {
        $sql = "SELECT id, slug, name, description, price_amount, period_note,
                       is_featured, badge_text, cta1_label, cta1_url, cta2_label, cta2_url,
                       display_order, caracteristicas, created_at, updated_at
                FROM {$this->tbl}
                ORDER BY display_order ASC, id ASC";
        $st = $this->conn->prepare($sql);
        $st->execute();
        $rows = $st->fetchAll(PDO::FETCH_ASSOC) ?: [];
        // Normaliza caracteristicas a array (features)
        foreach ($rows as &$r) {
            $r['features'] = $this->toFeaturesArray($r['caracteristicas'] ?? null);
            unset($r['caracteristicas']);
        }
        return $rows;
    }

    /** Obtener por ID */
    public function obtener(int $id): ?array {
        $st = $this->conn->prepare("SELECT * FROM {$this->tbl} WHERE id = :id");
        $st->execute([':id' => $id]);
        $r = $st->fetch(PDO::FETCH_ASSOC);
        if (!$r) return null;
        $r['features'] = $this->toFeaturesArray($r['caracteristicas'] ?? null);
        return $r;
    }

    /** Crear */
    public function crear(array $d): int {
        if (!isset($d['display_order'])) $d['display_order'] = $this->maxOrder() + 1;

        $sql = "INSERT INTO {$this->tbl}
                (slug, name, description, price_amount, period_note, is_featured, badge_text,
                 cta1_label, cta1_url, cta2_label, cta2_url, display_order, caracteristicas)
                VALUES
                (:slug, :name, :description, :price_amount, :period_note, :is_featured, :badge_text,
                 :cta1_label, :cta1_url, :cta2_label, :cta2_url, :display_order, :caracteristicas)";
        $st = $this->conn->prepare($sql);
        $st->execute([
            ':slug'            => $d['slug'],
            ':name'            => $d['name'],
            ':description'     => $d['description'],
            ':price_amount'    => $d['price_amount'],
            ':period_note'     => $d['period_note'],
            ':is_featured'     => $d['is_featured'],
            ':badge_text'      => $d['badge_text'],
            ':cta1_label'      => $d['cta1_label'],
            ':cta1_url'        => $d['cta1_url'],
            ':cta2_label'      => $d['cta2_label'],
            ':cta2_url'        => $d['cta2_url'],
            ':display_order'   => $d['display_order'],
            ':caracteristicas' => $d['caracteristicas'], // JSON string o TEXT
        ]);
        return (int)$this->conn->lastInsertId();
    }

    /** Actualizar */
    public function actualizar(int $id, array $d): bool {
        $sql = "UPDATE {$this->tbl} SET
                    slug = :slug,
                    name = :name,
                    description = :description,
                    price_amount = :price_amount,
                    period_note = :period_note,
                    is_featured = :is_featured,
                    badge_text = :badge_text,
                    cta1_label = :cta1_label,
                    cta1_url   = :cta1_url,
                    cta2_label = :cta2_label,
                    cta2_url   = :cta2_url,
                    display_order = :display_order,
                    caracteristicas = :caracteristicas
                WHERE id = :id";
        $st = $this->conn->prepare($sql);
        return $st->execute([
            ':slug'            => $d['slug'],
            ':name'            => $d['name'],
            ':description'     => $d['description'],
            ':price_amount'    => $d['price_amount'],
            ':period_note'     => $d['period_note'],
            ':is_featured'     => $d['is_featured'],
            ':badge_text'      => $d['badge_text'],
            ':cta1_label'      => $d['cta1_label'],
            ':cta1_url'        => $d['cta1_url'],
            ':cta2_label'      => $d['cta2_label'],
            ':cta2_url'        => $d['cta2_url'],
            ':display_order'   => $d['display_order'],
            ':caracteristicas' => $d['caracteristicas'],
            ':id'              => $id
        ]);
    }

    /** Eliminar */
    public function eliminar(int $id): bool {
        $st = $this->conn->prepare("DELETE FROM {$this->tbl} WHERE id = :id");
        return $st->execute([':id' => $id]);
    }

    /** Slug existe (con exclusión) */
    public function existsSlug(string $slug, int $excludeId = 0): bool {
        $sql = "SELECT COUNT(1) FROM {$this->tbl} WHERE slug = :slug";
        $p = [':slug' => $slug];
        if ($excludeId > 0) { $sql .= " AND id <> :id"; $p[':id'] = $excludeId; }
        $st = $this->conn->prepare($sql);
        $st->execute($p);
        return (bool)$st->fetchColumn();
    }

    /** Mayor orden */
    public function maxOrder(): int {
        $st = $this->conn->prepare("SELECT COALESCE(MAX(display_order),0) FROM {$this->tbl}");
        $st->execute();
        return (int)$st->fetchColumn();
    }

    /** Mover arriba/abajo */
    public function move(int $id, string $dir): bool {
        $curr = $this->obtener($id);
        if (!$curr) return false;
        $order = (int)$curr['display_order'];

        if ($dir === 'up') {
            $st = $this->conn->prepare("SELECT id, display_order FROM {$this->tbl}
                                        WHERE display_order < :o
                                        ORDER BY display_order DESC LIMIT 1");
        } else {
            $st = $this->conn->prepare("SELECT id, display_order FROM {$this->tbl}
                                        WHERE display_order > :o
                                        ORDER BY display_order ASC LIMIT 1");
        }
        $st->execute([':o' => $order]);
        $nbr = $st->fetch(PDO::FETCH_ASSOC);
        if (!$nbr) return true; // no hay vecino

        $this->conn->beginTransaction();
        try {
            $u = $this->conn->prepare("UPDATE {$this->tbl} SET display_order = :o WHERE id = :id");
            $u->execute([':o' => $nbr['display_order'], ':id' => $id]);
            $u->execute([':o' => $order, ':id' => $nbr['id']]);
            $this->conn->commit();
            return true;
        } catch (Throwable $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    // -------- Helpers --------
    private function toFeaturesArray($raw): array {
        if (!$raw) return [];
        if (is_string($raw)) {
            $trim = trim($raw);
            if ($trim !== '' && ($trim[0] === '[' || $this->looksJsonArray($trim))) {
                $arr = json_decode($trim, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($arr)) {
                    return array_values(array_filter(array_map('trim', $arr)));
                }
            }
            // texto plano: 1 por línea
            return array_values(array_filter(array_map('trim', preg_split("/\r\n|\r|\n/", $raw))));
        }
        if (is_array($raw)) return array_values(array_filter(array_map('trim', $raw)));
        return [];
    }
    private function looksJsonArray(string $s): bool {
        json_decode($s);
        return json_last_error() === JSON_ERROR_NONE;
    }
}
