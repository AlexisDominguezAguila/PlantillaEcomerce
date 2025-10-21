<?php
session_start();
session_unset();
session_destroy();
header("Location: /plantillaecomerce/Gestor/login.php");
exit;
?>
