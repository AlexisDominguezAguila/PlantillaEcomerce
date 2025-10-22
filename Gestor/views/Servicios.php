<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Gestión de Servicios | Tec Rivera</title>
  <link rel="stylesheet" href="../assets/css/sidebar.css" />
  <link rel="stylesheet" href="../assets/css/servicios.css" />
  <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
</head>
<body>
  
  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="logo-section">
      <img src="../../public/assets/images/iconoTEC.png" alt="Tec Rivera" class="logo" />
      <h2 class="brand">Tec Rivera</h2>
    </div>

      <!-- Botón Volver -->
    <a href="../index.php" class="back-button" id="btnBack" aria-label="Volver a la página anterior">
      <i class='bx bx-arrow-back'></i><span>Volver</span>
    </a>

    <nav class="menu">
      <a href="../index.php" class="menu-item"><i class="bx bx-home"></i><span>Inicio</span></a>
            <a href="principal.php" class="menu-item"><i class="bx bx-box"></i><span>Principal</span></a>
      <a href="productos.php" class="menu-item"><i class="bx bx-box"></i><span>Productos</span></a>
      <a href="#" class="menu-item active"><i class="bx bx-cog"></i><span>Servicios</span></a>
    </nav>

    <button id="toggleSidebar" class="toggle-btn"><i class="bx bx-chevron-left"></i></button>
  </aside>

  <main class="main-content">
    <!-- Header -->
    <div class="page-header">
      <div class="page-title">
        <div>
            <div style="display: flex; align-items: center; gap: 0.75rem">
              <h1>Gestión de Servicios</h1>
            </div>
            <p>Administra los servicios disponibles en tu sistema</p>
          </div>
      </div>
      <button class="btn btn-primary" onclick="openModal()">
        <i class="bx bx-plus"></i> Nuevo Servicio
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon primary"><i class="bx bx-layer"></i></div>
        <div class="stat-content">
          <h3 id="totalServices">0</h3><p>Total Servicios</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon success"><i class="bx bx-show"></i></div>
        <div class="stat-content">
          <h3 id="activeServices">0</h3><p>Visibles</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon warning"><i class="bx bx-hide"></i></div>
        <div class="stat-content">
          <h3 id="hiddenServices">0</h3><p>Ocultos</p>
        </div>
      </div>
    </div>


    <!-- Search -->
    <div class="filters-section">
      <div class="filter-group full-width">
        <label><i class="bx bx-search"></i> Buscar Servicio</label>
        <input type="text" id="searchInput" class="filter-input" placeholder="Buscar por nombre..." onkeyup="buscarServicio()">
      </div>
    </div>

    <!-- Services -->
    <div class="services-container">
      <div class="products-header">
        <h2><span id="servicesCount">0</span> Servicios encontrados</h2>
      </div>

      <div class="products-grid" id="servicesGrid"></div>

      <div class="empty-state" id="emptyState" style="display:none;">
        <i class="bx bx-layer"></i>
        <h3>No hay servicios registrados</h3>
        <p>Agrega tu primer servicio para comenzar</p>
        <button class="btn btn-primary" onclick="openModal()">
          <i class="bx bx-plus"></i> Crear Servicio
        </button>
      </div>
    </div>
  </main>

  <!-- Modal -->
  <div class="modal" id="serviceModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2><i class="bx bx-layer"></i> <span id="modalTitle">Nuevo Servicio</span></h2>
        <button class="modal-close" onclick="closeModal()"><i class="bx bx-x"></i></button>
      </div>

      <form id="serviceForm">
  <input type="hidden" id="serviceId" name="id">
  <div class="modal-body">
    <div class="form-grid">
      <div class="form-group full-width">
        <label><i class="bx bx-text"></i> Nombre del Servicio *</label>
        <input type="text" id="serviceTitle" name="titulo" class="form-input" required>
      </div>

      <div class="form-group full-width">
        <label><i class="bx bx-detail"></i> Descripción *</label>
        <textarea id="serviceDescription" name="descripcion" class="form-input" required></textarea>
      </div>

      <div class="form-group full-width">
        <label><i class="bx bx-list-check"></i> Características</label>
        <textarea id="serviceFeatures" name="caracteristicas" class="form-input"></textarea>
      </div>

      <div class="form-group">
        <label><i class="bx bx-purchase-tag"></i> Precio mínimo</label>
        <input type="number" step="0.01" id="serviceMin" name="precio_min" class="form-input">
      </div>

      <div class="form-group">
        <label><i class="bx bx-purchase-tag"></i> Precio máximo</label>
        <input type="number" step="0.01" id="serviceMax" name="precio_max" class="form-input">
      </div>

      <div class="form-group">
        <label><i class="bx bx-label"></i> Etiqueta</label>
        <input type="text" id="serviceLabel" name="etiqueta" class="form-input">
      </div>

      <div class="form-group">
        <label><i class="bx bx-link"></i> Enlace</label>
        <input type="text" id="serviceLink" name="enlace" class="form-input">
      </div>

      <div class="form-group">
        <label><i class="bx bx-icon"></i> Icono (FontAwesome)</label>
        <input type="text" id="serviceIcon" name="icono" class="form-input" placeholder="fas fa-code">
      </div>

      <!-- 🔽 Campo agregado: Visible -->
      <div class="form-group full-width">
        <label><i class="bx bx-toggle-left"></i> Estado</label>
        <div class="checkbox-group">
          <div class="checkbox-item">
            <input type="checkbox" id="serviceActive" name="active" checked>
            <label for="serviceActive">Visible</label>
          </div>
        </div>
      </div>
      <!-- 🔼 -->
    </div>
  </div>

  <div class="modal-footer">
    <button type="button" class="btn btn-secondary" onclick="closeModal()">
      <i class="bx bx-x"></i> Cancelar
    </button>
    <button type="submit" class="btn btn-primary">
      <i class="bx bx-save"></i> Guardar Servicio
    </button>
  </div>
</form>
    </div>
  </div>

  <script src="../assets/js/sidebar.js"></script>
  <script src="../assets/js/servicios.js"></script>
</body>
</html>
