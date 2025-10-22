<?php
// arriba del header, antes del HTML
$current_page = basename(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)) ?: 'index.php';

// helper para no repetir
function is_active($files) {
  global $current_page;
  return in_array($current_page, (array)$files, true) ? 'active' : '';
}
?>
<header class="header">
  <div class="container">
    <nav class="nav">
      <a href="../../index.php" class="logo">
        <span class="logo-icon">
          <img src="../assets/images/iconoTEC.png" alt="iconoTEC" style="width:30px;height:30px" />
        </span>
        <span class="logo-text">TEC RIVERA</span>
      </a>

      <ul class="nav-menu" id="navMenu">
        <li><a class="<?= is_active(['index.php']) ?>"      href="../../index.php">Inicio</a></li>
        <li><a class="<?= is_active(['productos.php']) ?>"  href="productos.php">Productos</a></li>
        <li><a class="<?= is_active(['servicios.php']) ?>"  href="servicios.php">Servicios</a></li>
        <li><a class="<?= is_active(['restaurantes.php']) ?>"  href="restaurantes.php">Restaurantes</a></li>
        <li><a class="<?= is_active(['contacto.php']) ?>"   href="contacto.php">Contacto</a></li>
        <li><a class="<?= is_active(['servic.php']) ?>"   href="servic.php">Alexis</a></li>
      </ul>

      <button class="mobile-toggle" id="mobileToggle">
        <span></span><span></span><span></span>
      </button>
    </nav>
  </div>
</header>
