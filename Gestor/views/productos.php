<?php
// ========================================
// PANEL PRINCIPAL - TEC RIVERA
// ========================================
require_once __DIR__ . '/../../config/Auth.php';   
require_once __DIR__ . '/../../config/db.php';  

// Instancia de conexión 
$db = new Database();
$pdo = $db->connect();

// Recuperar usuario activo
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sidebar | Tec Rivera</title>
    <link rel="stylesheet" href="../assets/css/sidebar.css" />
    <link rel="stylesheet" href="../assets/css/productos.css" />
    <link
      href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
      rel="stylesheet"
    />
  </head>
  <body>
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo-section">
        <img
          src="../../public/assets/images/iconoTEC.png"
          alt="Tec Rivera"
          class="logo"
        />
        <h2 class="brand">Tec Rivera</h2>
      </div>

            <!-- Botón Volver -->
    <a href="../index.php" class="back-button" id="btnBack" aria-label="Volver a la página anterior">
      <i class='bx bx-arrow-back'></i><span>Volver</span>
    </a>

      <nav class="menu">
        <a href="../index.php" class="menu-item">
          <i class="bx bx-home"></i>
          <span>Inicio</span>
        </a>

        <a href="principal.php" class="menu-item">
          <i class="bx bx-box"></i>
          <span>Principal</span>
        </a>
        
      
        <a href="#" class="menu-item active">
          <i class="bx bx-package"></i>
          <span>Productos</span>
        </a>

        <a href="restaurante.php" class="menu-item">
          <i class="bx bx-purchase-tag"></i>
          <span>Planes</span>
        </a>

        <a href="Servicios.php" class="menu-item">
          <i class="bx bx-cog"></i>
          <span>Servicios</span>
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
              <h1>Gestión de Productos</h1>
            </div>
            <p>Administra tu catálogo de productos de forma eficiente</p>
          </div>
        </div>
        <button class="btn btn-primary" onclick="openModal()">
          <i class="bx bx-plus"></i>
          Nuevo Producto
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">
            <i class="bx bx-package"></i>
          </div>
          <div class="stat-content">
            <h3 id="totalProducts">0</h3>
            <p>Total Productos</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success">
            <i class="bx bx-check-circle"></i>
          </div>
          <div class="stat-content">
            <h3 id="activeProducts">0</h3>
            <p>Activos</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon warning">
            <i class="bx bx-error-circle"></i>
          </div>
          <div class="stat-content">
            <h3 id="lowStockProducts">0</h3>
            <p>Stock Bajo</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon danger">
            <i class="bx bx-trending-up"></i>
          </div>
          <div class="stat-content">
            <h3 id="offerProducts">0</h3>
            <p>En Oferta</p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="filters-grid">
          <div class="filter-group">
            <label>Buscar Producto</label>
            <div class="search-wrapper">
              <i class="bx bx-search"></i>
              <input
                type="text"
                class="filter-input"
                id="searchInput"
                placeholder="Buscar por nombre..."
              />
            </div>
          </div>
          <div class="filter-group">
            <label>Categoría</label>
            <select class="filter-input" id="categoryFilter">
              <option value="">Todas las categorías</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Estado</label>
            <select class="filter-input" id="statusFilter">
              <option value="">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Etiquetas</label>
            <select class="filter-input" id="tagFilter">
              <option value="">Todas</option>
              <option value="new">Nuevo</option>
              <option value="hot">Hot</option>
              <option value="offer">Oferta</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Products Container -->
      <div class="products-container">
        <div class="products-header">
          <h2 style="font-size: 1.25rem; color: var(--text)">
            <span id="productsCount">0</span> Productos encontrados
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
        <div class="products-grid" id="productsGrid">
          <!-- Products will be rendered here -->
        </div>

        <!-- Table View -->
        <div class="table-responsive">
          <table class="products-table" id="productsTable">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Etiquetas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="productsTableBody">
              <!-- Table rows will be rendered here -->
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div class="empty-state" id="emptyState" style="display: none">
          <i class="bx bx-package"></i>
          <h3>No hay productos</h3>
          <p>Comienza agregando tu primer producto al catálogo</p>
          <button class="btn btn-primary" onclick="openModal()">
            <i class="bx bx-plus"></i>
            Crear Producto
          </button>
        </div>

        <!-- Pagination -->
        <div class="pagination" id="pagination">
          <!-- Pagination will be rendered here -->
        </div>
      </div>
    </main>
    <!-- 
    Modal -->
