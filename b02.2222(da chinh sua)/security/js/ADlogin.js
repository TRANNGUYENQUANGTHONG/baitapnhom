// ADlogin.js

// ✅ Chỉ có 1 tài khoản cố định
const ADMIN_USER = "admin";
const ADMIN_PASS = "12346789";

const form = document.getElementById("loginForm");
const nameInput = document.getElementById("name");
const passInput = document.getElementById("password");
const msg = document.getElementById("msg");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = nameInput.value.trim();
  const password = passInput.value;

  // reset message
  msg.textContent = "";

  // check
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    // (tuỳ chọn) lưu trạng thái login để trang khác check
    localStorage.setItem("isAdminLoggedIn", "true");

    // chuyển trang
    window.location.href = "../../html/ProductManagement.html";
  } else {
    msg.textContent = "ユーザー名またはパスワードが違います。";
    passInput.value = "";
    passInput.focus();
  }
});
