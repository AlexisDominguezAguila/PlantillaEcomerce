<?php
require_once __DIR__ . '/../../config/db.php'; // conexión PDO

/**
 * Modelo nativo para la tabla product_cards
 * Tabla esperada:
 * id, image_src (NOT NULL), image_data (filename), image_mime, image_alt, badge_text,
 * title, description, footer_text, button_label, button_url, is_active, display_order,
 * created_at, updated_at
 */
class ProductCard {
    private PDO $conn;

    public function __construct(PDO $db) {
        $this->conn = $db;
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    /** Listado (opcionalmente solo activos) */
    public function listar(bool $soloActivos = false): array {
        $sql = "SELECT id, image_src, image_data, image_mime, image_alt, badge_text, title, description,
                       footer_text, button_label, button_url, is_active, display_order,
                       created_at, updated_at
                  FROM product_cards";
        if ($soloActivos) $sql .= " WHERE is_active = 1";
        $sql .= " ORDER BY display_order ASC, id ASC";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /** Obtener por ID */
    public function obtener(int $id): ?array {
        $stmt = $this->conn->prepare(
            "SELECT id, image_src, image_data, image_mime, image_alt, badge_text, title, description,
                    footer_text, button_label, button_url, is_active, display_order,
                    created_at, updated_at
               FROM product_cards WHERE id = :id"
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    /** Crear (incluye campos de imagen) */
    public function crear(array $data): int {
        $sql = "INSERT INTO product_cards
                (image_src, image_data, image_mime, image_alt, badge_text, title, description,
                 footer_text, button_label, button_url, is_active, display_order, created_at, updated_at)
                VALUES
                (:image_src, :image_data, :image_mime, :image_alt, :badge_text, :title, :description,
                 :footer_text, :button_label, :button_url, :is_active, :display_order, NOW(), NOW())";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            ':image_src'     => ($data['image_src'] ?? '') !== null ? (string)$data['image_src'] : '',
            ':image_data'    => $data['image_data'] ?? null,
            ':image_mime'    => $data['image_mime'] ?? null,
            ':image_alt'     => trim($data['image_alt'] ?? 'Imagen'),
            ':badge_text'    => ($data['badge_text'] ?? null) ?: null,
            ':title'         => trim($data['title'] ?? ''),
            ':description'   => trim($data['description'] ?? ''),
            ':footer_text'   => ($data['footer_text'] ?? null) ?: null,
            ':button_label'  => trim($data['button_label'] ?? 'Ver Detalles'),
            ':button_url'    => ($data['button_url'] ?? null) ?: null,
            ':is_active'     => (int)($data['is_active'] ?? 1),
            ':display_order' => (int)($data['display_order'] ?? 0),
        ]);
        return (int)$this->conn->lastInsertId();
    }

    /** Actualizar (incluye campos de imagen y metadatos) */
    public function actualizar(int $id, array $data): bool {
        $sql = "UPDATE product_cards SET
                    image_src     = :image_src,
                    image_data    = :image_data,
                    image_mime    = :image_mime,
                    image_alt     = :image_alt,
                    badge_text    = :badge_text,
                    title         = :title,
                    description   = :description,
                    footer_text   = :footer_text,
                    button_label  = :button_label,
                    button_url    = :button_url,
                    is_active     = :is_active,
                    display_order = :display_order,
                    updated_at    = NOW()
                WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            ':image_src'     => ($data['image_src'] ?? '') !== null ? (string)$data['image_src'] : '',
            ':image_data'    => $data['image_data'] ?? null,
            ':image_mime'    => $data['image_mime'] ?? null,
            ':image_alt'     => trim($data['image_alt'] ?? 'Imagen'),
            ':badge_text'    => ($data['badge_text'] ?? null) ?: null,
            ':title'         => trim($data['title'] ?? ''),
            ':description'   => trim($data['description'] ?? ''),
            ':footer_text'   => ($data['footer_text'] ?? null) ?: null,
            ':button_label'  => trim($data['button_label'] ?? 'Ver Detalles'),
            ':button_url'    => ($data['button_url'] ?? null) ?: null,
            ':is_active'     => (int)($data['is_active'] ?? 1),
            ':display_order' => (int)($data['display_order'] ?? 0),
            ':id'            => $id
        ]);
    }

    /** Eliminar registro */
    public function eliminar(int $id): bool {
        $stmt = $this->conn->prepare("DELETE FROM product_cards WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    /** Cambiar visibilidad */
    public function setActivo(int $id, int $is_active): bool {
        $stmt = $this->conn->prepare("UPDATE product_cards SET is_active = :a WHERE id = :id");
        return $stmt->execute([':a' => $is_active ? 1 : 0, ':id' => $id]);
    }
}

/**
 * Adaptador de compatibilidad (opcional)
 */
class ServicioCompat {
    private ProductCard $pc;

    public function __construct(PDO $db) {
        $this->pc = new ProductCard($db);
    }

    public function obtenerServicios(): array {
        return $this->pc->listar(false);
    }

    public function crearServicio(array $data): bool {
        $mapped = [
            'image_src'     => '',
            'image_data'    => null,
            'image_mime'    => null,
            'image_alt'     => $data['titulo']        ?? 'Imagen',
            'badge_text'    => $data['etiqueta']      ?? null,
            'title'         => $data['titulo']        ?? '',
            'description'   => $data['descripcion']   ?? '',
            'footer_text'   => $data['caracteristicas'] ?? null,
            'button_label'  => 'Ver Detalles',
            'button_url'    => $data['enlace']        ?? null,
            'is_active'     => isset($data['active']) ? (int)$data['active'] : 1,
            'display_order' => 0,
        ];
        $id = $this->pc->crear($mapped);
        return $id > 0;
    }

    public function actualizarServicio(array $data): bool {
        $id = (int)($data['id'] ?? 0);
        if ($id <= 0) return false;

        $mapped = [
            'image_src'     => '',
            'image_data'    => null,
            'image_mime'    => null,
            'image_alt'     => $data['titulo']        ?? 'Imagen',
            'badge_text'    => $data['etiqueta']      ?? null,
            'title'         => $data['titulo']        ?? '',
            'description'   => $data['descripcion']   ?? '',
            'footer_text'   => $data['caracteristicas'] ?? null,
            'button_label'  => 'Ver Detalles',
            'button_url'    => $data['enlace']        ?? null,
            'is_active'     => isset($data['active']) ? (int)$data['active'] : 1,
            'display_order' => (int)($data['display_order'] ?? 0),
        ];
        return $this->pc->actualizar($id, $mapped);
    }

    public function eliminarServicio(int $id): bool {
        return $this->pc->eliminar($id);
    }
}
