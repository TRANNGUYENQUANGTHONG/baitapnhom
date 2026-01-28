<?php
// b02/security/php/logout.php
require_once __DIR__ . "/config.php";

// Xoá toàn bộ session
session_unset();
session_destroy();

// Quay về trang chủ
header("Location: ../../html/HomePage.html");
exit;
