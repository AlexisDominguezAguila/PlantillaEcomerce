<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Servicios - TEC RIVERA</title>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet"/>
  <link rel="stylesheet" href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" />
    <link rel="stylesheet" href="../assets/css/global.css" />
    <link rel="stylesheet" href="../assets/css/servic.css" />
</head>
<body>
  <!-- Topbar -->
  <div class="topbar" role="region" aria-label="Ingreso de tenant">
    <div class="container topbar-inner">
      <span class="topbar-text">SI YA ERES SOCIO, INGRESA CON TU TENANT</span>
      <a href="login.html" class="topbar-cta">INGRESA TU ID</a>
    </div>
  </div>

  <!-- Header -->
   <?php include('../partials/header.php') ?>

  <!-- Hero Section -->
  <section class="page-hero hero-has-bg" id="hero">
    <div class="hero-bg" aria-hidden="true">
      <img src="../assets/images/hero-service.jpg" alt="Servicios TEC RIVERA">
    </div>

    <div class="container">
      <div class="hero-content">
        <p class="hero-label">Nuestros Servicios</p>
        <h1 class="hero-title">Soluciones tecnológicas a tu medida</h1>
        <p class="hero-description">
          Ofrecemos servicios especializados que impulsan la transformación digital de tu empresa con tecnología de vanguardia.
        </p>
      </div>
    </div>
  </section>


  <!-- Main Benefits -->
  <section class="benefits">
    <div class="container">
      <div class="benefits-grid">
        <div class="benefit-card">
          <div class="benefit-icon"><i class="fas fa-rocket"></i></div>
          <h3>Implementación Rápida</h3>
          <p>Despliega tus proyectos en días, no en meses, con nuestra metodología ágil probada</p>
        </div>
        <div class="benefit-card">
          <div class="benefit-icon"><i class="fas fa-chart-line"></i></div>
          <h3>Escalabilidad Garantizada</h3>
          <p>Crece sin límites con infraestructura cloud que se adapta a tu ritmo de crecimiento</p>
        </div>
        <div class="benefit-card">
          <div class="benefit-icon"><i class="fas fa-headset"></i></div>
          <h3>Soporte Dedicado 24/7</h3>
          <p>Equipo experto siempre disponible para resolver cualquier incidencia en minutos</p>
        </div>
        <div class="benefit-card">
          <div class="benefit-icon"><i class="fas fa-lightbulb"></i></div>
          <h3>Disponibilidad de la información</h3>
          <p>Información accesible en todo momento, garantizando transparencia y disponibilidad continua (24/7).</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Dynamic Services Grid -->
  <section class="services-detailed">
    <div class="container">
      <div class="services-grid" id="servicesGrid">
        <!-- Aquí se insertarán dinámicamente los servicios activos desde la BD -->
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta">
    <div class="container">
      <div class="cta-content">
        <h2 class="cta-title">¿No encuentras el servicio que buscas?</h2>
        <p class="cta-description">
          Contáctanos y diseñaremos una solución personalizada para tu empresa
        </p>
        <div class="cta-actions">
          <a href="contacto.html" class="btn-primary btn-large">Consultoría Gratuita</a>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
   <?php include('../partials/footer.php') ?>

      <script src="../assets/js/home.js"></script>
  <script src="../assets/js/servicios.js"></script>


</body>
</html>