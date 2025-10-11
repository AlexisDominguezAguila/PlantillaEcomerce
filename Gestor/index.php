<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sidebar | Tec Rivera</title>
    <link rel="stylesheet" href="assets/css/sidebar.css" />
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
          src="../public/assets/images/iconoTEC.png"
          alt="Tec Rivera"
          class="logo"
        />
        <h2 class="brand">Tec Rivera</h2>
      </div>

      <nav class="menu">
        <a href="#" class="menu-item active">
          <i class="bx bx-home"></i>
          <span>Inicio</span>
        </a>

        <a href="views/productos.php" class="menu-item">
          <i class="bx bx-box"></i>
          <span>Productos</span>
        </a>

        <a href="views/Servicios.php" class="menu-item">
          <i class="bx bx-cog"></i>
          <span>Servicios</span>
        </a>

        <a href="#" class="menu-item">
          <i class="bx bx-layer"></i>
          <span>Soluciones</span>
        </a>

        <a href="#" class="menu-item">
          <i class="bx bx-message-dots"></i>
          <span>Mensajes</span>
        </a>
      </nav>

      <button id="toggleSidebar" class="toggle-btn">
        <i class="bx bx-chevron-left"></i>
      </button>
    </aside>

    <!-- Contenido principal -->
    <main class="main-content">
      <h1>Bienvenido a tu panel</h1>
      <p>Aquí irá el contenido principal de la aplicación.</p>
    </main>

    <script src="assets/js/sidebar.js"></script>
  </body>
</html>
