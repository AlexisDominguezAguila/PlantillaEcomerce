<?php
// ========================================
// PANEL PRINCIPAL - TEC RIVERA
// ========================================
require_once __DIR__ . '/../config/auth.php';   
require_once __DIR__ . '/../config/db.php';  

// Instancia de conexión 
$db = new Database();
$pdo = $db->connect();

// Recuperar usuario activo
$user = null;
if (isset($_SESSION['usuario_id'])) {
    $stmt = $pdo->prepare("SELECT nombre, email, rol FROM usuarios WHERE id = ?");
    $stmt->execute([$_SESSION['usuario_id']]);
    $user = $stmt->fetch();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Panel Principal | TEC RIVERA</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        :root{
            --glass: rgba(255,255,255,0.06);
            --accent1: #4f46e5;
            --accent2: #06b6d4;
            --card-border: rgba(255,255,255,0.08);
        }
        *{box-sizing:border-box}
        body{
            font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
            margin:0;
            min-height:100vh;
            background: radial-gradient(1200px 600px at 10% 20%, rgba(79,70,229,0.12), transparent 8%),
                        radial-gradient(1000px 500px at 90% 80%, rgba(6,182,212,0.10), transparent 10%),
                        linear-gradient(180deg, #0b1020 0%, #071022 100%);
            color: #E6EEF8;
            padding: 40px 20px;
        }
        header {
            display:flex;
            justify-content:space-between;
            align-items:center;
            max-width:1100px;
            margin:0 auto 40px;
        }
        header h1 {
            font-size:22px;
            margin:0;
            font-weight:600;
        }
        header a.logout {
            color:#9fb6d6;
            text-decoration:none;
            font-weight:500;
            font-size:14px;
            display:flex;
            align-items:center;
            gap:6px;
        }
        header a.logout:hover {
            color:#fff;
        }
        .panel {
            max-width:1100px;
            margin: 0 auto;
            display:flex;
            gap:28px;
            align-items:center;
            justify-content:center;
            flex-wrap:wrap;
        }
        .module-card{
            background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
            border: 1px solid var(--card-border);
            border-radius: 14px;
            padding: 26px;
            width: 360px;
            box-shadow: 0 8px 30px rgba(2,6,23,0.7), inset 0 1px 0 rgba(255,255,255,0.02);
            transition: transform .25s ease, box-shadow .25s ease;
            backdrop-filter: blur(6px) saturate(120%);
        }
        .module-card:hover{
            transform: translateY(-8px) scale(1.01);
            box-shadow: 0 18px 50px rgba(2,6,23,0.8);
        }
        .module-head{
            display:flex;
            gap:16px;
            align-items:center;
            margin-bottom:14px;
        }
        .icon-wrap{
            width:64px;
            height:64px;
            border-radius:12px;
            display:flex;
            align-items:center;
            justify-content:center;
            color:white;
            font-size:28px;
            background: linear-gradient(135deg, var(--accent1), var(--accent2));
            box-shadow: 0 6px 18px rgba(79,70,229,0.18);
        }
        .module-title{
            font-weight:700;
            font-size:20px;
            margin:0;
            color:#F8FAFF;
        }
        .module-sub{
            margin:0;
            color: #bcd6ee;
            font-size:14px;
        }
        .module-desc{
            color:#9fb6d6;
            font-size:14px;
            margin:16px 0 22px 0;
        }
        .btn-cta{
            width:100%;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            gap:10px;
            font-weight:600;
            padding:10px 14px;
            border-radius:10px;
        }
        .footer-note{
            text-align:center;
            width:100%;
            margin-top:18px;
            color:#7ea3c8;
            font-size:13px;
        }
        @media (max-width:780px){
            .panel{gap:18px;padding:0 6px}
            .module-card{width:100%}
        }
    </style>
</head>
<body>
    <header>
        <h1>Bienvenido, <?= htmlspecialchars($user['nombre'] ?? 'Usuario'); ?></h1>
        <a href="../config/logout.php" class="logout">
            <i class="bi bi-box-arrow-right"></i> Cerrar sesión
        </a>
    </header>

    <div class="panel">
        <div class="module-card">
            <div class="module-head">
                <div class="icon-wrap" >
                    <i class="bi bi-gear-fill"></i>
                </div>
                <div>
                    <h3 class="module-title">Pagina Web</h3>
                    <p class="module-sub">Gestión de contenido</p>
                </div>
            </div>

            <p class="module-desc">
                Administra el contenido de la pagina web tecrivera.com
            </p>

            <a href="Admin/views/tenants.php" class="btn btn-outline-light btn-cta" style="border-width:1.5px;">
                <i class="bi bi-arrow-right-short"></i> Administrar Contenido
            </a>
        </div>

        <div class="module-card">
            <div class="module-head">
                <div class="icon-wrap">
                    <i class="bi bi-layout-wtf"></i>
                </div>
                <div>
                    <h3 class="module-title">Landings</h3>
                    <p class="module-sub">Creador y administración de landings</p>
                </div>
            </div>

            <p class="module-desc">
                Diseña, publica y administra tus landings con plantillas.
            </p>

            <a href="https://tenantstec.tecrivera.com/" class="btn btn-outline-light btn-cta">
                <i class="bi bi-arrow-right-short"></i> Ir a Landings
            </a>
        </div>

        <div class="module-card">
            <div class="module-head">
                <div class="icon-wrap" >
                    <i class="bi bi-people-fill"></i>
                </div>
                <div>
                    <h3 class="module-title">Tenants</h3>
                    <p class="module-sub">Gestión de alquiler de servicios</p>
                </div>
            </div>

            <p class="module-desc">
                Administra tenants, usuarios y configuraciones por cliente. 
            </p>

            <a href="https://tenantstec.tecrivera.com/" class="btn btn-outline-light btn-cta" style="border-width:1.5px;">
                <i class="bi bi-arrow-right-short"></i> Ir a Tenants
            </a>
        </div>

        <div class="footer-note">
            Panel central 
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
