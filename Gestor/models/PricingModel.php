<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/db.php';

class PricingModel {
  private PDO $pdo;
  private string $tbl = 'pricing_plans_simple';

  public function __construct(PDO $pdo) { $this->pdo = $pdo; }

  public function listar(): array {
    $sql = "SELECT id, slug, name, description, price_amount, period_note,
                   is_featured, badge_text, cta1_label, cta1_url, cta2_label, cta2_url,
                   display_order, caracteristicas
            FROM {$this->tbl}
            ORDER BY display_order ASC, id ASC";
    $st = $this->pdo->prepare($sql);
    $st->execute();
    $rows = $st->fetchAll(PDO::FETCH_ASSOC) ?: [];

    foreach ($rows as &$r) {
      $r['features'] = $this->normalizeFeatures($r['caracteristicas'] ?? null);
      unset($r['caracteristicas']);
    }
    return $rows;
  }

  public function obtener(int $id): ?array {
    $st = $this->pdo->prepare("SELECT * FROM {$this->tbl} WHERE id=:id");
    $st->execute([':id'=>$id]);
    $r = $st->fetch(PDO::FETCH_ASSOC);
    if (!$r) return null;
    $r['features'] = $this->normalizeFeatures($r['caracteristicas'] ?? null);
    return $r;
  }

  public function crear(array $d): int {
    if (!isset($d['display_order'])) $d['display_order'] = $this->maxOrder()+1;

    $sql = "INSERT INTO {$this->tbl}
            (slug, name, description, price_amount, period_note, is_featured, badge_text,
             cta1_label, cta1_url, cta2_label, cta2_url, display_order, caracteristicas)
            VALUES
            (:slug, :name, :description, :price_amount, :period_note, :is_featured, :badge_text,
             :cta1_label, :cta1_url, :cta2_label, :cta2_url, :display_order, :caracteristicas)";
    $st = $this->pdo->prepare($sql);
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
      ':caracteristicas' => $d['caracteristicas'],
    ]);
    return (int)$this->pdo->lastInsertId();
  }

  public function actualizar(int $id, array $d): bool {
    $sql = "UPDATE {$this->tbl} SET
              slug=:slug, name=:name, description=:description,
              price_amount=:price_amount, period_note=:period_note,
              is_featured=:is_featured, badge_text=:badge_text,
              cta1_label=:cta1_label, cta1_url=:cta1_url,
              cta2_label=:cta2_label, cta2_url=:cta2_url,
              display_order=:display_order, caracteristicas=:caracteristicas
            WHERE id=:id";
    $st = $this->pdo->prepare($sql);
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

  public function eliminar(int $id): bool {
    $st = $this->pdo->prepare("DELETE FROM {$this->tbl} WHERE id=:id");
    return $st->execute([':id'=>$id]);
  }

  public function existsSlug(string $slug, int $excludeId=0): bool {
    $sql = "SELECT COUNT(1) FROM {$this->tbl} WHERE slug=:s";
    $p = [':s'=>$slug];
    if ($excludeId>0) { $sql .= " AND id<>:id"; $p[':id']=$excludeId; }
    $st = $this->pdo->prepare($sql);
    $st->execute($p);
    return (bool)$st->fetchColumn();
  }

  public function maxOrder(): int {
    $st = $this->pdo->prepare("SELECT COALESCE(MAX(display_order),0) FROM {$this->tbl}");
    $st->execute();
    return (int)$st->fetchColumn();
  }

  public function move(int $id, string $dir): bool {
    $curr = $this->obtener($id);
    if (!$curr) return false;
    $order = (int)$curr['display_order'];

    if ($dir === 'up') {
      $st = $this->pdo->prepare("SELECT id, display_order FROM {$this->tbl}
        WHERE display_order < :o ORDER BY display_order DESC LIMIT 1");
    } else {
      $st = $this->pdo->prepare("SELECT id, display_order FROM {$this->tbl}
        WHERE display_order > :o ORDER BY display_order ASC LIMIT 1");
    }
    $st->execute([':o'=>$order]);
    $nbr = $st->fetch(PDO::FETCH_ASSOC);
    if (!$nbr) return true;

    $this->pdo->beginTransaction();
    try {
      $u = $this->pdo->prepare("UPDATE {$this->tbl} SET display_order=:o WHERE id=:id");
      $u->execute([':o'=>$nbr['display_order'], ':id'=>$id]);
      $u->execute([':o'=>$order, ':id'=>$nbr['id']]);
      $this->pdo->commit();
      return true;
    } catch (Throwable $e) {
      $this->pdo->rollBack();
      return false;
    }
  }

  private function looksJson(?string $s): bool {
    if ($s===null) return false;
    $s=trim($s); if ($s==='' || $s[0]!=='[') return false;
    json_decode($s); return json_last_error()===JSON_ERROR_NONE;
  }
  private function normalizeFeatures($raw): array {
    if (!$raw) return [];
    if ($this->looksJson($raw)) {
      $arr = json_decode($raw, true);
      return is_array($arr) ? array_values(array_filter(array_map('trim',$arr))) : [];
    }
    return array_values(array_filter(array_map('trim', preg_split("/\r\n|\r|\n/", (string)$raw))));
  }
}
