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
        <source
          src="../assets/videos/11738195-hd_1920_1080_24fps.mp4"
          type="video/mp4"
        />
      </video>

      <div class="slider-container">
        <div class="hero-content-slide">
          <div class="slider-track" id="sliderTrack">
            <!-- Slides generados dinámicamente -->
          </div>
          <button class="slider-btn prev" id="prevBtn">‹</button>
          <button class="slider-btn next" id="nextBtn">›</button>
          <div class="slider-dots" id="sliderDots"></div>
        </div>
      </div>
    </section>

    <!-- ================ CATÁLOGO ================ -->
    <section id="catalogo" class="catalogo">
     <header id="catalogoHeader" class="catalogo-header sticky">
        <div class="catalogo-toolbar" role="region" aria-label="Herramientas del catálogo">
            <!-- BÚSQUEDA -->
            <div class="toolbar-search">
            <i class="bx bx-search" aria-hidden="true"></i>
            <input id="prodSearch" type="search" placeholder="Buscar productos..." aria-label="Buscar productos" />
            </div>

            <!-- PÍLDORAS DE CATEGORÍAS (con flechas, ancho limitado) -->
            <div class="category-wrap" role="group" aria-label="Categorías">
            <button class="cat-scroll" id="catScrollLeft" aria-label="Categorías anteriores">
                <i class="bx bx-chevron-left"></i>
            </button>
            <nav id="categoryList" class="category-list scroller" aria-label="Categorías" tabindex="0">
                <!-- .cat-pill generadas por JS -->
            </nav>
            <button class="cat-scroll" id="catScrollRight" aria-label="Más categorías">
                <i class="bx bx-chevron-right"></i>
            </button>
            </div>

            <!-- SELECT + FILTRO DE PRECIO -->
            <div class="filters-group" id="filtersGroup">
            <label for="categorySelect" class="sr-only">Categoría</label>
            <select id="categorySelect" class="category-select" aria-label="Seleccionar categoría"></select>

            <div class="price-filter" aria-label="Filtrar por precio">
                <span class="pf-label">S/.</span>
                <input id="priceMin" type="number" inputmode="numeric" min="0" placeholder="Mín" aria-label="Precio mínimo" />
                <span class="pf-sep">—</span>
                <input id="priceMax" type="number" inputmode="numeric" min="0" placeholder="Máx" aria-label="Precio máximo" />
            </div>
            </div>

            <!-- HAMBURGUESA (solo móvil) -->
            <button id="toolbarMore" class="toolbar-more" aria-expanded="false" aria-controls="filtersGroup">
            <i class="bx bx-slider-alt"></i>
            </button>
        </div>
    </header>
        <!-- Grid donde se renderizan las cards y se ocultaran cuando se activen los detalles de un producto -->
        <div id="productGrid" class="product-grid">
        <!-- Cards generadas dinámicamente por JS -->
        </div>
        <!-- Diseño del Contenedor de detalles del producto -->
        <div id="productDetailSection" class="hidden">
                <div class="max-w-7xl mx-auto px-4 py-8">
                    <div class="text-sm text-gray-600 mb-6">
                    <a href="#" id="backToProducts" class="text-blue-600 hover:underline"
                        >← Volver</a
                    >
                    &nbsp;/ Detalles / <span id="breadcrumb-name"></span>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <!-- Galería -->
                    <div class="bg-white rounded-2xl shadow-lg p-6">
                        <div class="relative">
                        <div class="product-detail-actions">
                            <button
                            id="fav-btn"
                            class="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all"
                            >
                            <i class="bx bx-heart w-6 h-6 text-gray-400"></i>
                            </button>
                        </div>
                        <div
                            class="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4"
                        >
                            <img
                            id="main-img"
                            src=""
                            alt="producto"
                            class="w-full h-full object-contain"
                            />

                            <button
                            id="prev-img"
                            class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white"
                            >
                            <i class="bx bx-chevron-left w-5 h-5 text-gray-700"></i>
                            </button>

                            <button
                            id="next-img"
                            class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white"
                            >
                            <i class="bx bx-chevron-right w-5 h-5 text-gray-700"></i>
                            </button>
                        </div>

                        <div id="thumbs" class="flex gap-2 justify-center"></div>
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="space-y-6">
                        <div class="bg-white rounded-2xl shadow-lg p-6">
                        <div id="brand" class="text-sm text-gray-500 mb-2"></div>
                        <h1 id="name" class="text-2xl font-bold text-gray-900 mb-4"></h1>
                        <div id="rating" class="flex items-center gap-2 mb-4"></div>
                        <div id="sku" class="text-sm text-gray-500 mb-4"></div>

                        <div class="border-t border-b py-4 mb-4">
                            <div id="prices" class="flex items-baseline gap-3 mb-2"></div>
                            <div class="text-sm text-gray-600">
                            Ver opciones de pago y promociones
                            </div>
                        </div>

                        <div id="shipping" class="bg-blue-50 rounded-xl p-4 mb-4"></div>
                        <div id="stock" class="text-green-600 font-medium mb-6"></div>

                        <!-- Cantidad -->
                        <div class="flex items-center gap-4 mb-6">
                            <span class="text-gray-700 font-medium">Cantidad:</span>
                            <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button id="decrement" class="px-4 py-2 hover:bg-gray-100 text-black">
                            <i class="bx bx-minus w-4 h-4 text-black"></i>
                            </button>

                            <input
                            id="quantity"
                            type="text"
                            value="1"
                            readonly
                            class="w-16 text-center border-x border-gray-300 py-2 text-black"
                            />

                            <button id="increment" class="px-4 py-2 hover:bg-gray-100 text-black">
                            <i class="bx bx-plus w-4 h-4 text-black"></i>
                            </button>
                        </div>
                        </div>

                        <!-- Botones -->
                        <div class="space-y-3">
                            <button
                            class="btn-add-cart w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2"
                            >
                            <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                            Añadir al carrito
                            </button>

                            <!-- Botón en detalle -->
                        <button id="checkoutBtnDetail" class="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-xl">
                        Comprar ahora
                        </button>

                        </div>

                        <div id="seller" class="mt-6 pt-6 border-t"></div>
                        </div>
                    </div>
                    </div>

                    <!-- Especificaciones -->
                    <div id="specs" class="bg-white rounded-2xl shadow-lg p-6 mb-12"></div>

                    <!-- Relacionados -->
                    <div id="related" class="bg-white rounded-2xl shadow-lg p-6"></div>
                </div>
        </div>
        <!-- Recomendaciones de productos similares se mostrarán cuando esté activo el detalle de un producto -->
        <div id="recommendations" class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">También te puede interesar</h2>
            <div id="recommendationGrid" class="product-grid">
            <!-- Cards generadas dinámicamente por JS -->
            </div>
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

        <!-- Modal de Checkout -->
        <div class="modal" id="checkoutModal">
            <div class="modal-content modal-lg">
            <button class="modal-close" id="checkoutClose">&times;</button>

            <div class="checkout">
                <!-- Indicadores de pasos -->
                <div class="steps">
                <div class="step-indicator active" data-step="1">1. Resumen</div>
                <div class="step-indicator" data-step="2">2. Tus datos</div>
                <div class="step-indicator" data-step="3">3. Entrega</div>
                <div class="step-indicator" data-step="4">4. Dirección</div>
                <div class="step-indicator" data-step="5">5. Pago</div>
                <div class="step-indicator" data-step="6">6. Confirmación</div>
                </div>

                <!-- Contenido de pasos -->
                <div class="steps-body">
                <!-- ==================== PASO 1: RESUMEN ==================== -->
                <div class="step-panel" id="step1">
                    <h2>Resumen del pedido</h2>
                    <div id="checkoutSummary"></div>
                </div>

                <!-- ==================== PASO 2: DATOS DEL CLIENTE ==================== -->
                <div class="step-panel hidden" id="step2">
                    <h2>Ingresa tus datos</h2>
                    <p class="hint">Necesitamos algunos datos para procesar tu pedido de forma segura.</p>
                    
                    <form id="customerForm">
                    <div class="form-row">
                        <div class="form-field">
                        <label for="customerName">
                            NOMBRE <span class="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="customerName"
                            name="customerName"
                            placeholder="Ej: Juan"
                            required
                        />
                        </div>

                        <div class="form-field">
                        <label for="customerLastName">
                            APELLIDO <span class="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="customerLastName"
                            name="customerLastName"
                            placeholder="Ej: Pérez"
                            required
                        />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-field">
                        <label for="customerEmail">
                            CORREO ELECTRÓNICO <span class="required">*</span>
                        </label>
                        <input
                            type="email"
                            id="customerEmail"
                            name="customerEmail"
                            placeholder="ejemplo@correo.com"
                            required
                        />
                        </div>

                        <div class="form-field">
                        <label for="customerPhone">
                            TELÉFONO / CELULAR <span class="required">*</span>
                        </label>
                        <input
                            type="tel"
                            id="customerPhone"
                            name="customerPhone"
                            placeholder="999 999 999"
                            required
                        />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-field">
                        <label for="customerDNI">
                            DNI <span class="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="customerDNI"
                            name="customerDNI"
                            placeholder="12345678"
                            maxlength="8"
                            pattern="[0-9]{8}"
                            required
                        />
                        </div>

                        <div class="form-field">
                        <label for="customerDocType">TIPO DE DOCUMENTO</label>
                        <select id="customerDocType" name="customerDocType">
                            <option value="dni">DNI</option>
                            <option value="ce">Carnet de Extranjería</option>
                            <option value="passport">Pasaporte</option>
                        </select>
                        </div>
                    </div>
                    </form>
                </div>

                <!-- ==================== PASO 3: MÉTODO DE ENTREGA ==================== -->
                <div class="step-panel hidden" id="step3">
                    <h2>¿Cómo quieres recibir tu pedido?</h2>
                    <p class="hint">Elige la opción que más te convenga</p>

                    <form id="deliveryMethodForm" class="delivery-methods">
                    <label class="delivery-card">
                        <input type="radio" name="deliveryMethod" value="delivery" />
                        <div class="delivery-card-body">
                        <div class="delivery-icon"></div>
                        <div class="title">Delivery a domicilio</div>
                        <div class="desc">
                            Recibe tu pedido en la puerta de tu casa.<br>
                            <strong>Tiempo estimado:</strong> 24-48 horas<br>
                            <strong>Costo:</strong> S/ 10.00 (Gratis en compras mayores a S/ 200)
                        </div>
                        </div>
                    </label>

                    <label class="delivery-card">
                        <input type="radio" name="deliveryMethod" value="pickup" />
                        <div class="delivery-card-body">
                        <div class="delivery-icon"></div>
                        <div class="title">Recojo en tienda</div>
                        <div class="desc">
                            Recoge tu pedido en nuestra tienda física.<br>
                            <strong>Tiempo estimado:</strong> 2-4 horas<br>
                            <strong>Costo:</strong> Gratis
                        </div>
                        </div>
                    </label>
                    </form>
                </div>

                <!-- ==================== PASO 4: DIRECCIÓN ==================== -->
                <div class="step-panel hidden" id="step4">
                    <!-- Formulario de dirección (solo si eligió delivery) -->
                    <div id="addressFormContainer" class="hidden">
                    <h2>Dirección de envío</h2>
                    <p class="hint">Indica dónde quieres recibir tu pedido</p>

                    <form id="addressForm">
                        <div class="form-row">
                        <div class="form-field">
                            <label for="department">DEPARTAMENTO</label>
                            <input
                            type="text"
                            id="department"
                            name="department"
                            placeholder="Ej: Piura"
                            value="Piura"
                            required
                            />
                        </div>

                        <div class="form-field">
                            <label for="province">PROVINCIA</label>
                            <input
                            type="text"
                            id="province"
                            name="province"
                            placeholder="Ej: Piura"
                            required
                            />
                        </div>
                        </div>

                        <div class="form-row">
                        <div class="form-field">
                            <label for="district">DISTRITO</label>
                            <input
                            type="text"
                            id="district"
                            name="district"
                            placeholder="Ej: Castilla"
                            required
                            />
                        </div>

                        <div class="form-field">
                            <label for="postalCode">CÓDIGO POSTAL</label>
                            <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            placeholder="20000"
                            />
                        </div>
                        </div>

                        <div class="form-field full-width">
                        <label for="addressStreet">DIRECCIÓN</label>
                        <input
                            type="text"
                            id="addressStreet"
                            name="addressStreet"
                            placeholder="Av. Principal 123"
                            required
                        />
                        </div>

                        <div class="form-field full-width">
                        <label for="addressReference">REFERENCIA</label>
                        <textarea
                            id="addressReference"
                            name="addressReference"
                            placeholder="Ej: Casa de dos pisos, portón verde, frente al parque"
                        ></textarea>
                        </div>
                    </form>
                    </div>

                    <!-- Info de tienda (solo si eligió pickup) -->
                    <div id="storeInfoContainer" class="hidden">
                    <h2>Información de la tienda</h2>
                    <div class="store-info">
                        <div class="store-icon">🏪</div>
                        <h4>TEC RIVERA - Tienda Principal</h4>
                        <p><strong>Dirección:</strong> Av. Grau 520, Piura 20001</p>
                        <p><strong>Horario de atención:</strong></p>
                        <p>Lunes a Viernes: 9:00 AM - 7:00 PM</p>
                        <p>Sábados: 9:00 AM - 2:00 PM</p>
                        <p><strong>Teléfono:</strong> (073) 123-4567</p>
                        <p class="hint" style="margin-top: 12px;">
                        Te enviaremos un mensaje cuando tu pedido esté listo para recoger.
                        </p>
                    </div>
                    </div>
                </div>

                <!-- ==================== PASO 5: MÉTODO DE PAGO ==================== -->
                <div class="step-panel hidden" id="step5">
                    <h2>Selecciona un método de pago</h2>
                    <form id="paymentMethodForm" class="payment-methods">
                    <label class="payment-card">
                        <input type="radio" name="paymentMethod" value="card" />
                        <div class="payment-card-body">
                        <div class="title">Tarjeta</div>
                        <div class="desc">Crédito o débito</div>
                        </div>
                    </label>

                    <label class="payment-card">
                        <input type="radio" name="paymentMethod" value="wallet" />
                        <div class="payment-card-body">
                        <div class="title">Billetera (Yape/Plin)</div>
                        <div class="desc">Pago por QR o número</div>
                        </div>
                    </label>

                    <label class="payment-card">
                        <input type="radio" name="paymentMethod" value="transfer" />
                        <div class="payment-card-body">
                        <div class="title">Transferencia bancaria</div>
                        <div class="desc">BCP/Interbank/BBVA/Scotiabank</div>
                        </div>
                    </label>

                    <label class="payment-card">
                        <input type="radio" name="paymentMethod" value="whatsapp" />
                        <div class="payment-card-body">
                        <div class="title">WhatsApp (efectivo)</div>
                        <div class="desc">Coordinar pago contra entrega</div>
                        </div>
                    </label>
                    </form>
                </div>

                <!-- ==================== PASO 6: DETALLES DE PAGO ==================== -->
                <div class="step-panel hidden paso3" id="step6">
                    <h2 id="step6Title">Detalles del pago</h2>
                    <div id="paymentMethodView"></div>
                </div>

                <!-- ==================== PASO 7: CONFIRMACIÓN ==================== -->
                <div class="step-panel hidden" id="step7">
                    <h2>¡Pedido recibido!</h2>
                    <p id="confirmationText">
                    Gracias por tu compra. Te hemos enviado un resumen a tu correo electrónico.
                    </p>
                    <div class="receipt-box" id="receiptBox"></div>
                </div>
                </div>

                <!-- Controles -->
                <div class="steps-actions">
                <button class="btn-secondary" id="prevStepBtn">Atrás</button>
                <button class="btn-primary right-btn" id="nextStepBtn">
                    Siguiente
                </button>
                </div>
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