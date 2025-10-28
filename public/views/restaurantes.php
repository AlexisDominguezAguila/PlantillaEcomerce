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
    <section class="pricing">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Planes y precios</h2>
          <p class="section-description">Elige el plan que se adapte a tu operación</p>
          <p class="price-range">Desde <strong>S/80</strong> hasta <strong>S/240</strong> (sin IGV)</p>
        </div>

        <div class="pricing-grid">
          <!-- Básico -->
          <div class="plan-card">
            <h3 class="plan-title">Básico</h3>
            <p class="plan-desc">Lo esencial para empezar a digitalizar tu salón.</p>
            <div class="plan-price">
              <span class="currency">S/</span><span class="amount">80</span><span class="note">/mes · sin IGV</span>
            </div>
            <ul class="plan-features">
              <li><i class="fa-solid fa-check"></i>Toma de pedidos por mesero</li>
              <li><i class="fa-solid fa-check"></i>Carta digital básica</li>
              <li><i class="fa-solid fa-check"></i>1 local · 2 usuarios</li>
              <li><i class="fa-solid fa-check"></i>Inventario esencial</li>
              <li><i class="fa-solid fa-check"></i>Soporte por chat (horario laboral)</li>
            </ul>
            <div class="plan-cta">
              <a href="contacto.html" class="btn btn-primary"><i class="fa-solid fa-rocket"></i> Empezar</a>
              <a href="login.html" class="btn btn-outline"><i class="fa-regular fa-eye"></i> Probar demo</a>
            </div>
          </div>

          <!-- Estándar -->
          <div class="plan-card">
            <h3 class="plan-title">Estándar</h3>
            <p class="plan-desc">Agrega QR y reportes para decisiones rápidas.</p>
            <div class="plan-price">
              <span class="currency">S/</span><span class="amount">120</span><span class="note">/mes · sin IGV</span>
            </div>
            <ul class="plan-features">
              <li><i class="fa-solid fa-check"></i>Pedidos por QR y mesero</li>
              <li><i class="fa-solid fa-check"></i>KDS básico en cocina</li>
              <li><i class="fa-solid fa-check"></i>1 local · 3 usuarios</li>
              <li><i class="fa-solid fa-check"></i>Reportes de ventas diarios</li>
              <li><i class="fa-solid fa-check"></i>Soporte por chat + email</li>
            </ul>
            <div class="plan-cta">
              <a href="contacto.html" class="btn btn-primary"><i class="fa-solid fa-rocket"></i> Empezar</a>
              <a href="login.html" class="btn btn-outline"><i class="fa-regular fa-eye"></i> Probar demo</a>
            </div>
          </div>

          <!-- Pro -->
          <div class="plan-card plan--pro">
            <span class="plan-badge">Más elegido</span>
            <h3 class="plan-title">Pro</h3>
            <p class="plan-desc">Control avanzado de cocina, caja e inventario.</p>
            <div class="plan-price">
              <span class="currency">S/</span><span class="amount">160</span><span class="note">/mes · sin IGV</span>
            </div>
            <ul class="plan-features">
              <li><i class="fa-solid fa-check"></i>Pedidos QR, mesero y para llevar</li>
              <li><i class="fa-solid fa-check"></i>KDS avanzado + estados por partida</li>
              <li><i class="fa-solid fa-check"></i>2 locales · 5 usuarios</li>
              <li><i class="fa-solid fa-check"></i>Estadísticas de consumo y rentabilidad</li>
              <li><i class="fa-solid fa-check"></i>Inventario con mermas y recetas</li>
            </ul>
            <div class="plan-cta">
              <a href="contacto.html" class="btn btn-primary"><i class="fa-solid fa-rocket"></i> Empezar</a>
              <a href="login.html" class="btn btn-outline"><i class="fa-regular fa-eye"></i> Probar demo</a>
            </div>
          </div>

          <!-- Premium -->
          <div class="plan-card">
            <h3 class="plan-title">Premium</h3>
            <p class="plan-desc">Multi-sucursal, integraciones y soporte prioritario.</p>
            <div class="plan-price">
              <span class="currency">S/</span><span class="amount">240</span><span class="note">/mes · sin IGV</span>
            </div>
            <ul class="plan-features">
              <li><i class="fa-solid fa-check"></i>Multi-sucursal · 8 usuarios</li>
              <li><i class="fa-solid fa-check"></i>Integración con impresoras y contabilidad</li>
              <li><i class="fa-solid fa-check"></i>Dashboards ejecutivos</li>
              <li><i class="fa-solid fa-check"></i>Roles y auditoría</li>
              <li><i class="fa-solid fa-check"></i>Soporte prioritario</li>
            </ul>
            <div class="plan-cta">
              <a href="contacto.html" class="btn btn-primary"><i class="fa-solid fa-rocket"></i> Empezar</a>
              <a href="login.html" class="btn btn-outline"><i class="fa-regular fa-eye"></i> Probar demo</a>
            </div>
          </div>
        </div>

        <!-- Comparativa rápida -->
        <div class="compare" aria-label="Comparativa de planes">
          <table>
            <thead>
              <tr>
                <th>Características</th>
                <th>Básico</th>
                <th>Estándar</th>
                <th>Pro</th>
                <th>Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Pedidos por QR</td>
                <td class="na">—</td><td><i class="fa-solid fa-check"></i></td><td><i class="fa-solid fa-check"></i></td><td><i class="fa-solid fa-check"></i></td>
              </tr>
              <tr>
                <td>KDS (Cocina)</td>
                <td class="na">—</td><td>Básico</td><td>Avanzado</td><td>Avanzado</td>
              </tr>
              <tr>
                <td>Locales / Usuarios</td>
                <td>1 / 2</td><td>1 / 3</td><td>2 / 5</td><td>Multi / 8</td>
              </tr>
              <tr>
                <td>Inventario</td>
                <td>Esencial</td><td>Esencial</td><td>Recetas + mermas</td><td>Recetas + mermas</td>
              </tr>
              <tr>
                <td>Reportes / Estadísticas</td>
                <td>Ventas</td><td>Ventas + diarios</td><td>Consumo + rentabilidad</td><td>Dashboards ejecutivos</td>
              </tr>
              <tr>
                <td>Soporte</td>
                <td>Chat (horario)</td><td>Chat + email</td><td>Prioridad media</td><td>Prioritario</td>
              </tr>
            </tbody>
          </table>
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
