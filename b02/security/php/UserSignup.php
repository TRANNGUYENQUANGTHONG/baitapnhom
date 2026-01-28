<?php
require_once __DIR__ . "/../php/config.php";
$msg = $_SESSION["flash_msg"] ?? "";
$_SESSION["flash_msg"] = "";
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <title>User Signup</title>
  <link rel="stylesheet" href="../css/UserSignup.css">
</head>
<body>
  <button class="back" type="button" onclick="window.location.href='../../html/HomePage.html'">
    ホームページを戻る
  </button>

  <div class="container">
    <h1>新規登録</h1>

    <form id="signupForm" action="../php/signup_action.php" method="post" novalidate>
      <label>ユーザー名:</label><br />
      <input type="text" id="username" name="username" required /><br />

      <label>パスワード:</label><br />
      <input type="password" id="password" name="password" required /><br />

      <label>パスワード（確認）:</label><br />
      <input type="password" id="password2" name="password2" required /><br />

      <button type="submit" class="primary">登録</button>
    </form>

    <p class="link">
      もうアカウントがありますか？ <a href="./UserSignin.php">ログイン</a>
    </p>

    <p id="msg"><?= htmlspecialchars($msg) ?></p>
  </div>

  <script src="../js/UserSignup.js"></script>
</body>
</html>
