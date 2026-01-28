<?php
require_once __DIR__ . "/../php/config.php";
$msg = $_SESSION["flash_msg"] ?? "";
$_SESSION["flash_msg"] = "";
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <title>ユーザーログイン</title>
  <link rel="stylesheet" href="../css/UserSignin.css" />
</head>
<body>
  <button class="back" type="button" onclick="window.location.href='../../html/HomePage.html'">
    ホームページを戻る
  </button>

  <div class="container">
    <h1>ログイン</h1>

    <form id="signinForm" action="../php/signin_action.php" method="post" novalidate>
      <label for="username">ユーザー名:</label><br />
      <input type="text" id="username" name="username" required /><br />

      <label for="password">パスワード:</label><br />
      <input type="password" id="password" name="password" required /><br />

      <button class="primary" id="loginBtn" type="submit">ログイン</button>
    </form>

      <p class="link-text">アカウントがありませんか？<a href="./UserSignup.php" class="link-btn">新規登録</a></p>

    <p id="msg"><?= htmlspecialchars($msg) ?></p>
  </div>

  <script src="../js/user_auth.js"></script>
</body>
</html>
