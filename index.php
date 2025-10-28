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
    <link rel="stylesheet" href="public/assets/css/header.css" />
    <link rel="stylesheet" href="public/assets/css/index.css" />
    <link rel="stylesheet" href="public/assets/css/footer.css" />
    <!-- Boxicons -->
    <link
      rel="stylesheet"
      href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
    />
  </head>
  <body>
    <!-- Topbar -->
    <div class="xr-topbar" role="region" aria-label="Ingreso de tenant">
      <div class="xr-topbar-inner">
        <span class="xr-topbar-text">
          SI YA ERES SOCIO, INGRESA CON TU TENANT
        </span>
        <a href="#" class="xr-topbar-cta">INGRESA TU ID</a>
      </div>
    </div>

    <!-- HEADER -->
    <header class="xr-header">
      <div class="xr-container">
        <nav class="xr-nav">
          <a href="../../index.php" class="xr-logo">
            <span class="xr-logo-icon">
              <img src="public/assets/images/iconoTEC.png" alt="iconoTEC" style="width:30px;height:30px" />
            </span>
            <span class="xr-logo-text">TEC RIVERA</span>
          </a>

          <ul class="xr-nav-menu" id="navMenu">
            <li><a class="active" href="index.php">Inicio</a></li>
            <li><a  href="public/views/productos.php">Productos</a></li>
            <li><a  href="public/views/servicios.php">Servicios</a></li>
            <li><a  href="public/views/restaurantes.php">Restaurantes</a></li>
            <li><a  href="public/views/contacto.php">Contacto</a></li>
          </ul>

          <button class="xr-mobile-toggle" id="mobileToggle">
            <span></span><span></span><span></span>
          </button>
        </nav>
      </div>
    </header>



    <!-- HERO -->
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

    <!-- STATS -->
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
        <a href="public/views/productos.php" class="btn-secondary btn-large">Ver Catálogo Completo</a>
      </div>
    </div>
    </section>

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
            <img
              src="public/assets/images/transformacion.jpg"
              alt="Soluciones digitales"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="container cta-inner">
        <div class="cta-media">
          <img
            src="public/assets/images/confianza.jpg"
            alt="Impulsa tu empresa"
          />
        </div>
        <div class="cta-content">
          <h2 class="cta-title">¿Listo para comenzar?</h2>
          <p class="cta-description">
            Únete a cientos de empresas que confían en TEC RIVERA para sus
            soluciones tecnológicas
          </p>
          <div class="cta-actions">
            <a
              href="public/views/contacto.php"
              class="btn-secondary btn-large"
            >
              Solicitar Consultoría Gratuita
            </a>
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
              Soluciones tecnológicas integrales para empresas que buscan innovar y
              crecer.
            </p>
            <div class="social-links">
              <a href="https://www.facebook.com/multi.per.5" aria-label="Facebook"
                ><i class="bx bxl-facebook"></i
              ></a>
              <a
                href="https://www.instagram.com/tecrivera_peru"
                aria-label="Instagram"
                ><i class="bx bxl-instagram"></i
              ></a>
            </div>
          </div>

          <!-- Menús -->
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
      const PUBLIC_CARDS_API = "public/controllers/IndexController.php?limit=6";
      const MAX_SHIFT = 28; // px de desplazamiento máximo para el parallax

      /* ============ Helpers ============ */
      const escapeHTML = (str) =>
        String(str ?? "").replace(
          /[&<>"']/g,
          (m) =>
            ({
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': "&quot;",
              "'": "&#039;",
            }[m])
        );
      const escapeAttr = (str) =>
        escapeHTML(String(str)).replace(/"/g, "&quot;");

      /* ============ UI: Cards ============ */
      function makeCardHTML(c) {
        const badge = c.badge_text
          ? `<span class="product-badge">${escapeHTML(c.badge_text)}</span>`
          : "";
        const btnUrl =
          c.button_url && c.button_url !== "#" ? escapeAttr(c.button_url) : "#";
        const btn = `<button class="btn-product" onclick="if('${btnUrl}'!=='#') window.open('${btnUrl}','_blank')">
                   ${escapeHTML(c.button_label || "Ver Detalles")}
                 </button>`;

        return `
      <div class="product-card">
        <div class="product-image">
          <img src="${escapeAttr(c.image_url)}" alt="${escapeAttr(
          c.image_alt || "Imagen"
        )}">
          ${badge}
        </div>
        <div class="product-info">
          <h3 class="product-title">${escapeHTML(c.title)}</h3>
          <p class="product-description">${escapeHTML(c.description || "")}</p>
          <div class="product-footer">
            <span class="product-price">${escapeHTML(
              c.footer_text || ""
            )}</span>
            ${btn}
          </div>
        </div>
      </div>
    `;
      }

      async function cargarPublicCards() {
        try {
          const res = await fetch(PUBLIC_CARDS_API, { cache: "no-store" });
          const items = await res.json();
          const grid = document.getElementById("publicProductsGrid");

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

          grid.innerHTML = items.map(makeCardHTML).join("");

          // Revelado para las cards recién insertadas
          revealObserve(grid.querySelectorAll(".product-card"));
        } catch (err) {
          console.error("Error cargando cards públicas:", err);
          const grid = document.getElementById("publicProductsGrid");
          grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;text-align:center;padding:2rem;">
          <i class="bx bx-error-circle" style="font-size:2rem;"></i>
          <h3>Ups, no se pudo cargar</h3>
          <p>Intenta nuevamente en unos instantes</p>
        </div>
      `;
        }
      }

      /* ============ Reveal on-scroll (stats, products, solutions, cta) ============ */
      let _ioReveal = null;
      function initRevealObserver() {
        _ioReveal = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.style.transition =
                  "transform .5s ease, opacity .5s ease";
                e.target.style.transform = "translateY(0)";
                e.target.style.opacity = "1";
                _ioReveal.unobserve(e.target);
              }
            });
          },
          { threshold: 0.14, rootMargin: "0px 0px -80px 0px" }
        );
      }

      function revealObserve(nodes) {
        if (!_ioReveal) return;
        nodes.forEach((el) => {
          el.style.transform = "translateY(14px)";
          el.style.opacity = "0";
          _ioReveal.observe(el);
        });
      }

      /* ============ CTA Parallax (usa CSS con --py y --scale) ============ */
      function computeCtaOverscanScale() {
        const box = document.querySelector(".cta-media");
        if (!box) return;
        const img = box.querySelector("img");
        if (!img) return;

        const h = box.clientHeight || 220;
        const minScale = 1 + (2 * MAX_SHIFT) / h; // cubrir ±MAX_SHIFT
        const cssScale =
          parseFloat(getComputedStyle(img).getPropertyValue("--scale")) || 1.06;
        img.style.setProperty(
          "--scale",
          Math.max(cssScale, minScale).toFixed(3)
        );
      }

      function updateCtaParallax() {
        const box = document.querySelector(".cta-media");
        if (!box) return;
        const img = box.querySelector("img");
        if (!img) return;

        const vh = window.innerHeight || 0;
        const sec = box.closest(".cta");
        const rect = sec.getBoundingClientRect();

        if (rect.bottom < 0 || rect.top > vh) {
          img.style.setProperty("--py", "0px");
          return;
        }

        const progress = Math.max(
          0,
          Math.min((vh - rect.top) / (vh + rect.height), 1)
        );
        const centered = progress - 0.5;
        const shift = centered * MAX_SHIFT;

        img.style.setProperty("--py", `${Math.round(shift)}px`);
      }

      /* ============ Boot ============ */
      document.addEventListener("DOMContentLoaded", () => {
        // 1) Cargar cards
        cargarPublicCards();

        // 2) Revelado
        initRevealObserver();
        revealObserve(
          document.querySelectorAll(
            ".stat-card, .solution-feature, .solutions-image, .cta-inner"
          )
        );

        // 3) CTA parallax (listeners)
        let ticking = false;
        const onScroll = () => {
          if (ticking) return;
          requestAnimationFrame(() => {
            updateCtaParallax();
            ticking = false;
          });
          ticking = true;
        };

        computeCtaOverscanScale();
        updateCtaParallax();

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", () => {
          computeCtaOverscanScale();
          updateCtaParallax();
        });
      });
    </script>

  </body>
</html>
