<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TEC RIVERA - Tecnología y Servicios de Software</title>
    <link
      rel="shortcut icon"
      href="public/assets/images/iconoTEC.png"
      type="image/x-icon"
    />
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="public/assets/css/global.css" />
    <link rel="stylesheet" href="public/assets/css/index.css" />
    <!-- Boxicons -->
    <link
      rel="stylesheet"
      href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
    />
    <style>
         .container-circle {
        position: relative;
        width: 500px;
        height: 500px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      /* ===== CÍRCULO CENTRAL ===== */
      .center-circle {
        position: absolute;
        width: 180px;
        height: 180px;
        border-radius: 50%;
        border: 5px solid #38b6ff;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 3;
      }

      .center-circle img {
        width: 90%;
        height: auto;
      }

      /* ===== CÍRCULO PUNTEADO ===== */
      .dotted-ring {
        position: absolute;
        width: 220px;
        height: 220px;
        border-radius: 50%;
        border: 2px dashed rgba(56, 182, 255, 0.6);
        z-index: 2;
      }

      /* ===== ANILLO INTERMEDIO (fondo azul claro) ===== */
      .middle-ring-bg {
        position: absolute;
        width: 250px;
        height: 250px;
        border-radius: 50%;
        background: radial-gradient(
          circle,
          rgba(56, 182, 255, 0.12) 40%,
          rgba(255, 255, 255, 0.8) 100%
        );
        z-index: 1;
      }

      /* ===== TEXTOS ROTATORIOS ===== */
      .ring {
        position: absolute;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .ring-text {
        position: absolute;
        width: 100%;
        height: 100%;
        animation: rotate 45s linear infinite;
      }

      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .text-path {
        fill: #1a1b5e;
        font-weight: 700;
        letter-spacing: 1.5px;
      }

      /* ===== ANILLO 1: Texto exterior grande ===== */
      .ring-outer {
        width: 400px;
        height: 400px;
      }

      .ring-outer .text-path {
        font-size: 31px;
      }

      /* ===== ANILLO 2: Texto intermedio más pequeño ===== */
      .ring-inner {
        width: 300px;
        height: 300px;
      }

      .ring-inner .text-path {
        font-size: 28px;
        font-weight: 600;
        fill: #2c58a0;
      }
    </style>
  </head>
  <body>
    <!-- Topbar -->
    <div class="topbar" role="region" aria-label="Ingreso de tenant">
      <div class="container topbar-inner">
        <span class="topbar-text">
          SI YA ERES SOCIO, INGRESA CON TU TENANT
        </span>
        <a href="public/views/login.html" class="topbar-cta">INGRESA TU ID</a>
      </div>
    </div>

    <header class="header">
      <div class="container">
        <nav class="nav">
          <a href="index.html" class="logo">
            <span class="logo-icon">
              <img
                src="public/assets/images/iconoTEC.png"
                alt="iconoTEC"
                style="width: 30px; height: 30px"
              />
            </span>
            <span class="logo-text">TEC RIVERA</span>
          </a>

          <ul class="nav-menu" id="navMenu">
            <li><a class="active" href="#">Inicio</a></li>
            <li><a href="public/views/productos.php">Productos</a></li>
            <li><a href="public/views/servicios.php">Servicios</a></li>
            <li><a href="public/views/restaurantes.php">Restaurantes</a></li>
            <li><a href="public/views/contacto.php">Contacto</a></li>

            <div class="nav-actions-mobile">
              <a href="public/views/inicio.php" class="btn-primary"
                >Iniciar Sesión</a
              >
            </div>
          </ul>

          <!-- Botones normales (visibles en escritorio) -->
          <div class="nav-actions">
            <!-- <a href="#contacto" class="btn-secondary">Contacto</a> -->
            <a href="public/views/inicio.php" class="btn-primary"
              >Iniciar Sesión</a
            >
          </div>

          <button class="mobile-toggle" id="mobileToggle">
            <span></span><span></span><span></span>
          </button>
        </nav>
      </div>
    </header>

    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-content">
          <h1 class="hero-title">
            Soluciones<span class="hero-title2">
              inteligentes para impulsar tu</span
            >
            negocio y empresa
          </h1>
          <h1 class="hero-title2">¡Todo en un solo lugar!</h1>
          <p class="hero-description">
            Tu aliado estratégico para llevar tu negocio al siguiente nivel.
          </p>
          <div class="hero-actions">
            <a href="public/views/contacto.php" class="btn-primary btn-large">Solicitar Demo</a>
            <a href="public/views/servicios.php" class="btn-secondary btn-large"
              >Explorar Servicios</a
            >
          </div>
        </div>

        <div class="hero-media">
          <div class="container-circle">
            <!-- Fondo azul intermedio -->
            <div class="middle-ring-bg"></div>

            <!-- Círculo punteado -->
            <div class="dotted-ring"></div>

            <!-- Círculo central -->
            <div class="center-circle">
              <img src="public/assets/images/LogoTEC.png" alt="TEC RIVERA Logo" />
            </div>

            <!-- Anillo interior con texto más pequeño -->
            <div class="ring ring-inner">
              <svg viewBox="0 0 350 350" width="350" height="350" class="ring-text">
                <defs>
                  <path
                    id="textPathInner"
                    d="M175,175 m-150,0 a150,150 0 1,1 300,0 a150,150 0 1,1 -300,0"
                    fill="none"
                  />
                </defs>
                <text class="text-path">
                  <textPath href="#textPathInner" startOffset="0%">
                    Sistema de Restaurantes - Digitalizacion de cartas - Páginas Web -
                  </textPath>
                </text>
              </svg>
            </div>

            <!-- Anillo exterior con texto grande -->
            <div class="ring ring-outer">
              <svg viewBox="0 0 500 500" width="500" height="500" class="ring-text">
                <defs>
                  <path
                    id="textPathOuter"
                    d="M250,250 m-220,0 a220,220 0 1,1 440,0 a220,220 0 1,1 -440,0"
                    fill="none"
                  />
                </defs>
                <text class="text-path">
                  <textPath href="#textPathOuter" startOffset="0%">
                    Control de Reportes • Análisis de Datos • Generación de Pedidos •
                    Páginas de Datos •
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
             
        </div>
      </div>
    </section>

    <section class="stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">400+</div>
            <div class="stat-label">Clientes en todo el Perú</div>
            <div class="stat-company">Empresas Líderes</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">10+</div>
            <div class="stat-label">Modelos de solucion</div>
            <div class="stat-company">Soporte 24/7</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">13+</div>
            <div class="stat-label">Años Brindando soluciones</div>
            <div class="stat-company">En el Mercado</div>
          </div>
        </div>
      </div>
    </section>
    <!-- PRODUCTS -->
    <section class="products" id="productos">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Nuestros Productos</h2>
      <p class="section-description">
        Nuestras herramientas y productos simplificarán tu gestión
      </p>
    </div>

    <!-- Grid dinámico -->
    <div class="products-grid" id="publicProductsGrid"></div>

    <div class="products-actions" style="text-align:center;margin-top:2rem">
      <a href="public/views/productos.html" class="btn-secondary btn-large">Ver Catálogo Completo</a>
    </div>
  </div>
</section>


    <!-- SERVICES -->
    <!-- <section class="services" id="servicios">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Nuestras herramientas</h2>
          <p class="section-description">
            Soluciones tecnológicas personalizadas para tu empresa
          </p>
        </div>
        <div class="services-grid">
          <div class="service-card">
            <div class="service-icon"><i class="fas fa-code"></i></div>
            <h3 class="service-title">Sistema de Restaurante</h3>
            <p class="service-description">
              Creamos aplicaciones web, móviles y de escritorio personalizadas.
              Desde MVPs hasta sistemas empresariales complejos.
            </p>
            <ul class="service-features">
              <li>Aplicaciones Web Modernas</li>
              <li>Apps Móviles iOS/Android</li>
              <li>Sistemas Empresariales</li>
              <li>APIs y Microservicios</li>
            </ul>
            <a href="#contacto" class="service-link">Solicitar Cotización →</a>
          </div>
          <div class="service-card featured">
            <div class="service-badge">Más Popular</div>
            <div class="service-icon"><i class="fas fa-users"></i></div>
            <h3 class="service-title">Venta de Productos de Computo</h3>
            <p class="service-description">
              Amplía tu equipo con nuestros profesionales especializados.
              Talento calificado cuando lo necesites.
            </p>
            <ul class="service-features">
              <li>Desarrolladores Full Stack</li>
              <li>DevOps Engineers</li>
              <li>QA Testers</li>
              <li>Project Managers</li>
            </ul>
            <a href="#contacto" class="service-link">Solicitar Cotización →</a>
          </div>
          <div class="service-card">
            <div class="service-icon"><i class="fas fa-headset"></i></div>
            <h3 class="service-title">Soporte Técnico</h3>
            <p class="service-description">
              Soporte 24/7 para mantener tu infraestructura funcionando sin
              interrupciones.
            </p>
            <ul class="service-features">
              <li>Soporte 24/7/365</li>
              <li>Mantenimiento Preventivo</li>
              <li>Monitoreo Continuo</li>
              <li>Respuesta Inmediata</li>
            </ul>
            <a href="#contacto" class="service-link">Solicitar Cotización →</a>
          </div>
          <div class="service-card">
            <div class="service-icon"><i class="fas fa-cloud"></i></div>
            <h3 class="service-title">Generación de Reportes</h3>
            <p class="service-description">
              Migración y optimización de infraestructura en la nube. AWS,
              Azure, Google Cloud.
            </p>
            <ul class="service-features">
              <li>Migración a la Nube</li>
              <li>Arquitectura Cloud</li>
              <li>Optimización de Costos</li>
              <li>DevOps & CI/CD</li>
            </ul>
            <a href="#contacto" class="service-link">Solicitar Cotización →</a>
          </div>
          <div class="service-card">
            <div class="service-icon"><i class="fas fa-lock"></i></div>
            <h3 class="service-title">Punto de Venta</h3>
            <p class="service-description">
              Protege tu empresa con nuestras soluciones de seguridad
              informática avanzada.
            </p>
            <ul class="service-features">
              <li>Auditorías de Seguridad</li>
              <li>Pentesting</li>
              <li>Protección DDoS</li>
              <li>Cumplimiento Normativo</li>
            </ul>
            <a href="#contacto" class="service-link">Solicitar Cotización →</a>
          </div>
          <div class="service-card">
            <div class="service-icon"><i class="fas fa-chart-line"></i></div>
            <h3 class="service-title">Análisis de Datos</h3>
            <p class="service-description">
              Transforma tus datos en insights accionables con BI y Machine
              Learning.
            </p>
            <ul class="service-features">
              <li>Business Intelligence</li>
              <li>Data Analytics</li>
              <li>Machine Learning</li>
              <li>Dashboards Personalizados</li>
            </ul>
            <a href="#contacto" class="service-link">Solicitar Cotización →</a>
          </div>
        </div>
      </div>
    </section> -->

    <!-- SOLUTIONS -->
    <section class="solutions" id="soluciones">
      <div class="container">
        <div class="solutions-content">
          <div class="solutions-text">
            <p class="solutions-label">✦ Soluciones Empresariales</p>
            <h2 class="solutions-title">Acelera tu transformación digital</h2>
            <p class="solutions-description">
              La plataforma para el progreso rápido. Deja que tu equipo se
              enfoque en innovar mientras nosotros manejamos la infraestructura
              con automatización, testing integrado y colaboración fluida.
            </p>
            <div class="solutions-features">
              <div class="solution-feature">
                <div class="feature-icon">✓</div>
                <div>
                  <h4>Implementación Rápida</h4>
                  <p>Despliega tus proyectos en días, no en meses</p>
                </div>
              </div>
              <div class="solution-feature">
                <div class="feature-icon">✓</div>
                <div>
                  <h4>Escalabilidad Garantizada</h4>
                  <p>Crece sin límites con nuestra infraestructura</p>
                </div>
              </div>
              <div class="solution-feature">
                <div class="feature-icon">✓</div>
                <div>
                  <h4>Soporte Dedicado</h4>
                  <p>Equipo experto disponible 24/7 para ti</p>
                </div>
              </div>
            </div>
          </div>
          <div class="solutions-image">
            <i class="fas fa-chart-network"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">¿Listo para comenzar?</h2>
          <p class="cta-description">
            Únete a cientos de empresas que confían en TEC RIVERA para sus
            soluciones tecnológicas
          </p>
          <div class="cta-actions">
            <a href="public/views/contacto.html" class="btn-secondary btn-large"
              >Solicitar Consultoría Gratuita</a
            >
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <!-- LOGO / DESCRIPCIÓN -->
          <div class="footer-column">
            <div class="footer-logo">
              <span class="logo-icon">
                <img
                  src="public/assets/images/iconoTEC.png"
                  alt="iconoTEC"
                  style="width: 30px; height: 30px"
                />
              </span>
              <span class="logo-text">TEC RIVERA</span>
            </div>
            <p class="footer-description">
              Soluciones tecnológicas integrales para empresas que buscan
              innovar y crecer.
            </p>
            <div class="social-links">
              <a
                href="https://www.facebook.com/multi.per.5"
                aria-label="Facebook"
                ><i class="bx bxl-facebook"></i
              ></a>
              <a
                href="https://www.instagram.com/tecrivera_peru?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                aria-label="Instagram"
                ><i class="bx bxl-instagram"></i
              ></a>
            </div>
          </div>

          <!-- 🔹 Agrupación nueva de columnas -->
          <div class="footer-columns-wrapper">
            <div class="footer-column">
              <h4>Productos</h4>
              <ul>
                <li><a href="#">Laptops</a></li>
                <li><a href="#">Servidores</a></li>
                <li><a href="#">Networking</a></li>
                <li><a href="#">Seguridad</a></li>
                <li><a href="#">Accesorios</a></li>
              </ul>
            </div>

            <div class="footer-column">
              <h4>Servicios</h4>
              <ul>
                <li><a href="#">Análisis de Datos</a></li>
                <li><a href="#">Punto de Venta</a></li>
                <li><a href="#">Soporte Técnico</a></li>
                <li><a href="#">Generación de Reportes</a></li>
                <li><a href="#">Sistema de Restaurantes</a></li>
              </ul>
            </div>

            <div class="footer-column">
              <h4>Empresa</h4>
              <ul>
                <li><a href="#">Nosotros</a></li>
                <li><a href="#">Casos de Éxito</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Carreras</a></li>
                <li><a href="#">Contacto</a></li>
              </ul>
            </div>

            <div class="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacidad</a></li>
                <li><a href="#">Términos</a></li>
                <li><a href="#">Cookies</a></li>
                <li><a href="#">Licencias</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2025 TEC RIVERA. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>

    <script src="public/assets/js/home.js"></script>
    <script>
  // Ajusta la ruta según tu estructura:
  const PUBLIC_CARDS_API = 'public/controllers/IndexController.php?limit=6';

  const escapeHTML = (str) =>
    String(str ?? "").replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[m]));
  const escapeAttr = (str) => escapeHTML(String(str)).replace(/"/g, "&quot;");

  function makeCardHTML(c) {
    const badge = c.badge_text ? `<span class="product-badge">${escapeHTML(c.badge_text)}</span>` : "";
    const btnUrl = c.button_url && c.button_url !== "#" ? escapeAttr(c.button_url) : "#";
    const btn = `<button class="btn-product" onclick="if('${btnUrl}'!=='#') window.open('${btnUrl}','_blank')">
                   ${escapeHTML(c.button_label || 'Ver Detalles')}
                 </button>`;

    return `
      <div class="product-card">
        <div class="product-image">
          <img src="${escapeAttr(c.image_url)}" alt="${escapeAttr(c.image_alt || 'Imagen')}">
          ${badge}
        </div>
        <div class="product-info">
          <h3 class="product-title">${escapeHTML(c.title)}</h3>
          <p class="product-description">${escapeHTML(c.description || '')}</p>
          <div class="product-footer">
            <span class="product-price">${escapeHTML(c.footer_text || '')}</span>
            ${btn}
          </div>
        </div>
      </div>
    `;
  }

  async function cargarPublicCards() {
    try {
      const res = await fetch(PUBLIC_CARDS_API, { cache: 'no-store' });
      const items = await res.json();
      const grid = document.getElementById('publicProductsGrid');

      if (!Array.isArray(items) || items.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column:1/-1;text-align:center;padding:2rem;">
            <i class="bx bx-layer" style="font-size:2rem;"></i>
            <h3>No hay productos publicados</h3>
            <p>Vuelve más tarde</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = items.map(makeCardHTML).join('');
    } catch (err) {
      console.error('Error cargando cards públicas:', err);
      const grid = document.getElementById('publicProductsGrid');
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;text-align:center;padding:2rem;">
          <i class="bx bx-error-circle" style="font-size:2rem;"></i>
          <h3>Ups, no se pudo cargar</h3>
          <p>Intenta nuevamente en unos instantes</p>
        </div>
      `;
    }
  }

  document.addEventListener('DOMContentLoaded', cargarPublicCards);
</script>
  </body>
</html>
