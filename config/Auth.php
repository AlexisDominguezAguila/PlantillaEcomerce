<?php
session_start();
if (!isset($_SESSION['usuario_id'])) {
  header("Location: /plantillaecomerce/Gestor/login.php");
  exit;
}
?>

