const CART_KEY = "dst_cart_v1";
let currentProduct = null;

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function parsePriceToNumber(text) {
  return Number(String(text).replace(/[^\d]/g, "")) || 0;
}

// ===== Hiển thị sản phẩm =====
document.addEventListener("DOMContentLoaded", () => {
  const data = localStorage.getItem("selected_product");
  if (!data) return;

  currentProduct = JSON.parse(data);

  document.getElementById("productImg").src = currentProduct.img;
  document.getElementById("productName").textContent = currentProduct.name;
  document.getElementById("productPrice").textContent = currentProduct.price;
  document.getElementById("productInfo").textContent =
    currentProduct.information || "情報がありません。";
});

// ===== Logic thêm vào cart (DÙNG CHUNG) =====
function addCurrentProductToCart() {
  if (!currentProduct) return;

  const cart = loadCart();
  const price = parsePriceToNumber(currentProduct.price);

  const exist = cart.find(p => p.name === currentProduct.name);
  if (exist) {
    exist.qty += 1;
  } else {
    cart.push({
      id: Date.now(),
      name: currentProduct.name,
      price: price,
      img: currentProduct.img,
      qty: 1
    });
  }

  saveCart(cart);
}

// ===== Add Cart =====
function addToCartFromInfo() {
  addCurrentProductToCart();
  window.location.href = "product.html";
}

// ===== 会計 =====
function goToCart() {
  addCurrentProductToCart();
  window.location.href = "cart.html";
}
