<?php
require_once __DIR__ . "/config.php";

$username  = trim($_POST["username"] ?? "");
$password  = (string)($_POST["password"] ?? "");
$password2 = (string)($_POST["password2"] ?? "");

function back(string $m): void {
  $_SESSION["flash_msg"] = $m;
  header("Location: ../html/UserSignup.php");
  exit;
}

if ($username === "") back("ユーザー名を入力してください。");
if ($password === "") back("パスワードを入力してください。");
if (strlen($password) < 6) back("パスワードは6文字以上にしてください。");
if ($password !== $password2) back("パスワードが一致しません。");

$stmt = $pdo->prepare("SELECT id FROM users WHERE username=?");
$stmt->execute([$username]);
if ($stmt->fetch()) back("ユーザー名は既に存在します。");

$hash = password_hash($password, PASSWORD_DEFAULT);

$ins = $pdo->prepare("INSERT INTO users(username, password_hash) VALUES(?, ?)");
$ins->execute([$username, $hash]);

$_SESSION["flash_msg"] = "登録成功！ログインしてください。";
header("Location: ../html/UserSignin.php");
exit;
