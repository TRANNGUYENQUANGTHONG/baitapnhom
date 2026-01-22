// ../js/Product.js

// ================== CART ==================
const CART_KEY = "dst_cart_v1";

// ================== PRODUCT STORAGE ==================
function getProducts() {
  return JSON.parse(localStorage.getItem("products") || "[]");
}
function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

function getDefaultProducts() {
  const saved = localStorage.getItem("default_products");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return typeof DEFAULT_PRODUCTS !== "undefined" ? DEFAULT_PRODUCTS : [];
}
function saveDefaultProducts(list) {
  localStorage.setItem("default_products", JSON.stringify(list));
}

// ================== HELPERS ==================
function parsePriceToNumber(v) {
  const n = String(v ?? "").replace(/[^\d]/g, "");
  return n ? Number(n) : 0;
}
function formatYen(num) {
  return "¥" + Number(num || 0).toLocaleString("ja-JP");
}

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

function updateCartCountUI() {
  const el = document.getElementById("cartCount");
  if (!el) return;
  const cart = loadCart();
  const count = cart.reduce((s, it) => s + (Number(it.qty) || 0), 0);
  el.textContent = String(count);
}

// ================== RENDER PRODUCTS ==================
function renderProductCards(filterText = "") {
  const listEl = document.getElementById("productList");
  if (!listEl) return;

  const defaultProducts = getDefaultProducts();
  const userProducts = getProducts();

  const products = [
    ...defaultProducts.map(p => ({ ...p, __source: "default" })),
    ...userProducts.map((p, i) => ({ ...p, __source: "user", __userIndex: i }))
  ];

  const keyword = filterText.trim().toLowerCase();
  let html = "";

  products.forEach(p => {
    const code = String(p.code || "").toLowerCase();
    const name = String(p.name || "").toLowerCase();

    if (keyword && !code.includes(keyword) && !name.includes(keyword)) return;

    const imgSrc = p.img || "https://via.placeholder.com/200";
    const priceNum = parsePriceToNumber(p.price);

    html += `
      <div class="product" data-code="${p.code || ""}">
        <img src="${imgSrc}" alt="${p.name || ""}">
        <h3>${p.name || ""}</h3>
        <p>${formatYen(priceNum)}</p>

        <div class="button-row">
          <button class="delete-btn" onclick="deleteProduct(this)">🗑</button>
          <button onclick="addToCart(this)">Add to Cart</button>
        </div>
      </div>
    `;
  });

  listEl.innerHTML = html || `<p style="padding:16px;">商品がありません。</p>`;
}

// ================== ACTIONS ==================
function searchProduct() {
  const keyword = document.getElementById("searchInput")?.value || "";
  renderProductCards(keyword);
}

function goToCart() {
  window.location.href = "cart.html";
}

function addToCart(btn) {
  const productEl = btn.closest(".product");
  if (!productEl) return;

  const name = productEl.querySelector("h3")?.textContent.trim();
  const priceText = productEl.querySelector("p")?.textContent || "";
  const img = productEl.querySelector("img")?.src || "";

  if (!name) return alert("商品名が見つかりません。");

  const price = parsePriceToNumber(priceText);
  const cart = loadCart();
  const exist = cart.find(it => it.name === name);

  if (exist) {
    exist.qty += 1;
  } else {
    cart.push({
      id: Date.now(),
      name,
      price,
      img,
      qty: 1
    });
  }

  saveCart(cart);
  updateCartCountUI();
}

function deleteProduct(btn) {
  const productEl = btn.closest(".product");
  if (!productEl) return;

  const name = productEl.querySelector("h3")?.textContent.trim();
  if (!name) return;

  let cart = loadCart();
  const index = cart.findIndex(it => it.name === name);

  if (index === -1) {
    alert("商品はカートに入っていません。");
    return;
  }

  cart[index].qty -= 1;

  // ✅ qty = 0 → xóa khỏi cart
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  updateCartCountUI();
}

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCountUI();
  renderProductCards();

  const input = document.getElementById("searchInput");
  if (input) {
    input.addEventListener("input", () => renderProductCards(input.value));
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") searchProduct();
    });
  }
});
