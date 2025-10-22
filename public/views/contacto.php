<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contacto - TEC RIVERA</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" />
    <link rel="stylesheet" href="../assets/css/global.css" />
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #111344;
            --primary-light: #1a1a5e;
            --accent: #00d4ff;
            --accent-secondary: #6366f1;
            --text-light: #ffffff;
            --text-muted: #b0b0c0;
            --bg-dark: #0a0a1a;
            --bg-card: #1a1a3e;
            --border-color: rgba(99, 102, 241, 0.2);
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: var(--bg-dark);
            color: var(--text-light);
            overflow-x: hidden;
        }

        /* ===== HERO SECTION CON PARALLAX ===== */
        .page-hero {
            position: relative;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .page-hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(17, 19, 68, 0.7) 0%, rgba(26, 26, 94, 0.5) 100%),
                        url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23111344;stop-opacity:0.3" /><stop offset="100%" style="stop-color:%2300d4ff;stop-opacity:0.1" /></linearGradient></defs><rect width="1200" height="600" fill="url(%23grad1)"/><circle cx="100" cy="100" r="80" fill="%236366f1" opacity="0.1"/><circle cx="1100" cy="500" r="120" fill="%2300d4ff" opacity="0.05"/></svg>');
            background-size: cover;
            background-position: center;
            z-index: 1;
            animation: heroShift 20s ease-in-out infinite;
        }

        @keyframes heroShift {
            0%, 100% { transform: scale(1) translateY(0); }
            50% { transform: scale(1.05) translateY(-20px); }
        }

        .page-hero .container {
            position: relative;
            z-index: 2;
            text-align: center;
        }

        .hero-content {
            animation: fadeInUp 1s ease-out;
        }

        .hero-label {
            font-size: 1.2rem;
            color: var(--accent);
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-bottom: 1rem;
            animation: slideInDown 0.8s ease-out;
        }

        .hero-title {
            font-size: 4.5rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            background: linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: slideInUp 1s ease-out 0.2s both;
        }

        .hero-description {
            font-size: 1.3rem;
            color: var(--text-muted);
            max-width: 600px;
            margin: 0 auto;
            animation: fadeIn 1s ease-out 0.4s both;
        }

        /* ===== ANIMACIONES GENERALES ===== */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }

        @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.3); }
            50% { box-shadow: 0 0 40px rgba(0, 212, 255, 0.6); }
        }

        /* ===== CONTAINER ===== */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        /* ===== CONTACT METHODS ===== */
        .contact-methods {
            padding: 6rem 0;
            background: linear-gradient(180deg, var(--bg-dark) 0%, var(--primary) 100%);
            position: relative;
            overflow: hidden;
        }

        .contact-methods::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
        }

        .contact-methods::after {
            content: '';
            position: absolute;
            bottom: -30%;
            left: -5%;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 70%);
            border-radius: 50%;
            animation: float 8s ease-in-out infinite reverse;
        }

        .methods-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            position: relative;
            z-index: 1;
        }

        .method-card {
            background: rgba(26, 26, 62, 0.6);
            backdrop-filter: blur(10px);
            border: 1px solid var(--border-color);
            padding: 2.5rem;
            border-radius: 15px;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .method-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1), transparent);
            transition: left 0.5s ease;
        }

        .method-card:hover::before {
            left: 100%;
        }

        .method-card:hover {
            transform: translateY(-10px);
            border-color: var(--accent);
            box-shadow: 0 20px 40px rgba(0, 212, 255, 0.1);
        }

        .method-icon {
            font-size: 3rem;
            color: var(--accent);
            margin-bottom: 1rem;
            animation: float 3s ease-in-out infinite;
        }

        .method-card h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: var(--text-light);
        }

        .method-card p {
            color: var(--text-muted);
            margin-bottom: 1rem;
            font-size: 0.9rem;
        }

        .method-card a {
            color: var(--accent);
            text-decoration: none;
            display: block;
            margin: 0.5rem 0;
            transition: all 0.3s ease;
            font-weight: 500;
        }

        .method-card a:hover {
            color: var(--accent-secondary);
            text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }

        .status-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            margin-top: 1rem;
            font-weight: 600;
        }

        .status-badge.online {
            background: rgba(0, 212, 255, 0.2);
            color: var(--accent);
            border: 1px solid var(--accent);
        }

        /* ===== CONTACT MAIN ===== */
        .contact-main {
            padding: 6rem 0;
            background: var(--bg-dark);
            position: relative;
        }

        .contact-main::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--accent), transparent);
        }

        .contact-wrapper {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: start;
        }

        .contact-info-panel {
            animation: fadeInUp 1s ease-out;
        }

        .contact-info-panel h2 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: var(--text-light);
        }

        .info-description {
            color: var(--text-muted);
            margin-bottom: 2rem;
            line-height: 1.6;
        }

        .info-items {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .info-item {
            display: flex;
            gap: 1.5rem;
            padding: 1.5rem;
            background: rgba(26, 26, 62, 0.4);
            border-left: 3px solid var(--accent);
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .info-item:hover {
            background: rgba(26, 26, 62, 0.8);
            transform: translateX(10px);
        }

        .info-icon {
            font-size: 1.8rem;
            color: var(--accent);
            min-width: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .info-content h4 {
            color: var(--text-light);
            margin-bottom: 0.3rem;
        }

        .info-content p {
            color: var(--accent);
            font-weight: 600;
            margin-bottom: 0.2rem;
        }

        .info-content span {
            color: var(--text-muted);
            font-size: 0.85rem;
        }

        .social-connect {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid var(--border-color);
        }

        .social-connect h4 {
            margin-bottom: 1rem;
            color: var(--text-light);
        }

        .social-icons {
            display: flex;
            gap: 1rem;
        }

        .social-icons a {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(99, 102, 241, 0.2);
            border: 1px solid var(--border-color);
            border-radius: 50%;
            color: var(--accent);
            transition: all 0.3s ease;
            font-size: 1.3rem;
        }

        .social-icons a:hover {
            background: var(--accent);
            color: var(--primary);
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
        }

        /* ===== CONTACT FORM ===== */
        .contact-form-panel {
            animation: fadeInUp 1s ease-out 0.2s both;
        }

        .contact-form {
            background: rgba(26, 26, 62, 0.5);
            backdrop-filter: blur(10px);
            border: 1px solid var(--border-color);
            padding: 2.5rem;
            border-radius: 15px;
        }

        .contact-form h2 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            color: var(--text-light);
        }

        .form-subtitle {
            color: var(--text-muted);
            font-size: 0.9rem;
            margin-bottom: 2rem;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group label {
            color: var(--text-light);
            margin-bottom: 0.5rem;
            font-weight: 600;
            font-size: 0.95rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            background: rgba(10, 10, 26, 0.8);
            border: 1px solid var(--border-color);
            color: var(--text-light);
            padding: 0.8rem 1rem;
            border-radius: 8px;
            font-family: inherit;
            transition: all 0.3s ease;
            font-size: 0.95rem;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
            color: var(--text-muted);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--accent);
            background: rgba(10, 10, 26, 0.95);
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
        }

        .form-group textarea {
            resize: vertical;
            min-height: 120px;
        }

        .checkbox-group {
            margin-bottom: 1.5rem;
        }

        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            cursor: pointer;
            color: var(--text-muted);
            transition: all 0.3s ease;
        }

        .checkbox-label input[type="checkbox"] {
            width: 20px;
            height: 20px;
            cursor: pointer;
            accent-color: var(--accent);
        }

        .checkbox-label:hover {
            color: var(--text-light);
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%);
            color: var(--primary);
            border: none;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1rem;
            width: 100%;
            justify-content: center;
        }

        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(0, 212, 255, 0.3);
        }

        .btn-primary:active {
            transform: translateY(-1px);
        }

        .form-message {
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
            display: none;
        }

        .form-message.success {
            display: block;
            background: rgba(0, 212, 255, 0.1);
            color: var(--accent);
            border: 1px solid var(--accent);
        }

        .form-message.error {
            display: block;
            background: rgba(255, 100, 100, 0.1);
            color: #ff6464;
            border: 1px solid #ff6464;
        }

        /* ===== MAP SECTION ===== */
        .map-section {
            padding: 6rem 0;
            background: linear-gradient(180deg, var(--primary) 0%, var(--bg-dark) 100%);
            position: relative;
            overflow: hidden;
        }

        .map-section::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -10%;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
            border-radius: 50%;
        }

        .section-title {
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 3rem;
            color: var(--text-light);
        }

        .map-container {
            position: relative;
            border-radius: 15px;
            overflow: hidden;
            border: 1px solid var(--border-color);
            box-shadow: 0 20px 60px rgba(0, 212, 255, 0.1);
        }

        .map-container iframe {
            width: 100%;
            height: 400px;
            border: none;
        }

        /* ===== FAQ SECTION ===== */
        .faq-section {
            padding: 6rem 0;
            background: var(--bg-dark);
            position: relative;
        }

        .section-header {
            text-align: center;
            margin-bottom: 4rem;
        }

        .section-description {
            color: var(--text-muted);
            font-size: 1.1rem;
            margin-top: 1rem;
        }

        .faq-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
        }

        .faq-item {
            background: rgba(26, 26, 62, 0.5);
            backdrop-filter: blur(10px);
            border: 1px solid var(--border-color);
            padding: 2rem;
            border-radius: 12px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .faq-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, var(--accent), var(--accent-secondary));
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.3s ease;
        }

        .faq-item:hover::before {
            transform: scaleX(1);
        }

        .faq-item:hover {
            transform: translateY(-5px);
            border-color: var(--accent);
        }

        .faq-question {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
            cursor: pointer;
        }

        .faq-question i {
            font-size: 1.5rem;
            color: var(--accent);
        }

        .faq-question h3 {
            color: var(--text-light);
            font-size: 1.1rem;
        }

        .faq-answer {
            color: var(--text-muted);
            line-height: 1.6;
            font-size: 0.95rem;
        }

        /* ===== SCROLL ANIMATIONS ===== */
        .scroll-animate {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }

        .scroll-animate.visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
            .hero-title {
                font-size: 2.5rem;
            }

            .hero-description {
                font-size: 1rem;
            }

            .contact-wrapper {
                grid-template-columns: 1fr;
                gap: 2rem;
            }

            .form-row {
                grid-template-columns: 1fr;
            }

            .methods-grid {
                grid-template-columns: 1fr;
            }

            .map-container iframe {
                height: 300px;
            }

            .section-title {
                font-size: 2rem;
            }
        }
    </style>
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
    <section class="page-hero">
        <div class="container">
            <div class="hero-content">
                <p class="hero-label">Hablemos</p>
                <h1 class="hero-title">Contáctanos</h1>
                <p class="hero-description">
                    Estamos aquí para ayudarte. Cuéntanos sobre tu proyecto y encontraremos la mejor solución para ti.
                </p>
            </div>
        </div>
    </section>

    <!-- Contact Methods -->
    <section class="contact-methods">
        <div class="container">
            <div class="methods-grid">
                <div class="method-card scroll-animate">
                    <div class="method-icon">
                        <i class="bx bx-envelope"></i>
                    </div>
                    <h3>Email</h3>
                    <p>Respuesta en 24 horas</p>
                    <a href="mailto:soporte@tecrivera.com">soporte@tecrivera.com</a>
                    <a href="mailto:ventas@tecrivera.com">ventas@tecrivera.com</a>
                </div>

                <div class="method-card scroll-animate">
                    <div class="method-icon">
                        <i class="bx bx-phone"></i>
                    </div>
                    <h3>Teléfono</h3>
                    <p>Lun - Vie: 9:00 AM - 6:30 PM</p>
                    <a href="tel:+51985468074">+51 985 468 074</a>
                </div>

                <div class="method-card scroll-animate">
                    <div class="method-icon">
                        <i class="bx bx-time"></i>
                    </div>
                    <h3>Soporte 24/7</h3>
                    <p>Emergencias y soporte técnico</p>
                    <a href="tel:+51985468074">+51 985 468 074</a>
                    <span class="status-badge online">En línea</span>
                </div>

                <div class="method-card scroll-animate">
                    <div class="method-icon">
                        <i class="bx bx-map"></i>
                    </div>
                    <h3>Oficina Principal</h3>
                    <p>Visítanos en nuestra sede</p>
                    <address>
                        Calle Loreto 412<br />
                        Sullana, Perú
                    </address>
                </div>
            </div>
        </div>
    </section>

    <!-- Main Contact Section -->
    <section class="contact-main">
        <div class="container">
            <div class="contact-wrapper">
                <!-- Contact Info -->
                <div class="contact-info-panel">
                    <h2>Información de Contacto</h2>
                    <p class="info-description">
                        Completa el formulario y nuestro equipo se pondrá en contacto contigo lo antes posible. También puedes comunicarte directamente a través de nuestros canales.
                    </p>

                    <div class="info-items">
                        <div class="info-item scroll-animate">
                            <div class="info-icon">
                                <i class="bx bxs-phone"></i>
                            </div>
                            <div class="info-content">
                                <h4>Llámanos</h4>
                                <p>+51 985 468 074</p>
                                <span>Lun - Vie: 9 AM - 6:30 PM</span>
                            </div>
                        </div>

                        <div class="info-item scroll-animate">
                            <div class="info-icon">
                                <i class="bx bxs-envelope"></i>
                            </div>
                            <div class="info-content">
                                <h4>Escríbenos</h4>
                                <p>ventas@tecrivera.com</p>
                                <span>Respuesta en 24 horas</span>
                            </div>
                        </div>

                        <div class="info-item scroll-animate">
                            <div class="info-icon">
                                <i class="bx bxs-map"></i>
                            </div>
                            <div class="info-content">
                                <h4>Visítanos</h4>
                                <p>Calle Loreto 412</p>
                                <span>Sullana, Perú</span>
                            </div>
                        </div>

                        <div class="info-item scroll-animate">
                            <div class="info-icon">
                                <i class="bx bxs-time"></i>
                            </div>
                            <div class="info-content">
                                <h4>Horario</h4>
                                <p>Lunes - Viernes: 9:00 AM - 6:30 PM</p>
                                <span>Sábados: 9:00 AM - 6:00 PM</span>
                            </div>
                        </div>
                    </div>

                    <div class="social-connect">
                        <h4>Síguenos en Redes</h4>
                        <div class="social-icons">
                            <a href="https://www.facebook.com/multi.per.5" aria-label="Facebook">
                                <i class="bx bxl-facebook"></i>
                            </a>
                            <a href="https://www.instagram.com/tecrivera_peru" aria-label="Instagram">
                                <i class="bx bxl-instagram"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Contact Form -->
                <div class="contact-form-panel">
                    <form class="contact-form" id="contactForm">
                        <h2>Envíanos un Mensaje</h2>
                        <p class="form-subtitle">* Todos los campos marcados son obligatorios</p>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="firstName">Nombre *</label>
                                <input type="text" id="firstName" name="firstName" placeholder="Tu nombre" required />
                            </div>
                            <div class="form-group">
                                <label for="lastName">Apellido *</label>
                                <input type="text" id="lastName" name="lastName" placeholder="Tu apellido" required />
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="email">Email *</label>
                                <input type="email" id="email" name="email" placeholder="correo@ejemplo.com" required />
                            </div>
                            <div class="form-group">
                                <label for="phone">Teléfono</label>
                                <input type="tel" id="phone" name="phone" placeholder="+1 (555) 123-4567" />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="company">Empresa</label>
                            <input type="text" id="company" name="company" placeholder="Nombre de tu empresa" />
                        </div>

                        <div class="form-group">
                            <label for="service">¿En qué servicio estás interesado? *</label>
                            <select id="service" name="service" required>
                                <option value="">Selecciona un servicio</option>
                                <option value="desarrollo">Sistema de Restaurante</option>
                                <option value="outsourcing">Venta de Productos de Computo</option>
                                <option value="soporte">Soporte Técnico</option>
                                <option value="cloud">Generación de Reportes</option>
                                <option value="seguridad">Punto de Venta</option>
                                <option value="datos">Análisis de Datos</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="budget">Presupuesto Estimado</label>
                            <select id="budget" name="budget">
                                <option value="">Selecciona un rango</option>
                                <option value="5k">Menos de s/5,000</option>
                                <option value="5k-10k">s/5,000 - s/10,000</option>
                                <option value="10k-25k">s/10,000 - s/25,000</option>
                                <option value="25k-50k">s/25,000 - s/50,000</option>
                                <option value="50k+">Más de s/50,000</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="message">Mensaje *</label>
                            <textarea id="message" name="message" placeholder="Cuéntanos sobre tu proyecto o consulta..." required></textarea>
                        </div>

                        <div class="form-group checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="newsletter" />
                                <span>Quiero recibir novedades y ofertas por email</span>
                            </label>
                        </div>

                        <div class="form-group checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="terms" required />
                                <span>Acepto la política de privacidad y términos de uso *</span>
                            </label>
                        </div>

                        <button type="submit" class="btn-primary">
                            <i class="bx bx-send"></i>
                            Enviar Mensaje
                        </button>

                        <div class="form-message" id="formMessage"></div>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Map Section -->
    <section class="map-section">
        <div class="container">
            <h2 class="section-title scroll-animate">Nuestra Ubicación</h2>
            <div class="map-container scroll-animate">
                <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d496.91177440903965!2d-80.6799268055225!3d-4.890326943989411!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9035fbcc190352c1%3A0x97e1944111219a31!2sTec%20Rivera!5e0!3m2!1ses-419!2spe!4v1760107295706!5m2!1ses-419!2spe" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title scroll-animate">Preguntas Frecuentes</h2>
                <p class="section-description scroll-animate">Respuestas rápidas a las consultas más comunes</p>
            </div>
            <div class="faq-grid">
                <div class="faq-item scroll-animate">
                    <div class="faq-question">
                        <i class="bx bx-help-circle"></i>
                        <h3>¿Cuál es el tiempo de respuesta?</h3>
                    </div>
                    <p class="faq-answer">
                        Respondemos todos los mensajes en un máximo de 24 horas hábiles. Para emergencias, nuestro soporte 24/7 responde en menos de 15 minutos.
                    </p>
                </div>

                <div class="faq-item scroll-animate">
                    <div class="faq-question">
                        <i class="bx bx-help-circle"></i>
                        <h3>¿Ofrecen consultoría gratuita?</h3>
                    </div>
                    <p class="faq-answer">
                        Sí, ofrecemos una primera consultoría gratuita de 30 minutos para entender tus necesidades y proponerte la mejor solución.
                    </p>
                </div>

                <div class="faq-item scroll-animate">
                    <div class="faq-question">
                        <i class="bx bx-help-circle"></i>
                        <h3>¿Trabajan con empresas internacionales?</h3>
                    </div>
                    <p class="faq-answer">
                        Absolutamente. Tenemos experiencia trabajando con clientes en América, Europa y Asia. Nos adaptamos a diferentes zonas horarias.
                    </p>
                </div>

                <div class="faq-item scroll-animate">
                    <div class="faq-question">
                        <i class="bx bx-help-circle"></i>
                        <h3>¿Cuál es su modelo de precios?</h3>
                    </div>
                    <p class="faq-answer">
                        Ofrecemos precios flexibles según el proyecto: precio fijo, tiempo y materiales, o modelo de retainer mensual. Lo discutimos en la consultoría inicial.
                    </p>
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
              <i class="fas fa-cube"></i>
            </span>
            <span class="logo-text">TEC RIVERA</span>
          </div>
          <p class="footer-description">
            Soluciones tecnológicas integrales para empresas que buscan innovar y crecer.
          </p>
          <div class="social-links">
            <a href="https://www.facebook.com/multi.per.5" aria-label="Facebook"><i class="bx bxl-facebook"></i></a>
            <a href="https://www.instagram.com/tecrivera_peru" aria-label="Instagram"><i class="bx bxl-instagram"></i></a>
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

    <script>
        // Parallax Effect
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.page-hero::before');
            if (document.querySelector('.page-hero')) {
                document.querySelector('.page-hero').style.backgroundPosition = `center ${scrolled * 0.5}px`;
            }
        });

        // Scroll Animation
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-animate').forEach(el => {
            observer.observe(el);
        });

        // Form Handling
        const contactForm = document.getElementById('contactForm');
        const formMessage = document.getElementById('formMessage');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulate form submission
            formMessage.textContent = 'Enviando mensaje...';
            formMessage.className = 'form-message';
            
            setTimeout(() => {
                formMessage.textContent = '¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.';
                formMessage.className = 'form-message success';
                contactForm.reset();
                
                setTimeout(() => {
                    formMessage.className = 'form-message';
                }, 5000);
            }, 1500);
        });

        // Mouse parallax effect on hero
        document.querySelector('.page-hero').addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 10;
            const y = (e.clientY / window.innerHeight) * 10;
            document.querySelector('.page-hero::before').style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
        });
    </script>
    <script src="../assets/js/contacto.js"></script>
</body>
</html>