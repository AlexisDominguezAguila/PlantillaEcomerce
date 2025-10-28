<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sistema de Restaurante | TEC RIVERA</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet"/>
    <link rel="stylesheet" href="../assets/css/global.css" />
    <link rel="stylesheet" href="../assets/css/index.css" />
    <link rel="stylesheet" href="../assets/css/footer.css" />
    <link rel="stylesheet" href="../assets/css/header.css" />


    <link rel="stylesheet" href="../assets/css/soluciones.css" />
    <link rel="stylesheet" href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"/>
  </head>
  <body>
    <!-- Topbar -->
     <?php include_once '../partials/topbar.php'; ?>

    <!-- Header -->
    <?php include_once  '../partials/header.php'; ?>

    <!-- HERO RESTAURANTE -->
    <section class="resto-hero">
      <div class="container">
        <p class="hero-label">✦ Sistema de Restaurante</p>
        <h1 class="hero-title">Gestión operativa completa: pedidos, cocina, caja e inventario</h1>
        <p class="hero-description">
          Aplicación integral para restaurantes, cafés y bares. Desde la toma de pedidos (mesero o QR)
          hasta el control de cocina, cierre de caja y stock—todo en una interfaz sencilla y moderna.
        </p>

        <div class="resto-highlights">
          <div class="resto-chip"><i class="fa-solid fa-qrcode"></i> Pedidos por QR o mesero</div>
          <div class="resto-chip"><i class="fa-solid fa-chart-line"></i> Estadísticas de consumo y rentabilidad</div>
          <div class="resto-chip"><i class="fa-solid fa-utensils"></i> Adaptable a restaurantes, cafés y bares</div>
        </div>
      </div>
    </section>

    <!-- PLANES Y PRECIOS -->
    <!-- PLANES Y PRECIOS -->
    <section class="pricing">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Planes y precios</h2>
          <p class="section-description">Elige el plan que se adapte a tu operación</p>
          <p class="price-range" id="priceRange">
            Desde <strong>S/—</strong> hasta <strong>S/—</strong> (sin IGV)
          </p>
        </div>

        <div class="pricing-grid" id="pricingGrid"></div>

        <!-- Comparativa rápida -->
        <div class="compare" aria-label="Comparativa de planes">
          <table id="pricingCompareTable"></table>
        </div>
      </div>
    </section>


    <!-- FOOTER -->
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-column">
            <div class="footer-logo">
              <span class="logo-icon">
                <img src="../assets/images/iconoTEC.png" alt="iconoTEC" style="width: 30px; height: 30px"/>
              </span>
              <span class="logo-text">TEC RIVERA</span>
            </div>
            <p class="footer-description">
              Soluciones tecnológicas integrales para empresas que buscan innovar y crecer.
            </p>
            <div class="social-links">
              <a href="https://www.facebook.com/multi.per.5" aria-label="Facebook"><i class="bx bxl-facebook"></i></a>
              <a href="https://www.instagram.com/tecrivera_peru?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" aria-label="Instagram"><i class="bx bxl-instagram"></i></a>
            </div>
          </div>

          <div class="footer-columns-wrapper">
            <div class="footer-column">
              <h4>Productos</h4>
              <ul>
                <li><a href="#">POS</a></li>
                <li><a href="#">Inventario</a></li>
                <li><a href="#">CRM</a></li>
                <li><a href="#">Dashboards</a></li>
                <li><a href="#">Integraciones</a></li>
              </ul>
            </div>

            <div class="footer-column">
              <h4>Servicios</h4>
              <ul>
                <li><a href="#">Implementación</a></li>
                <li><a href="#">Capacitación</a></li>
                <li><a href="#">Soporte</a></li>
                <li><a href="#">Desarrollo a medida</a></li>
                <li><a href="#">Consultoría</a></li>
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

    <script src="https://kit.fontawesome.com/a2e0e6ad54.js" crossorigin="anonymous"></script>
    <script>
    const PRICING_API = "../controllers/PricingSimpleController.php";
    const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

    document.addEventListener('DOMContentLoaded', loadPricing);

    async function loadPricing() {
      await loadRange();
      const plans = await loadPlans();
      if (plans.length) {
        renderPlans(plans);
        renderCompareFromPlans(plans);
        animateCards();
      } else {
        document.getElementById('pricingGrid').innerHTML =
          `<div class="empty-state">No se encontraron planes.</div>`;
      }
    }

    async function loadRange() {
      try {
        const r = await fetch(`${PRICING_API}?action=rango`, {cache:'no-store'});
        const jr = await r.json();
        const rangeEl = document.getElementById("priceRange");
        if (jr && jr.success && jr.data && rangeEl) {
          const { min_price, max_price } = jr.data;
          rangeEl.innerHTML = `Desde <strong>S/${Number(min_price).toFixed(0)}</strong> hasta <strong>S/${Number(max_price).toFixed(0)}</strong> (sin IGV)`;
        }
      } catch (e) { console.warn('rango:', e); }
    }

    async function loadPlans() {
      try {
        const res = await fetch(`${PRICING_API}?action=listar`, {cache:'no-store'});
        const json = await res.json();
        // Soporta {success:true,data:[...]} o respuesta directa [...]
        if (Array.isArray(json)) return json;
        if (json && json.success && Array.isArray(json.data)) return json.data;
      } catch(e) {
        console.error('listar:', e);
      }
      return [];
    }

    function renderPlans(plans) {
      const grid = document.getElementById('pricingGrid');
      grid.innerHTML = "";
      plans.forEach(p => {
        const badge = (Number(p.is_featured) === 1 && p.badge_text)
          ? `<span class="plan-badge">${esc(p.badge_text)}</span>` : '';

        const featuredClass = Number(p.is_featured) === 1 ? ' plan--pro' : '';
        const feats = Array.isArray(p.features) ? p.features : [];
        const featsHTML = feats.map(f => `<li><i class="fa-solid fa-check"></i>${esc(f)}</li>`).join('');

        const card = document.createElement('div');
        card.className = `plan-card${featuredClass}`;
        card.innerHTML = `
          ${badge}
          <h3 class="plan-title">${esc(p.name)}</h3>
          <p class="plan-desc">${esc(p.description)}</p>
          <div class="plan-price">
            <span class="currency">S/</span>
            <span class="amount">${Number(p.price_amount).toFixed(0)}</span>
            <span class="note">${esc(p.period_note || '/mes · sin IGV')}</span>
          </div>
          <ul class="plan-features">
            ${featsHTML}
          </ul>
          <div class="plan-cta">
            <a href="${esc(p.cta1_url || 'contacto.html')}" class="btn btn-primary">
              <i class="fa-solid fa-rocket"></i> ${esc(p.cta1_label || 'Empezar')}
            </a>
            <a href="${esc(p.cta2_url || 'login.html')}" class="btn btn-outline">
              <i class="fa-regular fa-eye"></i> ${esc(p.cta2_label || 'Probar demo')}
            </a>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    /**
     * Construye la comparativa a partir de la MISMA tabla.
     * Reglas:
     * - Si una característica tiene formato "Clave: Valor", en la tabla se muestra ese Valor.
     * - Si no tiene ":", se marca ✓ para ese plan.
     * - Si no existe en un plan, se muestra "—".
     */
    function renderCompareFromPlans(plans) {
      // 1) Recolecta el conjunto de claves
      const featureMapPerPlan = new Map(); // slug -> Map<key, valueOrTrue>
      const featureKeys = new Set();

      plans.forEach(p => {
        const map = new Map();
        (p.features || []).forEach(raw => {
          if (typeof raw !== 'string') return;
          const idx = raw.indexOf(':');
          if (idx > -1) {
            const key = raw.slice(0, idx).trim();
            const val = raw.slice(idx+1).trim();
            if (key) {
              map.set(key, val || true);
              featureKeys.add(key);
            }
          } else {
            const key = raw.trim();
            if (key) {
              map.set(key, true);
              featureKeys.add(key);
            }
          }
        });
        featureMapPerPlan.set(p.slug || p.id || p.name, { plan:p, features: map });
      });

      // 2) Construye tabla
      const table = document.getElementById('pricingCompareTable');
      if (!table) return;

      // Header
      const thead = `
        <thead>
          <tr>
            <th>Características</th>
            ${plans.map(p => `<th>${esc(p.name)}</th>`).join('')}
          </tr>
        </thead>
      `;

      // Body
      const rowsHTML = Array.from(featureKeys).map(key => {
        const cells = plans.map(p => {
          const rec = featureMapPerPlan.get(p.slug || p.id || p.name);
          const val = rec?.features.get(key);
          if (val === true) {
            return `<td><i class="fa-solid fa-check"></i></td>`;
          } else if (val) {
            return `<td>${esc(String(val))}</td>`;
          } else {
            return `<td class="na">—</td>`;
          }
        }).join('');
        return `<tr><td>${esc(key)}</td>${cells}</tr>`;
      }).join('');

      table.innerHTML = thead + `<tbody>${rowsHTML}</tbody>`;
    }

    function animateCards() {
      document.querySelectorAll('.plan-card').forEach((card, i)=>{
        card.style.opacity = 0;
        card.style.transform = 'translateY(10px)';
        setTimeout(()=>{
          card.style.transition = 'opacity .35s ease, transform .35s ease';
          card.style.opacity = 1;
          card.style.transform = 'translateY(0)';
        }, 120 * i);
      });
    }
    </script>

    <script>
      // (Opcional) Pequeño efecto de entrada para los cards
      document.querySelectorAll('.plan-card').forEach((card, i)=>{
        card.style.opacity = 0;
        card.style.transform = 'translateY(10px)';
        setTimeout(()=>{
          card.style.transition = 'opacity .35s ease, transform .35s ease';
          card.style.opacity = 1;
          card.style.transform = 'translateY(0)';
        }, 120 * i);
      });
    </script>
  </body>
</html>
