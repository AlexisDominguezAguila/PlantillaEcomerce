<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tec RIVERA - Catálogo de Productos</title>
    <link rel="stylesheet" href="../assets/css/global.css" />
    <link rel="stylesheet" href="../assets/css/header.css" />
    <link rel="stylesheet" href="../assets/css/prod.css" />
    <link rel="stylesheet" href="../assets/css/footer.css" />
    <!-- Boxicons -->
    <link
      rel="stylesheet"
      href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
    />
</head>
<body>
    <!-- Topbar -->
     <?php include_once '../partials/topbar.php'; ?>

    <!-- Header -->
    <?php include_once  '../partials/header.php'; ?>
    <!-- Main -->
    <main>
    <!-- ================= HERO ================= -->
    <section class="hero-slider">
        <video class="hero-video" autoplay muted loop playsinline>
        <source src="../assets/videos/11738195-hd_1920_1080_24fps.mp4" type="video/mp4" />
        </video>

        <!-- Capa que oscurece + blur -->
        <div class="hero-overlay" aria-hidden="true"></div>

        <div class="slider-container">
        <div class="hero-content-slide">
            <div class="slider-track" id="sliderTrack">
            <!-- Slides generados dinámicamente -->
            </div>

            <button class="slider-btn prev" id="prevBtn" aria-label="Anterior">
            <i class="bx bx-chevron-left"></i>
            </button>
            <button class="slider-btn next" id="nextBtn" aria-label="Siguiente">
            <i class="bx bx-chevron-right"></i>
            </button>

            <div class="slider-dots" id="sliderDots" aria-label="Selector de diapositiva"></div>
        </div>
        </div>
    </section>

    <!-- ================ CATÁLOGO ================ -->
    <section id="catalogo" class="catalogo">
        <header id="catalogoHeader" class="catalogo-header sticky">
        <!-- Barra de categorías: horizontal scroll + sticky -->
        <div class="category-bar">
            <button class="cat-scroll" id="catScrollLeft" aria-label="Desplazar categorías a la izquierda">
            <i class="bx bx-chevron-left"></i>
            </button>

            <nav id="categoryList" class="category-list scroller" aria-label="Categorías" tabindex="0">
            <!-- cat-pill generadas por JS -->
            </nav>

            <button class="cat-scroll" id="catScrollRight" aria-label="Desplazar categorías a la derecha">
            <i class="bx bx-chevron-right"></i>
            </button>
        </div>

        <!-- Filtros (en móvil se ocultan tras hamburguesa) -->
        <div class="catalogo-filters">
            <button id="filterToggle" class="filter-toggle" aria-controls="filtersExtra" aria-expanded="false">
            <i class="bx bx-slider-alt"></i> Filtros
            </button>

            <div id="filtersExtra" class="filters-extra">
            <!-- Select de respaldo de categoría -->
            <label for="categorySelect" class="sr-only">Categoría</label>
            <select id="categorySelect" class="category-select" aria-label="Seleccionar categoría"></select>

            <!-- Orden y vista (se pliegan en móvil) -->
            <select id="sortSelect" class="sort-select" aria-label="Ordenar">
                <option value="relevance">Relevancia</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
                <option value="new">Novedades</option>
            </select>

            <div class="view-switch" role="group" aria-label="Cambiar vista">
                <button id="viewGrid" class="btn-icon is-active" aria-label="Vista grid"><i class="bx bx-grid-alt"></i></button>
                <button id="viewList" class="btn-icon" aria-label="Vista lista"><i class="bx bx-list-ul"></i></button>
            </div>
            </div>
        </div>
        </header>


        <!-- Grid donde se renderizan las cards -->
        <div id="productGrid" class="product-grid">
        <!-- Cards generadas dinámicamente por JS -->
        </div>
    </section>
    </main>

    <!-- =================== MODALES ==================== -->
    
        <!-- Modal Carrito -->
        <div class="modal" id="cartModal" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
            <div class="modal-content">
                <button class="modal-close" id="cartModalClose" aria-label="Cerrar">&times;</button>
                <div class="modal-body">
                <h2 id="cartTitle">Carrito de Compras</h2>
                <div id="cartItems"></div>
                <div class="cart-total">
                    <h3>Total: <span id="cartTotal">S/. 0.00</span></h3>
                    <button id="checkoutBtnCart" class="btn btn-primary">Proceder al Pago</button>
                </div>
                </div>
            </div>
        </div>
        
        <!-- Modal de lista de deseos -->
        <div class="modal" id="wishlistModal" role="dialog" aria-modal="true" aria-labelledby="wishTitle">
            <div class="modal-content">
                <button class="modal-close" id="wishlistModalClose" aria-label="Cerrar">&times;</button>
                <div class="modal-body">
                <h2 id="wishTitle">Lista de Deseos</h2>
                <div id="wishlistItems"></div>
                </div>
            </div>
        </div>


    <!-- ============== BOTONES FLOTANTES ============= -->
     <!-- Botones flotantes: Carrito y Wishlist -->
        <div class="fab-group" id="fabGroup" aria-live="polite">
            <button class="fab-btn" id="fabCart"
                aria-label="Abrir carrito"
                aria-haspopup="dialog"
                aria-controls="cartModal">
                <i class="bx bx-cart"></i>
                <span id="cartCountFab" class="fab-badge">0</span>
            </button>

            <button class="fab-btn" id="fabWishlist"
                aria-label="Abrir lista de deseos"
                aria-haspopup="dialog"
                aria-controls="wishlistModal">
                <i class="bx bx-heart"></i>
                <span id="wishCountFab" class="fab-badge">0</span>
            </button>
        </div>

    <!-- Footer -->
    <?php include_once  '../partials/footer.php'; ?>
    <script src="../assets/js/home.js"></script>
    <script src="../assets/js/prod.js"></script>  
</body>
</html>