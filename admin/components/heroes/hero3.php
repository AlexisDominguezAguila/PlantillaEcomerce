<section class="hero hero-3">
  <?php if ($props['fondo_tipo'] === 'video' && !empty($props['fondo_url'])): ?>
    <video class="hero3-bg" autoplay muted loop playsinline>
      <source src="<?= htmlspecialchars($props['fondo_url']) ?>" type="video/mp4">
    </video>
  <?php else: ?>
    <img src="<?= htmlspecialchars($props['fondo_url']) ?>" alt="Fondo Hero" class="hero3-bg">
  <?php endif; ?>

  <div class="hero3-overlay"></div>

  <div class="hero3-content">
    <h1 class="hero3-title"><?= htmlspecialchars($props['titulo']) ?></h1>
    <p class="hero3-description"><?= htmlspecialchars($props['descripcion']) ?></p>
    <div class="hero3-buttons">
      <a href="<?= htmlspecialchars($props['boton_primario_url']) ?>" class="btn btn-primary">
        <?= htmlspecialchars($props['boton_primario_texto']) ?>
      </a>
      <a href="<?= htmlspecialchars($props['boton_secundario_url']) ?>" class="btn btn-secondary">
        <?= htmlspecialchars($props['boton_secundario_texto']) ?>
      </a>
    </div>
  </div>
</section>
