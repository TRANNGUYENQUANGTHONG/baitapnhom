<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$host = "127.0.0.1";
$user = "root";
$pass = "";
$port = 3306;

$conn = new mysqli($host, $user, $pass, "", $port);
$conn->set_charset("utf8mb4");

// TẠO DB
$conn->query("CREATE DATABASE IF NOT EXISTS b02_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");
$conn->select_db("b02_db");

// TẠO TABLE
$conn->query("
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
");

echo "OK: Created b02_db and users table";
