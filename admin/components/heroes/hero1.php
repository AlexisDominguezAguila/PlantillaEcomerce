<section class="hero hero-1" 
    style="background-image: url('<?= $props['fondo_tipo'] === 'imagen' ? $props['fondo_url'] : '' ?>');">

    <?php if ($props['fondo_tipo'] === 'video' && !empty($props['fondo_url'])): ?>
        <video class="hero-bg-video" autoplay muted loop playsinline>
            <source src="<?= $props['fondo_url'] ?>" type="video/mp4">
        </video>
    <?php endif; ?>

    <div class="hero-overlay"></div>

    <div class="hero-content">
        <h1 class="hero-title"><?= htmlspecialchars($props['titulo']) ?></h1>
        <p class="hero-description"><?= htmlspecialchars($props['descripcion']) ?></p>

        <div class="hero-buttons">
            <a href="<?= htmlspecialchars($props['boton_primario_url']) ?>" class="btn btn-primary">
                <?= htmlspecialchars($props['boton_primario_texto']) ?>
            </a>
            <a href="<?= htmlspecialchars($props['boton_secundario_url']) ?>" class="btn btn-secondary">
                <?= htmlspecialchars($props['boton_secundario_texto']) ?>
            </a>
        </div>
    </div>
</section>
