<?php
// security/php/config.php
declare(strict_types=1);

$DB_HOST = "localhost";
$DB_NAME = "dst_shop";
$DB_USER = "root";
$DB_PASS = ""; // XAMPP mặc định không có mật khẩu

try {
    $pdo = new PDO(
        "mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4",
        $DB_USER,
        $DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    exit("Database connection failed.");
}

// Khởi động session
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
