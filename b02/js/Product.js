// ../js/Product.js

// ================== CART ==================
const CART_KEY = "dst_cart_v1";

// ================== PRODUCT STORAGE (giống ProductManagement) ==================
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
  // Nếu bạn có DefaultProducts.js -> biến DEFAULT_PRODUCTS tồn tại
  return typeof DEFAULT_PRODUCTS !== "undefined" ? DEFAULT_PRODUCTS : [];
}
function saveDefaultProducts(list) {
  localStorage.setItem("default_products", JSON.stringify(list));
}

// ================== HELPERS ==================
function parsePriceToNumber(v) {
  // chấp nhận: 1000, "1000", "¥1,000"
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
  const count = cart.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
  el.textContent = String(count);
}

// ================== RENDER PRODUCTS (CARD) ==================
function renderProductCards(filterText = "") {
  const listEl = document.getElementById("productList");
  if (!listEl) return;

  const defaultProducts = getDefaultProducts();
  const userProducts = getProducts();

  // Gộp như ProductManagement
  const products = [
    ...defaultProducts.map((p) => ({ ...p, __source: "default" })),
    ...userProducts.map((p, i) => ({ ...p, __source: "user", __userIndex: i })),
  ];

  const keyword = filterText.trim().toLowerCase();

  let html = "";
  products.forEach((p) => {
    const code = String(p.code || "").toLowerCase();
    const name = String(p.name || "").toLowerCase();

    if (keyword && !code.includes(keyword) && !name.includes(keyword)) return;

    const imgSrc = p.img ? p.img : "https://via.placeholder.com/200";
    const priceNum = parsePriceToNumber(p.price);
    const priceText = formatYen(priceNum);

    // data-* để biết xóa từ đâu
    html += `
      <div class="product"
           data-source="${p.__source}"
           data-code="${p.code || ""}"
           ${p.__source === "user" ? `data-user-index="${p.__userIndex}"` : ""}>
        <img src="${imgSrc}" alt="${p.name || ""}" />
        <h3>${p.name || ""}</h3>
        <p>${priceText}</p>

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
  // tùy bạn: nếu trang giỏ là cart.html thì để cart.html
  window.location.href = "cart.html";
}

function addToCart(btn) {
  const productEl = btn.closest(".product");
  if (!productEl) return;

  const name = (productEl.querySelector("h3")?.textContent || "").trim();
  const priceText = (productEl.querySelector("p")?.textContent || "").trim();
  const img = productEl.querySelector("img")?.getAttribute("src") || "";

  if (!name) return alert("商品名が見つかりません。");

  const price = parsePriceToNumber(priceText);

  const cart = loadCart();
  const exist = cart.find((x) => x.name === name);
  if (exist) exist.qty = (Number(exist.qty) || 0) + 1;
  else cart.push({ id: Date.now(), name, price, img, qty: 1 });

  saveCart(cart);
  updateCartCountUI();
}

function deleteProduct(btn) {
  const productEl = btn.closest(".product");
  if (!productEl) return;

  const name = (productEl.querySelector("h3")?.textContent || "").trim();
  if (!confirm(`「${name || "この商品"}」を削除しますか？`)) return;

  const source = productEl.dataset.source;

  if (source === "user") {
    const idx = Number(productEl.dataset.userIndex);
    const userProducts = getProducts();
    if (!Number.isNaN(idx) && idx >= 0 && idx < userProducts.length) {
      userProducts.splice(idx, 1);
      saveProducts(userProducts);
    }
  } else if (source === "default") {
    // Xóa khỏi default_products (bản đã lưu chỉnh sửa)
    const code = productEl.dataset.code || "";
    const defaults = getDefaultProducts();
    const next = defaults.filter((p) => String(p.code || "") !== String(code));
    saveDefaultProducts(next);
  }

  // Render lại để index không bị lệch
  renderProductCards(document.getElementById("searchInput")?.value || "");
}

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCountUI();
  renderProductCards();

  const input = document.getElementById("searchInput");
  if (input) {
    input.addEventListener("input", () => renderProductCards(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") searchProduct();
    });
  }
});
