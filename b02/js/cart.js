// ../js/cart.js
 
const CART_KEY = "dst_cart_v1"; // phải trùng với Product.js
 
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
 
function formatYen(n) {
  return Number(n || 0).toLocaleString("ja-JP");
}
 
function calcTotal(cart) {
  return cart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || 0;
    return sum + price * qty;
  }, 0);
}
 
function updateTotalUI(cart) {
  const totalEl = document.getElementById("total");
  if (!totalEl) return;
  totalEl.textContent = formatYen(calcTotal(cart));
}
 
function renderCart() {
  const listEl = document.getElementById("list");
  if (!listEl) return;
 
  const cart = loadCart();
 
  if (cart.length === 0) {
    listEl.innerHTML = `
      <div style="padding:16px;">
        カートは空です。
      </div>
    `;
    updateTotalUI(cart);
    return;
  }
 
  listEl.innerHTML = cart
    .map((item, i) => {
      const name = item.name || "";
      const img = item.img || "https://via.placeholder.com/120";
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 1;
      const sub = price * qty;
 
      return `
        <div class="cart-item" data-index="${i}">
          <img class="cart-img" src="${img}" alt="${name}">
          <div class="cart-info">
            <div class="cart-name">${name}</div>
            <div class="cart-price">¥${formatYen(price)}</div>
 
            <div class="cart-qty">
              <button class="qty-btn" onclick="changeQty(${i}, -1)">-</button>
              <span class="qty-num">${qty}</span>
              <button class="qty-btn" onclick="changeQty(${i}, 1)">+</button>
            </div>
 
            <div class="cart-sub">小計：¥${formatYen(sub)}</div>
          </div>
 
          <button class="remove-btn" onclick="removeItem(${i})">🗑</button>
        </div>
      `;
    })
    .join("");
 
  updateTotalUI(cart);
}
 
// ===== Actions =====
function changeQty(index, delta) {
  const cart = loadCart();
  if (index < 0 || index >= cart.length) return;
 
  const current = Number(cart[index].qty) || 1;
  const next = current + delta;
 
  if (next <= 0) {
    // giảm về 0 thì xóa
    cart.splice(index, 1);
  } else {
    cart[index].qty = next;
  }
 
  saveCart(cart);
  renderCart();
}
 
function removeItem(index) {
  const cart = loadCart();
  if (index < 0 || index >= cart.length) return;
 
  if (!confirm("この商品を削除しますか？")) return;
 
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}
 
// (optional) clear cart if needed in future
function clearCart() {
  if (!confirm("カートを空にしますか？")) return;
  saveCart([]);
  renderCart();
}
 
// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});