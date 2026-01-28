<?php
require_once __DIR__ . "/../php/config.php";
$msg = $_SESSION["flash_msg"] ?? "";
$_SESSION["flash_msg"] = "";
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="x-ua-compatible" content="IE=edge">
  <meta name="author" content="ke2b, DON'T STARVE TOGETHER">
  <title>ユーザー新規登録</title>

  <!-- DÙNG CSS CỦA BẠN -->
  <link rel="stylesheet" href="../css/UserSignin.css" />
</head>
<body>
  <button class="back" type="button" onclick="window.location.href='../../html/HomePage.html'">
    ホームページを戻る
  </button>

  <div class="container">
    <h1>新規登録</h1>

    <!-- CSS cần id loginForm -->
    <form id="loginForm" action="../php/signup_action.php" method="post" novalidate>
      <label for="name">ユーザー名:</label><br />
      <input type="text" id="name" name="username" required /><br />

      <label for="password">パスワード:</label><br />
      <input type="password" id="password" name="password" required /><br />

      <label for="password2">パスワード（確認）:</label><br />
      <input type="password" id="password2" name="password2" required /><br />

      <!-- CSS cần id login (dù là nút đăng ký) -->
      <button type="submit" id="login">登録</button>
    </form>

    <p class="link-text">
      もうアカウントがありますか？ <a href="./UserSignin.php">ログイン</a>
    </p>

    <p id="msg"><?= htmlspecialchars($msg) ?></p>
  </div>

  <script src="../js/UserSignup.js"></script>
</body>
</html>
