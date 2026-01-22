<?php
session_start();

$username = trim($_POST['username'] ?? '');
$password = trim($_POST['password'] ?? '');

if ($username === '' || $password === '') {
  header("Location: ../html/Userlogin.php?err=required");
  exit();
}

/*
  DEMO: tài khoản mẫu
  - username: user
  - password: 123
  (Sau này bạn thay bằng DB)
*/
if ($username === 'user' && $password === '123') {
  $_SESSION['user'] = $username;
  header("Location: ../../html/Product.php");
  exit();
}

header("Location: ../html/Userlogin.php?err=invalid");
exit();
