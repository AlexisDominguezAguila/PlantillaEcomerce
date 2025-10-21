<?php
require_once __DIR__ . '/../../config/db.php'; // conexión PDO

/**
 * Modelo nativo para la tabla product_cards
 * Campos: id, image_mime, image_data, image_alt, badge_text, title, description,
 *         footer_text, button_label, button_url, is_active, display_order,
 *         created_at, updated_at, (image_src opcional como compat)
 */
class ProductCard {
    private PDO $conn;

    public function __construct(PDO $db) {
        $this->conn = $db;
    }

    /** Listado (opcionalmente solo activos) */
    public function listar(bool $soloActivos = false): array {
        $sql = "SELECT id, image_mime, image_data, image_alt, badge_text, title, description,
                       footer_text, button_label, button_url, is_active, display_order,
                       created_at, updated_at, image_src
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
            "SELECT id, image_mime, image_data, image_alt, badge_text, title, description,
                    footer_text, button_label, button_url, is_active, display_order,
                    created_at, updated_at, image_src
             FROM product_cards WHERE id = :id"
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    /** Crear (sin imagen; la imagen se sube con actualizarImagen) */
    public function crear(array $data): int {
        $sql = "INSERT INTO product_cards
                (image_alt, badge_text, title, description, footer_text,
                 button_label, button_url, is_active, display_order)
                VALUES
                (:image_alt, :badge_text, :title, :description, :footer_text,
                 :button_label, :button_url, :is_active, :display_order)";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
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

    /** Actualizar (metadatos; NO toca imagen) */
    public function actualizar(int $id, array $data): bool {
        $sql = "UPDATE product_cards SET
                    image_alt = :image_alt,
                    badge_text = :badge_text,
                    title = :title,
                    description = :description,
                    footer_text = :footer_text,
                    button_label = :button_label,
                    button_url = :button_url,
                    is_active = :is_active,
                    display_order = :display_order
                WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
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

    /** Actualizar SOLO la imagen (binario + mime) */
    public function actualizarImagen(int $id, ?string $mime, ?string $blob): bool {
        $stmt = $this->conn->prepare(
            "UPDATE product_cards SET image_mime = :mime, image_data = :data WHERE id = :id"
        );
        return $stmt->execute([
            ':mime' => $mime,
            ':data' => $blob,
            ':id'   => $id
        ]);
    }

    /** Eliminar imagen (dejar NULL) */
    public function limpiarImagen(int $id): bool {
        $stmt = $this->conn->prepare(
            "UPDATE product_cards SET image_mime = NULL, image_data = NULL WHERE id = :id"
        );
        return $stmt->execute([':id' => $id]);
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
 * Adaptador de compatibilidad para código existente que usa la clase Servicio.
 * (Mantiene compat; ignora manejo de imagen, que ahora va en image_data/image_mime)
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
