<?php
// ===============================
// ADMIN: Planes y Precios
// ===============================
require_once __DIR__ . '/../../config/Auth.php';
require_once __DIR__ . '/../../config/db.php';

$db = new Database();
$pdo = $db->connect();

// (Opcional) Datos del usuario logueado
$user = null;
if (isset($_SESSION['usuario_id'])) {
  $stmt = $pdo->prepare("SELECT nombre, email, rol FROM usuarios WHERE id = ?");
  $stmt->execute([$_SESSION['usuario_id']]);
  $user = $stmt->fetch();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Planes | Tec Rivera</title>
  <link rel="stylesheet" href="../assets/css/sidebar.css" />
  <link rel="stylesheet" href="../assets/css/productos.css" /> <!-- Reusa estilos de tablas / grids -->
  <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet"/>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet"/>
  <style>
    /* Ajustes mínimos para este módulo, reusando tu base */
    .plans-container { margin-top: 1rem; }
    .plans-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:.75rem }
    .plans-header h2 { font-size:1.25rem; color: var(--text); margin:0 }
    .nowrap { white-space: nowrap; }
    .badge { background: var(--muted-bg, #eee); padding: .15rem .5rem; border-radius: 999px; font-size: .75rem; }
    .badge-green { background: #d2f4df; }
    .table-actions { display:flex; gap:.5rem; }
    .btn.sm { padding:.35rem .5rem; }
  </style>
</head>
<body>
  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="logo-section">
      <img src="../../public/assets/images/iconoTEC.png" alt="Tec Rivera" class="logo"/>
      <h2 class="brand">Tec Rivera</h2>
    </div>

    <!-- Botón Volver -->
    <a href="../index.php" class="back-button" id="btnBack" aria-label="Volver a la página anterior">
      <i class='bx bx-arrow-back'></i><span>Volver</span>
    </a>

    <nav class="menu">
      <a href="../index.php" class="menu-item"><i class="bx bx-home"></i><span>Inicio</span></a>
      <a href="principal.php" class="menu-item"><i class="bx bx-box"></i><span>Principal</span></a>
      <a href="productos.php" class="menu-item"><i class="bx bx-package"></i><span>Productos</span></a>
      <a href="#" class="menu-item active"><i class="bx bx-purchase-tag"></i><span>Planes</span></a>
      <a href="Servicios.php" class="menu-item"><i class="bx bx-cog"></i><span>Servicios</span></a>
    </nav>

    <button id="toggleSidebar" class="toggle-btn"><i class="bx bx-chevron-left"></i></button>
  </aside>

  <main class="main-content">
    <!-- Header -->
    <div class="page-header">
      <div class="page-title">
        <div style="display:flex; align-items:center; gap:.75rem">
          <h1>Gestión de Planes</h1>
        </div>
        <p>Administra los planes, características, orden y featured.</p>
      </div>
      <button class="btn btn-primary" id="btnNewPlan">
        <i class="bx bx-plus"></i> Nuevo Plan
      </button>
    </div>

    <!-- Stats Cards (opcionales) -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon primary"><i class="bx bx-purchase-tag"></i></div>
        <div class="stat-content">
          <h3 id="totalPlans">0</h3><p>Total Planes</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon success"><i class="bx bx-star"></i></div>
        <div class="stat-content">
          <h3 id="featuredPlans">0</h3><p>Destacados</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon warning"><i class="bx bx-sort"></i></div>
        <div class="stat-content">
          <h3 id="orderedPlans">Asc</h3><p>Orden</p>
        </div>
      </div>
    </div>

    <!-- Filtros (simple buscador por nombre) -->
    <div class="filters-section">
      <div class="filters-grid">
        <div class="filter-group full-width">
          <label>Buscar Plan</label>
          <div class="search-wrapper">
            <i class="bx bx-search"></i>
            <input type="text" class="filter-input" id="searchInput" placeholder="Buscar por nombre..."/>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de planes -->
    <div class="plans-container">
      <div class="products-header">
        <h2 style="font-size:1.25rem; color: var(--text)"><span id="plansCount">0</span> Planes</h2>
      </div>

      <div class="table-responsive">
        <table class="products-table">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Precio</th>
              <th>Periodo</th>
              <th>Destacado</th>
              <th>Badge</th>
              <th>Orden</th>
              <th class="nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody id="plansTbody">
            <!-- Filas via JS -->
          </tbody>
        </table>
      </div>

      <div class="empty-state" id="emptyState" style="display:none">
        <i class="bx bx-purchase-tag"></i>
        <h3>No hay planes</h3>
        <p>Agrega tu primer plan para comenzar</p>
        <button class="btn btn-primary" id="emptyAddBtn"><i class="bx bx-plus"></i> Crear Plan</button>
      </div>
    </div>
  </main>

  <!-- Modal -->
  <div class="modal" id="adminModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2><i class="bx bx-purchase-tag"></i> <span id="modalTitle">Nuevo Plan</span></h2>
        <button class="modal-close" id="modalClose"><i class="bx bx-x"></i></button>
      </div>

      <form id="planForm">
        <input type="hidden" name="id" />
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label><i class="bx bx-text"></i> Nombre *</label>
              <input type="text" class="form-input" name="name" required placeholder="Básico / Estándar / Pro / Premium"/>
            </div>

            <div class="form-group">
              <label><i class="bx bx-hash"></i> Slug</label>
              <input type="text" class="form-input" name="slug" placeholder="auto desde el nombre si lo dejas vacío"/>
            </div>

            <div class="form-group">
              <label><i class="bx bx-money"></i> Precio (S/)</label>
              <input type="number" class="form-input" name="price_amount" step="0.01" min="0" required placeholder="80"/>
            </div>

            <div class="form-group">
              <label><i class="bx bx-note"></i> Nota de periodo</label>
              <input type="text" class="form-input" name="period_note" value="/mes · sin IGV"/>
            </div>

            <div class="form-group">
              <label><i class="bx bx-star"></i> Destacado</label>
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <input type="checkbox" id="isFeatured" name="is_featured"/>
                  <label for="isFeatured">Plan destacado</label>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label><i class="bx bx-purchase-tag"></i> Texto badge</label>
              <input type="text" class="form-input" name="badge_text" placeholder="Más elegido"/>
            </div>

            <div class="form-group">
              <label><i class="bx bx-bullseye"></i> CTA 1 (label)</label>
              <input type="text" class="form-input" name="cta1_label" value="Empezar"/>
            </div>

            <div class="form-group">
              <label><i class="bx bx-link"></i> CTA 1 (url)</label>
              <input type="text" class="form-input" name="cta1_url" value="contacto.html"/>
            </div>

            <div class="form-group">
              <label><i class="bx bx-bullseye"></i> CTA 2 (label)</label>
              <input type="text" class="form-input" name="cta2_label" value="Probar demo"/>
            </div>

            <div class="form-group">
              <label><i class="bx bx-link"></i> CTA 2 (url)</label>
              <input type="text" class="form-input" name="cta2_url" value="login.html"/>
            </div>

            <div class="form-group">
              <label><i class="bx bx-sort"></i> Orden</label>
              <input type="number" class="form-input" name="display_order" min="0" value="0"/>
            </div>

            <div class="form-group full-width">
              <label><i class="bx bx-list-check"></i> Características (1 por línea)</label>
              <textarea class="form-input" id="featuresText" name="features_text" placeholder="Toma de pedidos por mesero&#10;Carta digital básica&#10;1 local · 2 usuarios"></textarea>
            </div>

            <div class="form-group full-width">
              <label><i class="bx bx-detail"></i> Descripción</label>
              <textarea class="form-input" name="description" placeholder="Breve descripción del plan"></textarea>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="btnReset"><i class="bx bx-eraser"></i> Limpiar</button>
          <button type="submit" class="btn btn-primary"><i class="bx bx-save"></i> Guardar</button>
        </div>
      </form>
    </div>
  </div>

  <script src="../assets/js/sidebar.js"></script>
  <script>
    // Hook simple para contar / filtrar como en productos
    const counters = {
      update(plans) {
        document.getElementById('plansCount').textContent  = plans.length;
        document.getElementById('totalPlans').textContent  = plans.length;
        document.getElementById('featuredPlans').textContent = plans.filter(p => Number(p.is_featured)===1).length;
      }
    };
    // Delegamos todo al JS del módulo (render, CRUD, mover, modal…)
  </script>
  <script src="../assets/js/pricing-admin.js"></script>
  <script>
    // Integración mínima con tu buscador para filtrar en memoria (opcional)
    const _search = document.getElementById('searchInput');
    _search?.addEventListener('input', () => {
      // El JS del módulo no trae filtros por defecto; podrías extenderlo si lo necesitas.
      // Como alternativa, puedes implementar el filtrado en pricing-admin.js para
      // rehacer 'renderList()' con el término de búsqueda.
      // Aquí solo dejamos el wiring listo.
    });

    // Botón crear desde empty state
    document.getElementById('emptyAddBtn')?.addEventListener('click', () => {
      document.getElementById('btnNewPlan').click();
    });

    // Botón limpiar del modal
    document.getElementById('btnReset')?.addEventListener('click', ()=> {
      document.getElementById('planForm').reset();
      document.getElementById('featuresText').value = '';
    });

    // Parches visuales: mostrar/ocultar empty state según carga (se maneja en pricing-admin.js)
    // y actualizar contadores (también puedes hacerlo en loadPlans() del JS)
  </script>
</body>
</html>
