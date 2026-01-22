<?php
session_start();

if (isset($_SESSION['user'])) {
  header("Location: ../../html/Product.php");
  exit();
}

$err = $_GET['err'] ?? '';
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>User Sign Up</title>
  <link rel="stylesheet" href="../css/ADlogin.css">
</head>
<body>

<button class="back" onclick="window.location.href='./Userlogin.php'">
  ← 戻る
</button>

<div class="container">
  <h1>User Sign Up</h1>

  <form id="loginForm" method="POST" action="../php/user_signup_handler.php">
    <label for="su_username">Username</label>
    <input id="su_username" type="text" name="username" required>

    <label for="su_password">Password</label>
    <input id="su_password" type="password" name="password" required>

    <label for="su_confirm">Confirm Password</label>
    <input id="su_confirm" type="password" name="confirm_password" required>

    <button id="login" type="submit">登録</button>
  </form>

  <div id="msg">
    <?php
      if ($err === 'required') echo 'Vui lòng nhập đầy đủ thông tin';
      if ($err === 'mismatch') echo 'Mật khẩu xác nhận không khớp';
      if ($err === 'exists') echo 'Username đã tồn tại (demo)';
    ?>
  </div>

  <div style="margin-top:12px; text-align:center; font-weight:800;">
    <a href="./Userlogin.php" style="color:#111;">Đã có tài khoản? Đăng nhập</a>
  </div>
</div>

</body>
</html>
