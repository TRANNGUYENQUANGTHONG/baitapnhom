// /b02/js/payment.js

const CART_KEY = "dst_cart_v1";
const ORDER_KEY = "dst_orders_v1";
const HOME_URL = "Product.html"; // trang chủ

/* ======================
   CART & ORDER
====================== */
function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function calcTotal(cart) {
  return cart.reduce((sum, it) => {
    const price = Number(it.price) || 0;
    const qty = Number(it.qty) || 0;
    return sum + price * qty;
  }, 0);
}

function formatYen(n) {
  return "¥" + Number(n || 0).toLocaleString("ja-JP");
}

function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDER_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
}

/* ======================
   THANK YOU POPUP
====================== */
function openPopup(imgSrc, message) {
  const popup = document.getElementById("thankyou-popup");
  const img = document.getElementById("thankyou-img");
  const text = document.getElementById("thankyou-text");

  if (!popup || !img || !text) return;

  img.src = imgSrc || "";
  img.style.display = imgSrc ? "block" : "none";
  text.textContent = message || "";

  popup.classList.remove("hidden");
}

function closePopup() {
  const popup = document.getElementById("thankyou-popup");
  if (popup) popup.classList.add("hidden");
  window.location.href = HOME_URL;
}

/* ======================
   PAYMENT META
====================== */
function getPayMeta(method) {
  const map = {
    "CHUNGPAY": { img: "/b02/img/pay1.jpg", label: "CHUNGPAY" },
    "NHANPAY": { img: "/b02/img/pay2.jpg", label: "NHANPAY" },
    "HUNGカード": { img: "/b02/img/pay3.jpg", label: "HUNGカード" },
    "NGHIAクレジット": { img: "/b02/img/pay4.jpg", label: "NGHIAクレジット" },
    "THONG現金": { img: "/b02/img/pay5.jpg", label: "THONG現金" },
  };
  return map[method] || { img: "", label: method };
}
/* ======================
   PAYMENT + CONFIRM
====================== */
let selectedMethod = "";
function payConfirm(method) {
  const cart = loadCart();

  // cart rỗng
  if (!cart.length) {
    openPopup("", "カートが空です。先に商品を追加してください。");
    return;
  }
  selectedMethod = method;

  const total = calcTotal(cart);
  const meta = getPayMeta(method);

  // hiển thị nội dung xác nhận
  const text = document.getElementById("confirm-text");
  if (text) {
    text.textContent =
      `以下の内容でお支払いしますか？\n\n` +
      `支払い方法：${meta.label}\n` +
      `合計金額：${formatYen(total)}`;
  }

  // mở popup xác nhận
  document.getElementById("confirm-popup").classList.remove("hidden");
}

function confirmPay() {
  document.getElementById("confirm-popup").classList.add("hidden");

  const cart = loadCart();
  if (!cart.length) return;

  const total = calcTotal(cart);
  const meta = getPayMeta(selectedMethod);

  // lưu order
  const orders = loadOrders();
  orders.push({
    id: Date.now(),
    method: meta.label,
    total,
    items: cart,
    createdAt: new Date().toISOString(),
  });
  saveOrders(orders);

  // clear cart
  saveCart([]);
  // popup cảm ơn
  openPopup(
    meta.img,
    `ありがとうございます。\nお支払いが完了しました。`
  );
}
function closeConfirm() {
  document.getElementById("confirm-popup").classList.add("hidden");
}
