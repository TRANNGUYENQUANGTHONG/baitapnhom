<?php
// b02/security/html/UserSignin.php
require_once __DIR__ . "/../php/config.php";

// flash message
$msg = $_SESSION["flash_msg"] ?? "";
$_SESSION["flash_msg"] = "";
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="x-ua-compatible" content="IE=edge">
  <meta name="author" content="ke2b, DON'T STARVE TOGETHER">
  <title>ユーザーログイン</title>

  <link rel="stylesheet" href="../css/ADlogin.css" />
</head>
<body>
  <button class="back" type="button" onclick="window.location.href='../../html/HomePage.html'">
    ホームページを戻る
  </button>

  <div class="container">
    <h1>ログイン</h1>

    <form id="signinForm" action="../php/signin_action.php" method="post">
      <label for="name">ユーザー名:</label><br />
      <input type="text" id="name" name="username" required /><br />

      <label for="password">パスワード:</label><br />
      <input type="password" id="password" name="password" required /><br />

      <button type="submit" id="signin">ログイン</button>
    </form>

    <p style="margin-top:10px;">
      アカウントがありませんか？
      <a href="./UserSignup.php">新規登録</a>
    </p>

    <p id="msg"><?= htmlspecialchars($msg) ?></p>
  </div>
</body>
</html>
