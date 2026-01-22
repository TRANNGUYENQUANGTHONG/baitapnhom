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
  <title>User Login</title>
  <link rel="stylesheet" href="../css/ADlogin.css">
</head>
<body>

<button class="back" onclick="window.location.href='../../html/HomePage.html'">
  ← 戻る
</button>

<div class="container">
  <h1>User Login</h1>

  <form id="loginForm" method="POST" action="../php/user_login_handler.php">
    <label for="username">Username</label>
    <input id="username" type="text" name="username" required>

    <label for="password">Password</label>
    <input id="password" type="password" name="password" required>

    <button id="login" type="submit">ログイン</button>
  </form>

  <div id="msg">
    <?php
      if ($err === 'invalid') echo 'Sai tài khoản hoặc mật khẩu';
      if ($err === 'required') echo 'Vui lòng nhập đầy đủ thông tin';
    ?>
  </div>

  <div style="margin-top:12px; text-align:center; font-weight:800;">
    <a href="./Usersignup.php" style="color:#111;">Chưa có tài khoản? Đăng kí</a>
  </div>
</div>

</body>
</html>
