// ================== CONSTANT ==================
const ITEMS_PER_PAGE = 5;
let currentPage = 1;

// ================== USER PRODUCTS ==================
function getUserProducts() {
  return JSON.parse(localStorage.getItem("products") || "[]");
}

// ================== DEFAULT PRODUCTS ==================
function getDefaultProducts() {
  const saved = localStorage.getItem("default_products");
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return typeof DEFAULT_PRODUCTS !== "undefined" ? DEFAULT_PRODUCTS : [];
}

// ================== ALL PRODUCTS ==================
function getAllProducts() {
  return [...getDefaultProducts(), ...getUserProducts()];
}

// ================== RENDER ==================
function renderProductDetails(filterText = "") {
  const tbody = document.getElementById("productTableBody");
  if (!tbody) return;

  const defaultProducts = getDefaultProducts();
  const userProducts = getUserProducts();
  const allProducts = [...defaultProducts, ...userProducts];

  const keyword = filterText.trim().toLowerCase();

  // 🔍 search
  const filtered = allProducts.filter(p => {
    const name = (p.name || "").toLowerCase();
    const code = (p.code || "").toLowerCase();
    return !keyword || name.includes(keyword) || code.includes(keyword);
  });

  // 📄 pagination
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);

  let html = "";

  pageItems.forEach(p => {
    const isDefault = defaultProducts.some(d => d.code === p.code);

    const imgHtml = p.img
      ? `<img src="${p.img}" class="product-img" alt="${p.name}">`
      : "なし";

    const infoHtml = `<div>${p.information || ""}</div>`;

    let statusHtml = "";
    if (!p.stock || p.stock === "0") {
      statusHtml = `<span style="color:red;">在庫なし</span>`;
    } else if (p.stock < 5) {
      statusHtml = `<span style="color:orange;">残り ${p.stock} 個</span>`;
    } else {
      statusHtml = `<span style="color:green;">在庫あり (${p.stock})</span>`;
    }

    const editBtn = isDefault
      ? `<button class="edit-button" onclick="editInfoDefaultByCode('${p.code}')">情報編集</button>`
      : `<button class="edit-button" onclick="editInfoUserByCode('${p.code}')">情報編集</button>`;

    html += `
      <tr>
        <td>${p.name}</td>
        <td>${imgHtml}</td>
        <td>${infoHtml}</td>
        <td>${p.stock || 0}</td>
        <td>${statusHtml}</td>
        <td>${editBtn}</td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  renderPagination(filtered.length, filterText);
}

// ================== PAGINATION ==================
function renderPagination(totalItems, filterText) {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;

  pagination.innerHTML = "";

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  if (totalPages <= 1) return;

  // Prev
  if (currentPage > 1) {
    const prev = document.createElement("button");
    prev.textContent = "«";
    prev.onclick = () => {
      currentPage--;
      renderProductDetails(filterText);
    };
    pagination.appendChild(prev);
  }

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.disabled = i === currentPage;

    btn.onclick = () => {
      currentPage = i;
      renderProductDetails(filterText);
    };

    pagination.appendChild(btn);
  }

  // Next
  if (currentPage < totalPages) {
    const next = document.createElement("button");
    next.textContent = "»";
    next.onclick = () => {
      currentPage++;
      renderProductDetails(filterText);
    };
    pagination.appendChild(next);
  }
}

// ================== 情報編集 ==================
function editInfoDefaultByCode(code) {
  const defaults = getDefaultProducts();
  const index = defaults.findIndex(p => p.code === code);
  if (index === -1) return;

  const p = defaults[index];
  const newInfo = prompt(`商品名：${p.name}\n\n情報を入力してください`, p.information || "");
  if (newInfo === null || !newInfo.trim()) return;

  defaults[index].information = newInfo.trim();
  localStorage.setItem("default_products", JSON.stringify(defaults));
  renderProductDetails();
}

function editInfoUserByCode(code) {
  const users = getUserProducts();
  const index = users.findIndex(p => p.code === code);
  if (index === -1) return;

  const p = users[index];
  const newInfo = prompt(`商品名：${p.name}\n\n情報を入力してください`, p.information || "");
  if (newInfo === null || !newInfo.trim()) return;

  users[index].information = newInfo.trim();
  localStorage.setItem("products", JSON.stringify(users));
  renderProductDetails();
}

// ================== SEARCH ==================
function setupSearchBox() {
  const searchInput = document.getElementById("search");
  if (!searchInput) return;

  searchInput.addEventListener("input", function () {
    currentPage = 1;
    renderProductDetails(this.value);
  });
}

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", () => {
  renderProductDetails();
  setupSearchBox();
});