<!-- Modal -->
<div class="modal" id="productModal">
  <div class="modal-content">
    <div class="modal-header">
      <h2>
        <i class="bx bx-package"></i>
        <span id="modalTitle">Nuevo Producto</span>
      </h2>
      <button class="modal-close" onclick="closeModal()">
        <i class="bx bx-x"></i>
      </button>
    </div>

    <form id="productForm">
      <div class="modal-body">
        <div class="form-grid">

          <!-- Nombre del producto -->
          <div class="form-group full-width">
            <label>
              <i class="bx bx-text"></i>
              Nombre del Producto *
            </label>
            <input
              type="text"
              class="form-input"
              id="productName"
              name="name"
              required
              placeholder="Ej: Laptop HP Pavilion"
            />
          </div>

          <!-- Categoría -->
          <div class="form-group">
            <label>
              <i class="bx bx-category"></i>
              Categoría *
            </label>
            <select
              class="form-input"
              id="productCategory"
              name="productCategory"
              required
            >
            </select>
          </div>

          <!-- SKU -->
          <div class="form-group">
            <label>
              <i class="bx bx-barcode"></i>
              SKU *
            </label>
            <input
              type="text"
              class="form-input"
              id="productSKU"
              name="sku"
              required
              placeholder="Ej: PROD-001"
            />
          </div>

          <!-- Precio -->
          <div class="form-group">
            <label>
              <i class="bx bx-money"></i>
              Precio *
            </label>
            <input
              type="number"
              class="form-input"
              id="productPrice"
              name="price"
              required
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <!-- Precio Anterior -->
          <div class="form-group">
            <label>
              <i class="bx bx-purchase-tag"></i>
              Precio Anterior
            </label>
            <input
              type="number"
              class="form-input"
              id="productOldPrice"
              name="old_price"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <!-- Stock -->
          <div class="form-group">
            <label>
              <i class="bx bx-package"></i>
              Stock *
            </label>
            <input
              type="number"
              class="form-input"
              id="productStock"
              name="stock"
              required
              placeholder="0"
            />
          </div>

          <!-- Stock Mínimo -->
          <div class="form-group">
            <label>
              <i class="bx bx-error-circle"></i>
              Stock Mínimo
            </label>
            <input
              type="number"
              class="form-input"
              id="productMinStock"
              name="min_stock"
              placeholder="5"
            />
          </div>

          <!-- Descripción -->
          <div class="form-group full-width">
            <label>
              <i class="bx bx-detail"></i>
              Descripción
            </label>
            <textarea
              class="form-input"
              id="productDescription"
              name="description"
              placeholder="Describe el producto..."
            ></textarea>
          </div>

          <!-- Estado -->
          <div class="form-group full-width">
            <label>
              <i class="bx bx-toggle-left"></i>
              Estado
            </label>
            <div class="checkbox-group">
              <div class="checkbox-item">
                <input
                  type="checkbox"
                  id="productActive"
                  name="active"
                  checked
                />
                <label for="productActive">Activo</label>
              </div>
            </div>
          </div>

          <!-- Etiquetas -->
          <div class="form-group full-width">
            <label>
              <i class="bx bx-purchase-tag"></i>
              Etiquetas
            </label>
            <div class="checkbox-group">
              <div class="checkbox-item">
                <input type="checkbox" id="productNew" name="is_new" />
                <label for="productNew">Nuevo</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="productHot" name="is_hot" />
                <label for="productHot">Hot</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="productOffer" name="is_offer" />
                <label for="productOffer">Oferta</label>
              </div>
            </div>
          </div>

          <!-- Imágenes -->
          <div class="form-group full-width">
            <label>
              <i class="bx bx-image"></i>
              Imágenes del Producto
            </label>
            <div
              class="image-upload-area"
              onclick="document.getElementById('imageInput').click()"
            >
              <i class="bx bx-cloud-upload"></i>
              <p><strong>Click para subir</strong> las imágenes aquí</p>
              <p style="font-size: 0.75rem">PNG, JPG, WEBP (máx. 5MB)</p>
            </div>
            <input
              type="file"
              id="imageInput"
              name="images[]"
              accept="image/*"
              multiple
              style="display: none"
              onchange="handleImageUpload(event)"
            />
            <div class="image-preview-grid" id="imagePreviewGrid">
              <!-- Image previews will be rendered here -->
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">
          <i class="bx bx-x"></i>
          Cancelar
        </button>
        <button type="submit" class="btn btn-primary">
          <i class="bx bx-save"></i>
          Guardar Producto
        </button>
      </div>
    </form>
  </div>
</div>

    <script src="../assets/js/sidebar.js"></script>
    <script src="../assets/js/productos.js"></script>
  </body>
</html>
