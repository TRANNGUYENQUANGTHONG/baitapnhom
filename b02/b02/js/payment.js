// /b02/js/payment.js

const CART_KEY = "dst_cart_v1";
const ORDER_KEY = "dst_orders_v1"; // lưu lịch sử đơn hàng (optional)

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

// ===== Popup =====
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
  if (!popup) return;
  popup.classList.add("hidden");

  // (tuỳ chọn) về lại trang sản phẩm sau khi đóng
  // window.location.href = "Product.html";
}

// ===== Payment mapping =====
function getPayMeta(method) {
  // map method -> image + label
  const map = {
    "CHUNGPAY": { img: "/b02/img/pay1.jpg", label: "CHUNGPAY" },
    "NHANPAY": { img: "/b02/img/pay2.jpg", label: "NHANPAY" },
    "HUNGカード": { img: "/b02/img/pay3.jpg", label: "HUNGカード" },
    "NGHIAクレジット": { img: "/b02/img/pay4.jpg", label: "NGHIAクレジット" },
    "THONG現金": { img: "/b02/img/pay5.jpg", label: "THONG現金" },
  };
  return map[method] || { img: "", label: method };
}

// ===== Called by HTML onclick pay('...') =====
function pay(method) {
  const cart = loadCart();

  if (!cart.length) {
    openPopup("", "カートが空です。先に商品を追加してください。");
    return;
  }

  const total = calcTotal(cart);
  const meta = getPayMeta(method);

  // Save order history (optional)
  const orders = loadOrders();
  orders.push({
    id: Date.now(),
    method: meta.label,
    total,
    items: cart,
    createdAt: new Date().toISOString(),
  });
  saveOrders(orders);

  // Clear cart after successful payment
  saveCart([]);

  // Show popup thank you
  openPopup(
    meta.img,
    `ありがとうございます！\n${meta.label} でお支払いが完了しました。\n合計：${formatYen(total)}`
  );
}

// expose closePopup/pay to global (để onclick gọi được)
window.pay = pay;
window.closePopup = closePopup;

// ESC key closes popup
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePopup();
});

// click outside popup-box closes popup
document.addEventListener("click", (e) => {
  const popup = document.getElementById("thankyou-popup");
  const box = document.querySelector(".popup-box");
  if (!popup || popup.classList.contains("hidden")) return;

  // nếu click đúng nền popup (ngoài box) thì đóng
  if (e.target === popup) closePopup();
});
