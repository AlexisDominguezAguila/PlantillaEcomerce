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
    $mail->Password = ''; // tu contraseña real o token SMTP
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
    $mail->Body = '
    <html><body style="font-family:Arial,sans-serif;background:#f3f4f6;padding:0;margin:0;">
      <table width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;"><tr><td align="center" style="padding:24px;">
      <table width="600" cellspacing="0" cellpadding="0" style="width:600px;max-width:600px;background:#fff;border-radius:14px;overflow:hidden;">
        <tr><td style="background:#111344;padding:20px 24px;color:#fff;">
          <div style="display:flex;align-items:center;gap:12px;">
                    <strong>TEC RIVERA</strong>
          </div>
        </td></tr>
        <tr><td style="padding:24px;">
          <h2 style="margin:0 0 8px;color:#111344;">📩 Nuevo mensaje de contacto</h2>
          <p style="margin:0 0 12px;color:#4b5563;">Desde tecrivera.com</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 8px;">
            <tr><td style="background:#f8fafc;padding:12px;border-radius:10px 0 0 10px;color:#6b7280;">Nombre</td><td style="background:#f8fafc;padding:12px;border-radius:0 10px 10px 0;color:#111827;"><strong>'.$nombre.' '.$apellido.'</strong></td></tr>
            <tr><td style="background:#f8fafc;padding:12px;border-radius:10px 0 0 10px;color:#6b7280;">Email</td><td style="background:#f8fafc;padding:12px;border-radius:0 10px 10px 0;color:#111827;">'.$email.'</td></tr>
            <tr><td style="background:#f8fafc;padding:12px;border-radius:10px 0 0 10px;color:#6b7280;">Teléfono</td><td style="background:#f8fafc;padding:12px;border-radius:0 10px 10px 0;color:#111827;">'.$telefono.'</td></tr>
            <tr><td style="background:#f8fafc;padding:12px;border-radius:10px 0 0 10px;color:#6b7280;">Empresa</td><td style="background:#f8fafc;padding:12px;border-radius:0 10px 10px 0;color:#111827;">'.$empresa.'</td></tr>
            <tr><td style="background:#f8fafc;padding:12px;border-radius:10px 0 0 10px;color:#6b7280;">Servicio</td><td style="background:#f8fafc;padding:12px;border-radius:0 10px 10px 0;color:#111827;">'.$servicio.'</td></tr>
            <tr><td style="background:#f8fafc;padding:12px;border-radius:10px 0 0 10px;color:#6b7280;">Presupuesto</td><td style="background:#f8fafc;padding:12px;border-radius:0 10px 10px 0;color:#111827;">'.$presupuesto.'</td></tr>
            <tr><td style="background:#f8fafc;padding:12px;border-radius:10px 0 0 10px;color:#6b7280;">Newsletter</td><td style="background:#f8fafc;padding:12px;border-radius:0 10px 10px 0;color:#111827;">'.$newsletter.'</td></tr>
            <tr><td style="background:#f8fafc;padding:12px;border-radius:10px 0 0 10px;color:#6b7280;">Términos</td><td style="background:#f8fafc;padding:12px;border-radius:0 10px 10px 0;color:#111827;">'.$terms.'</td></tr>
          </table>
          <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-top:12px;">
            <div style="color:#6b7280;margin-bottom:6px;">Mensaje</div>
            <div style="color:#111827;line-height:1.6;">'.$mensajeHtml.'</div>
          </div>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:18px 24px;color:#6b7280;font-size:12px;">
          Enviado desde el sitio web oficial de TEC RIVERA.
        </td></tr>
      </table>
      </td></tr></table>
    </body></html>';

    $mail->AltBody =
      "Nuevo mensaje de contacto - TEC RIVERA\n\n".
      "Nombre: {$nombre} {$apellido}\n".
      "Email: {$email}\n".
      "Teléfono: {$telefono}\n".
      "Empresa: {$empresa}\n".
      "Servicio: {$servicio}\n".
      "Presupuesto: {$presupuesto}\n".
      "Newsletter: {$newsletter}\n".
      "Términos: {$terms}\n\n".
      "Mensaje:\n{$mensajeRaw}\n";

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
