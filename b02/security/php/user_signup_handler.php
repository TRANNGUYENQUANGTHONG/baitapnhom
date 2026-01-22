<?php
session_start();

$username = trim($_POST['username'] ?? '');
$password = trim($_POST['password'] ?? '');
$confirm  = trim($_POST['confirm_password'] ?? '');

if ($username === '' || $password === '' || $confirm === '') {
  header("Location: ../html/Usersignup.php?err=required");
  exit();
}

if ($password !== $confirm) {
  header("Location: ../html/Usersignup.php?err=mismatch");
  exit();
}

/*
  DEMO: chưa có DB nên không lưu thật.
  Nếu muốn chặn username "user" (trùng tài khoản demo):
*/
if ($username === 'user') {
  header("Location: ../html/Usersignup.php?err=exists");
  exit();
}

// đăng kí xong -> login luôn
$_SESSION['user'] = $username;
header("Location: ../../html/Product.php");
exit();
