<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page Builder - Constructor Visual</title>
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="css/crear.css">
</head>
<body>
    <main class="builder-container">
         <!-- Toolbar Superior  -->
        <header class="toolbar">
            <div class="toolbar-left">
                <h1 class="toolbar-title">
                    <img src="images/iconoTEC.png" style="width: 32px; height: 32px;" alt="">
                    Tec Rivera Builder               
                </h1>
            </div>
            <div class="toolbar-center">
                <button class="toolbar-btn" id="undoBtn" title="Deshacer">
                    <i class='bx bx-undo'></i>
                </button>
                <button class="toolbar-btn" id="redoBtn" title="Rehacer">
                    <i class='bx bx-redo'></i>
                </button>
                <div class="toolbar-divider"></div>
                <button class="toolbar-btn" id="desktopView" title="Vista Desktop">
                    <i class='bx bx-desktop'></i>
                </button>
                <button class="toolbar-btn" id="tabletView" title="Vista Tablet">
                    <i class='bx bx-tab'></i>
                </button>
                <button class="toolbar-btn" id="mobileView" title="Vista Mobile">
                    <i class='bx bx-mobile'></i>
                </button>
            </div>
            <div class="toolbar-right">
                <button class="toolbar-btn btn-secondary" id="previewBtn">
                    <i class='bx bx-show'></i>
                    Vista Previa
                </button>
                <button class="toolbar-btn btn-primary" id="publishBtn">
                    <i class='bx bx-cloud-upload'></i>
                    Publicar
                </button>
            </div>
        </header>
<!--  Contenedor Principal  -->
        <div class="main-content">
             <!-- Sidebar de Componentes  -->
            <aside class="components-sidebar">
                <div class="sidebar-header">
                    <h2>Componentes</h2>
                    <button class="collapse-btn" id="collapseSidebar">
                        <i class='bx bx-chevron-left'></i>
                    </button>
                </div>

                <div class="search-box">
                    <i class='bx bx-search'></i>
                    <input type="text" placeholder="Buscar componentes..." id="searchComponents">
                </div>

                <div class="components-list">
                     <!-- Categoría: Heroes  -->
                    <div class="component-category">
                        <div class="category-header">
                            <i class='bx bx-image-alt'></i>
                            <span>Heroes</span>
                            <i class='bx bx-chevron-down toggle-icon'></i>
                        </div>
                        <div class="category-items">
                            <div class="component-item" draggable="true" data-component="hero-1">
                                <div class="component-preview">
                                    <i class='bx bx-layout'></i>
                                </div>
                                <span class="component-name">Hero Centrado</span>
                            </div>
                            <div class="component-item" draggable="true" data-component="hero-2">
                                <div class="component-preview">
                                    <i class='bx bx-layout'></i>
                                </div>
                                <span class="component-name">Hero con Imagen</span>
                            </div>
                            <div class="component-item" draggable="true" data-component="hero-3">
                                <div class="component-preview">
                                    <i class='bx bx-layout'></i>
                                </div>
                                <span class="component-name">Hero Video</span>
                            </div>
                        </div>
                    </div>
