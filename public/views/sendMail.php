<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// =====================================
// INCLUSIÓN DE PHPMailer
// =====================================
require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

// =====================================
// CONFIGURACIÓN PRINCIPAL
// =====================================
$mail = new PHPMailer(true);

try {
    // ============================
    // CONFIGURACIÓN SMTP
    // ============================
    $mail->isSMTP();
    $mail->Host = 'mail.tecrivera.com'; // servidor SMTP (puede variar según tu hosting)
    $mail->SMTPAuth = true;
    $mail->Username = 'ventas@tecrivera.com'; // tu correo
    $mail->Password = 'TU_CONTRASEÑA_DE_CORREO'; // tu contraseña real o token SMTP
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // o PHPMailer::ENCRYPTION_STARTTLS
    $mail->Port = 465; // o 587 si usas STARTTLS

    // ============================
    // DATOS DEL FORMULARIO
    // ============================
    $requiredFields = ['firstName', 'lastName', 'email', 'service', 'message'];
    foreach ($requiredFields as $field) {
        if (empty($_POST[$field])) {
            echo json_encode(["status" => "error", "message" => "Faltan campos obligatorios."]);
            exit;
        }
    }

    $nombre     = htmlspecialchars(trim($_POST['firstName']));
    $apellido   = htmlspecialchars(trim($_POST['lastName']));
    $email      = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $telefono   = htmlspecialchars(trim($_POST['phone'] ?? 'No especificado'));
    $empresa    = htmlspecialchars(trim($_POST['company'] ?? 'No especificado'));
    $servicio   = htmlspecialchars(trim($_POST['service']));
    $presupuesto= htmlspecialchars(trim($_POST['budget'] ?? 'No especificado'));
    $mensaje    = htmlspecialchars(trim($_POST['message']));
    $newsletter = isset($_POST['newsletter']) ? 'Sí' : 'No';
    $terms      = isset($_POST['terms']) ? 'Aceptados' : 'No aceptados';

    // ============================
    // CONFIGURAR DESTINATARIO
    // ============================
    $mail->setFrom('ventas@tecrivera.com', 'Formulario Web TEC RIVERA');
    $mail->addAddress('ventas@tecrivera.com', 'Ventas Tec Rivera');
    $mail->addReplyTo($email, "$nombre $apellido");

    // ============================
    // CONTENIDO DEL MENSAJE
    // ============================
    $mail->isHTML(true);
    $mail->Subject = "Nuevo mensaje desde el formulario web TEC RIVERA";
    $mail->Body = "
    <html>
    <body style='font-family: Arial, sans-serif;'>
      <h2>📩 Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> $nombre $apellido</p>
      <p><strong>Email:</strong> $email</p>
      <p><strong>Teléfono:</strong> $telefono</p>
      <p><strong>Empresa:</strong> $empresa</p>
      <p><strong>Servicio de interés:</strong> $servicio</p>
      <p><strong>Presupuesto estimado:</strong> $presupuesto</p>
      <p><strong>Mensaje:</strong><br>$mensaje</p>
      <p><strong>Suscripción a newsletter:</strong> $newsletter</p>
      <p><strong>Términos y condiciones:</strong> $terms</p>
      <hr>
      <p style='font-size: 12px; color: #777;'>Enviado desde el sitio web oficial de TEC RIVERA</p>
    </body>
    </html>
    ";

    // ============================
    // ENVÍO DEL CORREO
    // ============================
    $mail->send();
    echo json_encode(["status" => "success", "message" => "¡Mensaje enviado con éxito!"]);
} 
catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "No se pudo enviar el mensaje. Error: {$mail->ErrorInfo}"]);
}
?>
