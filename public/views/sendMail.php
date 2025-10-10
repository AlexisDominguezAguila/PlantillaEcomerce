<?php
// =====================================
// CONFIGURACIÓN PRINCIPAL
// =====================================
$destinatario = "ventas@tecrivera.com"; // <-- tu correo
$asunto = "Nuevo mensaje desde el formulario de contacto TEC RIVERA";

// =====================================
// VALIDAR DATOS DEL FORMULARIO
// =====================================
$requiredFields = ['firstName', 'lastName', 'email', 'service', 'message'];
foreach ($requiredFields as $field) {
  if (empty($_POST[$field])) {
    echo json_encode(["status" => "error", "message" => "Faltan campos obligatorios."]);
    exit;
  }
}

// Sanitizar datos
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

// =====================================
// CONTENIDO DEL MENSAJE
// =====================================
$cuerpo = "
<html>
<head><title>Nuevo mensaje desde TEC RIVERA</title></head>
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
  <p style='font-size: 12px; color: #777;'>Enviado desde el formulario web de TEC RIVERA</p>
</body>
</html>
";

// =====================================
// CABECERAS DEL CORREO
// =====================================
$headers  = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: $nombre $apellido <$email>" . "\r\n";
$headers .= "Reply-To: $email" . "\r\n";

// =====================================
// ENVÍO DEL CORREO
// =====================================
if (mail($destinatario, $asunto, $cuerpo, $headers)) {
  echo json_encode(["status" => "success", "message" => "¡Mensaje enviado con éxito!"]);
} else {
  echo json_encode(["status" => "error", "message" => "No se pudo enviar el mensaje. Inténtalo nuevamente."]);
}
?>