<!-- Categoría: Nosotros  -->
                    <div class="component-category">
                        <div class="category-header">
                            <i class='bx bx-info-circle'></i>
                            <span>Nosotros</span>
                            <i class='bx bx-chevron-down toggle-icon'></i>
                        </div>
                        <div class="category-items">
                            <div class="component-item" draggable="true" data-component="about-1">
                                <div class="component-preview">
                                    <i class='bx bx-user-circle'></i>
                                </div>
                                <span class="component-name">Sobre Nosotros</span>
                            </div>
                            <div class="component-item" draggable="true" data-component="about-2">
                                <div class="component-preview">
                                    <i class='bx bx-group'></i>
                                </div>
                                <span class="component-name">Equipo</span>
                            </div>
                            <div class="component-item" draggable="true" data-component="about-3">
                                <div class="component-preview">
                                    <i class='bx bx-trophy'></i>
                                </div>
                                <span class="component-name">Logros</span>
                            </div>
                        </div>
                    </div>

                     <!-- Categoría: Productos  -->
                    <div class="component-category">
                        <div class="category-header">
                            <i class='bx bx-shopping-bag'></i>
                            <span>Productos</span>
                            <i class='bx bx-chevron-down toggle-icon'></i>
                        </div>
                        <div class="category-items">
                            <div class="component-item" draggable="true" data-component="products-grid">
                                <div class="component-preview">
                                    <i class='bx bx-grid-alt'></i>
                                </div>
                                <span class="component-name">Grid Productos</span>
                            </div>
                            <div class="component-item" draggable="true" data-component="products-carousel">
                                <div class="component-preview">
                                    <i class='bx bx-carousel'></i>
                                </div>
                                <span class="component-name">Carrusel</span>
                            </div>
                            <div class="component-item" draggable="true" data-component="products-featured">
                                <div class="component-preview">
                                    <i class='bx bx-star'></i>
                                </div>
                                <span class="component-name">Destacados</span>
                            </div>
                        </div>
                    </div>

                     <!-- Categoría: Servicios  -->
                    <div class="component-category">
                        <div class="category-header">
                            <i class='bx bx-briefcase'></i>
                            <span>Servicios</span>
                            <i class='bx bx-chevron-down toggle-icon'></i>
                        </div>
                        <div class="category-items">
                            <div class="component-item" draggable="true" data-component="services-cards">
                                <div class="component-preview">
                                    <i class='bx bx-card'></i>
                                </div>
                                <span class="component-name">Tarjetas</span>
                            </div>
                            <div class="component-item" draggable="true" data-component="services-list">
                                <div class="component-preview">
                                    <i class='bx bx-list-ul'></i>
                                </div>
                                <span class="component-name">Lista</span>
                            </div>
                            <div class="component-item" draggable="true" data-component="services-pricing">
                                <div class="component-preview">
                                    <i class='bx bx-dollar-circle'></i>
                                </div>
                                <span class="component-name">Precios</span>
                            </div>
                        </div>
                    </div>

                     <!-- Categoría: Formularios  -->
                    <div class="component-category">
                        <div class="category-header">
                            <i class='bx bx-envelope'></i>
                            <span>Formularios</span>
                            <i class='bx bx-chevron-down toggle-icon'></i>
                        </div>
                        <div class="category-items">
                            <div class="component-item" draggable="true" data-component="form-contact">
                                <div class="component-preview">
                                    <i class='bx bx-message-square-dots'></i>
                                </div>
                                <span class="component-name">Contacto</span>
                            </div>
                            <div class="component-item" draggable="true" data-component="form-newsletter">
                                <div class="component-preview">
                                    <i class='bx bx-mail-send'></i>
                                </div>
                                <span class="component-name">Newsletter</span>
                            </div>
                            <div class="component-item" draggable="true" data-component="form-quote">
                                <div class="component-preview">
                                    <i class='bx bx-file'></i>
                                </div>
                                <span class="component-name">Cotización</span>
                            </div>
                        </div>
                    </div>

                    <!-- Categoría: Mapas  -->
                    <div class="component-category">
                        <div class="category-header">
                            <i class='bx bx-map'></i>
                            <span>Mapas</span>
                            <i class='bx bx-chevron-down toggle-icon'></i>
                        </div>
                        <div class="category-items">
                            <div class="component-item" draggable="true" data-component="map-location">
                                <div class="component-preview">
                                    <i class='bx bx-map-pin'></i>
                                </div>
                                <span class="component-name">Ubicación</span>
                            </div>
                            <div class="component-item" draggable="true" data-component="map-interactive">
                                <div class="component-preview">
                                    <i class='bx bx-world'></i>
                                </div>
                                <span class="component-name">Interactivo</span>
                            </div>
                        </div>
                    </div>

                    <!-- Categoría: Otros -->
                    <div class="component-category">
                        <div class="category-header">
                            <i class='bx bx-extension'></i>
                            <span>Otros</span>
                            <i class='bx bx-chevron-down toggle-icon'></i>
                        </div>
                        <div class="category-items">
                            <div class="component-item" draggable="true" data-component="testimonials">
                                <div class="component-preview">
                                    <i class='bx bx-chat'></i>
                                </div>
                                <span class="component-name">Testimonios</span>
                            </div>
                            <div class="component-item" draggable="true" data-component="gallery">
                                <div class="component-preview">
                                    <i class='bx bx-images'></i>
                                </div>
                                <span class="component-name">Galería</span>
                            </div>
                            <div class="component-item" draggable="true" data-component="faq">
                                <div class="component-preview">
                                    <i class='bx bx-help-circle'></i>
                                </div>
                                <span class="component-name">FAQ</span>
                            </div>
                            <div class="component-item" draggable="true" data-component="cta">
                                <div class="component-preview">
                                    <i class='bx bx-bullseye'></i>
                                </div>
                                <span class="component-name">Call to Action</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Canvas Principal -->
            <section class="canvas-area">
                <div class="canvas-wrapper">
                   

                    <div class="canvas" id="mainCanvas">
                        <div class="canvas-empty-state">
                            <i class='bx bx-mouse'></i>
                            <h3>Comienza a construir tu landing page</h3>
                            <p>Arrastra componentes desde el panel lateral para empezar</p>
                        </div>
                    </div>
                </div>
            </section>

             <!-- Panel de Propiedades  -->
            <aside class="properties-panel" id="propertiesPanel">
                <div class="panel-header">
                    <h2>Propiedades</h2>
                    <button class="close-panel-btn" id="closeProperties">
                        <i class='bx bx-x'></i>
                    </button>
                </div>

                <div class="panel-content">
                    <div class="empty-properties">
                        <i class='bx bx-slider'></i>
                        <p>Selecciona un componente para editar sus propiedades</p>
                    </div>
                </div>
            </aside>
        </div>

         <!-- Botón flotante para mostrar componentes en móvil  -->
        <button class="floating-btn" id="showComponentsBtn">
            <i class='bx bx-plus'></i>
        </button>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="js/crear.js"></script>
</body>
</html>