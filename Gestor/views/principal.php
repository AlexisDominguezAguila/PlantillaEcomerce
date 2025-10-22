<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Gestión de Cards | Tec Rivera</title>
  <link rel="stylesheet" href="../assets/css/sidebar.css" />
  <link rel="stylesheet" href="../assets/css/productos.css" />
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
      <a href="#" class="menu-item active"><i class="bx bx-box"></i><span>Principal</span></a>
      <a href="productos.php" class="menu-item"><i class="bx bx-box"></i><span>Productos</span></a>
      <a href="Servicios.php" class="menu-item"><i class="bx bx-cog"></i><span>Servicios</span></a>
    </nav>

    <button id="toggleSidebar" class="toggle-btn"><i class="bx bx-chevron-left"></i></button>
  </aside>

  <main class="main-content">
    <!-- Header -->
    <div class="page-header">
      <div>
            <div style="display: flex; align-items: center; gap: 0.75rem">
              <h1>Gestión de Cartas</h1>
            </div>
            <p>Administra las cartas de la vista principal</p>
          </div>
      <button class="btn btn-primary" onclick="openModal()">
        <i class="bx bx-plus"></i> Nueva Card
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon primary"><i class="bx bx-layer"></i></div>
        <div class="stat-content">
          <h3 id="totalServices">0</h3><p>Total</p>
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
          <h3 id="hiddenServices">0</h3><p>Ocultas</p>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="filters-section">
      <div class="filter-group full-width">
        <label><i class="bx bx-search"></i> Buscar</label>
        <input type="text" id="searchInput" class="filter-input" placeholder="Buscar por título o descripción..." onkeyup="buscarServicio()">
      </div>
    </div>

    <!-- Listing -->
    <div class="services-container">
      <div class="products-header">
        <h2><span id="servicesCount">0</span> Cards encontradas</h2>
      </div>

      <div class="products-grid" id="servicesGrid"></div>

      <div class="empty-state" id="emptyState" style="display:none;">
        <i class="bx bx-layer"></i>
        <h3>No hay cards registradas</h3>
        <p>Agrega tu primera card para comenzar</p>
        <button class="btn btn-primary" onclick="openModal()">
          <i class="bx bx-plus"></i> Crear Card
        </button>
      </div>
    </div>
  </main>

  <!-- Modal -->
  <div class="modal" id="serviceModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2><i class="bx bx-layer"></i> <span id="modalTitle">Nueva Card</span></h2>
        <button class="modal-close" onclick="closeModal()"><i class="bx bx-x"></i></button>
      </div>

      <form id="serviceForm" enctype="multipart/form-data">
  <input type="hidden" id="serviceId" name="id">

  <div class="modal-body">
    <div class="form-grid">

      <!-- Imagen única -->
      <div class="form-group full-width">
        <label><i class="bx bx-image"></i> Imagen del Producto</label>

        <div class="image-upload-area" onclick="document.getElementById('imageInput').click()">
          <i class="bx bx-cloud-upload"></i>
          <p><strong>Click para subir</strong> la imagen aquí</p>
          <p style="font-size: 0.75rem">PNG, JPG, WEBP, GIF (máx. 5MB)</p>
        </div>

        <!-- Importante: una sola imagen -->
        <input
          type="file"
          id="imageInput"
          name="image"
          accept="image/png,image/jpeg,image/webp,image/gif"
          style="display:none"
          onchange="handleImageUpload(event)"
        />

        <!-- Si estás editando y no seleccionas nueva imagen, mantenemos la actual -->
        <input type="hidden" id="keepCurrentImage" name="keep_current_image" value="1">

        <div class="image-preview-grid" id="imagePreviewGrid"></div>
      </div>

      <div class="form-group">
        <label><i class="bx bx-text"></i> Alt *</label>
        <input type="text" id="imageAlt" name="image_alt" class="form-input" required>
      </div>

      <div class="form-group">
        <label><i class="bx bx-purchase-tag-alt"></i> Badge</label>
        <input type="text" id="badgeText" name="badge_text" class="form-input" placeholder="Oferta / Nuevo">
      </div>

      <div class="form-group full-width">
        <label><i class="bx bx-text"></i> Título *</label>
        <input type="text" id="serviceTitle" name="title" class="form-input" required>
      </div>

      <div class="form-group full-width">
        <label><i class="bx bx-detail"></i> Descripción *</label>
        <textarea id="serviceDescription" name="description" class="form-input" required></textarea>
      </div>

      <div class="form-group">
        <label><i class="bx bx-label"></i> Texto footer</label>
        <input type="text" id="footerText" name="footer_text" class="form-input" placeholder="Mejor visibilidad">
      </div>

      <div class="form-group">
        <label><i class="bx bx-rename"></i> Texto botón</label>
        <input type="text" id="buttonLabel" name="button_label" class="form-input" value="Ver Detalles">
      </div>

      <div class="form-group full-width">
        <label><i class="bx bx-link"></i> URL botón</label>
        <input type="text" id="buttonUrl" name="button_url" class="form-input" placeholder="public/views/productos.html">
      </div>

      <div class="form-group">
        <label><i class="bx bx-sort"></i> Orden</label>
        <input type="number" id="displayOrder" name="display_order" class="form-input" value="0">
      </div>

      <div class="form-group full-width">
        <label><i class="bx bx-toggle-left"></i> Estado</label>
        <div class="checkbox-group">
          <div class="checkbox-item">
            <input type="checkbox" id="serviceActive" name="is_active" checked>
            <label for="serviceActive">Visible</label>
          </div>
        </div>
      </div>

    </div>
  </div>

  <div class="modal-footer">
    <button type="button" class="btn btn-secondary" onclick="closeModal()">
      <i class="bx bx-x"></i> Cancelar
    </button>
    <button type="submit" class="btn btn-primary">
      <i class="bx bx-save"></i> Guardar
    </button>
  </div>
</form>

    </div>
  </div>

  <script src="../assets/js/sidebar.js"></script>
  <script src="../assets/js/principal.js"></script>
</body>
</html>
