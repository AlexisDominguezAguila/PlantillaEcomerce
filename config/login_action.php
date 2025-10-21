<?php
session_start();
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header("Location: login.php");
  exit;
}

$email = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');

if (empty($email) || empty($password)) {
  header("Location: login.php?error=Completa todos los campos");
  exit;
}

try {
  $db = new Database();
  $pdo = $db->connect();

  $stmt = $pdo->prepare("SELECT id, nombre, email, password_hash, rol FROM usuarios WHERE email = :email LIMIT 1");
  $stmt->execute(['email' => $email]);
  $user = $stmt->fetch();

  if ($user && password_verify($password, $user['password_hash'])) {
    $_SESSION['usuario_id'] = $user['id'];
    $_SESSION['usuario_nombre'] = $user['nombre'];
    $_SESSION['usuario_rol'] = $user['rol'];

    // Actualizar último acceso
    $pdo->prepare("UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?")->execute([$user['id']]);

    header("Location: ../Gestor/index.php");
    exit;
  } else {
    header("Location: login.php?error=Credenciales incorrectas");
    exit;
  }
} catch (PDOException $e) {
  header("Location: login.php?error=Error de conexión");
  exit;
}
