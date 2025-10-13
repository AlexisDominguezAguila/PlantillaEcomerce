<section class="hero hero-2">
  <div class="hero2-wrapper">
    
    <div class="hero2-media">
      <?php if ($props['fondo_tipo'] === 'video' && !empty($props['fondo_url'])): ?>
        <video autoplay muted loop playsinline class="hero2-video">
          <source src="<?= $props['fondo_url'] ?>" type="video/mp4">
        </video>
      <?php else: ?>
        <img src="<?= htmlspecialchars($props['fondo_url']) ?>" alt="Hero media" class="hero2-image">
      <?php endif; ?>
    </div>

    <div class="hero2-content">
      <h1 class="hero2-title"><?= htmlspecialchars($props['titulo']) ?></h1>
      <p class="hero2-description"><?= htmlspecialchars($props['descripcion']) ?></p>
      <div class="hero2-buttons">
        <a href="<?= htmlspecialchars($props['boton_primario_url']) ?>" class="btn btn-primary">
          <?= htmlspecialchars($props['boton_primario_texto']) ?>
        </a>
        <a href="<?= htmlspecialchars($props['boton_secundario_url']) ?>" class="btn btn-secondary">
          <?= htmlspecialchars($props['boton_secundario_texto']) ?>
        </a>
      </div>
    </div>
  </div>
</section>
