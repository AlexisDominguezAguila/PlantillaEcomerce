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

    <nav class="menu">
      <a href="../index.php" class="menu-item">
        <i class="bx bx-home"></i><span>Inicio</span>
      </a>
      <a href="productos.php" class="menu-item">
        <i class="bx bx-box"></i><span>Productos</span>
      </a>
      <a href="#" class="menu-item active">
        <i class="bx bx-cog"></i><span>Servicios</span>
      </a>
      <a href="#" class="menu-item">
        <i class="bx bx-layer"></i><span>Soluciones</span>
      </a>
      <a href="#" class="menu-item">
        <i class="bx bx-message-dots"></i><span>Mensajes</span>
      </a>
    </nav>

    <button id="toggleSidebar" class="toggle-btn">
      <i class="bx bx-chevron-left"></i>
    </button>
  </aside>

  <main class="main-content">
    <!-- Header -->
    <div class="page-header">
      <div class="page-title">
        <div>
          <div style="display: flex; align-items: center; gap: 0.75rem">
            <h1>Gestión de Servicios</h1>
          </div>
          <p>Administra tus servicios ofrecidos y controla su visibilidad</p>
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

    <!-- Filters -->
    <div class="filters-section">
      <div class="filters-grid">
        <div class="filter-group">
          <label>Buscar Servicio</label>
          <div class="search-wrapper">
            <i class="bx bx-search"></i>
            <input type="text" class="filter-input" id="searchInput" placeholder="Buscar por nombre...">
          </div>
        </div>
        <div class="filter-group">
          <label>Categoría</label>
          <select class="filter-input" id="categoryFilter">
            <option value="">Todas las categorías</option>
            <option value="sistemas">Sistemas</option>
            <option value="soporte">Soporte</option>
            <option value="ventas">Ventas</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Estado</label>
          <select class="filter-input" id="statusFilter">
            <option value="">Todos</option>
            <option value="activo">Visibles</option>
            <option value="oculto">Ocultos</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Services Container -->
    <div class="services-container">
      <div class="products-header">
        <h2 style="font-size: 1.25rem; color: var(--text)">
          <span id="servicesCount">0</span> Servicios encontrados
        </h2>
        <div class="view-toggle">
          <button class="view-btn active" onclick="changeView('grid')">
            <i class="bx bx-grid-alt"></i>
          </button>
          <button class="view-btn" onclick="changeView('table')">
            <i class="bx bx-list-ul"></i>
          </button>
        </div>
      </div>

      <!-- Grid View -->
      <div class="products-grid" id="servicesGrid"></div>

      <!-- Table View -->
      <div class="table-responsive">
        <table class="products-table" id="servicesTable">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Servicio</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="servicesTableBody"></tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div class="empty-state" id="emptyState" style="display:none;">
        <i class="bx bx-layer"></i>
        <h3>No hay servicios</h3>
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
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group full-width">
              <label><i class="bx bx-text"></i> Nombre del Servicio *</label>
              <input type="text" class="form-input" id="serviceName" name="name" required placeholder="Ej: Soporte Técnico Integral">
            </div>

            <div class="form-group">
              <label><i class="bx bx-category"></i> Categoría *</label>
              <select class="form-input" id="serviceCategory" name="category" required>
                <option value="sistemas">Sistemas</option>
                <option value="soporte">Soporte</option>
                <option value="ventas">Ventas</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label><i class="bx bx-detail"></i> Descripción *</label>
              <textarea class="form-input" id="serviceDescription" name="description" required placeholder="Describe el servicio..."></textarea>
            </div>

            <div class="form-group full-width">
              <label><i class="bx bx-toggle-left"></i> Estado</label>
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <input type="checkbox" id="serviceActive" name="active" checked>
                  <label for="serviceActive">Visible</label>
                </div>
              </div>
            </div>

            <div class="form-group full-width">
              <label><i class="bx bx-image"></i> Imagen</label>
              <div class="image-upload-area" onclick="document.getElementById('serviceImage').click()">
                <i class="bx bx-cloud-upload"></i>
                <p><strong>Click para subir</strong> una imagen del servicio</p>
                <p style="font-size:0.75rem;">PNG, JPG, WEBP (máx. 5MB)</p>
              </div>
              <input type="file" id="serviceImage" name="image" accept="image/*" style="display:none;" onchange="previewImage(event)">
              <div class="image-preview-grid" id="imagePreview"></div>
            </div>
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
