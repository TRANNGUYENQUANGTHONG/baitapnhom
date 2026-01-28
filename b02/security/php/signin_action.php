<?php
require_once __DIR__ . "/config.php";

$username = trim($_POST["username"] ?? "");
$password = (string)($_POST["password"] ?? "");

function back(string $m): void {
  $_SESSION["flash_msg"] = $m;
  header("Location: ../html/UserSignin.php");
  exit;
}

if ($username === "" || $password === "") {
  back("ユーザー名またはパスワードが違います。");
}

$stmt = $pdo->prepare("SELECT id, username, password_hash FROM users WHERE username=?");
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user["password_hash"])) {
  back("ユーザー名またはパスワードが違います。");
}

$_SESSION["user_logged_in"] = true;
$_SESSION["user_id"] = (int)$user["id"];
$_SESSION["user_name"] = $user["username"];

header("Location: ../../html/Product.html");
exit;
