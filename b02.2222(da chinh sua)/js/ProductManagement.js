// ================== CONSTANT ==================
const ITEMS_PER_PAGE = 5;
let currentPage = 1;

// ================== USER PRODUCTS ==================
// localStorage: products

function getProducts() {
  return JSON.parse(localStorage.getItem("products") || "[]");
}

function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

// ================== DEFAULT PRODUCTS ==================
// localStorage: default_products / DefaultProducts.js

function getDefaultProducts() {
  const saved = localStorage.getItem("default_products");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return typeof DEFAULT_PRODUCTS !== "undefined" ? DEFAULT_PRODUCTS : [];
}

// ================== RENDER PRODUCTS ==================
function renderProducts(filterText = "") {
  const tbody = document.getElementById("productTableBody");
  if (!tbody) return;

  const defaultProducts = getDefaultProducts();
  const userProducts = getProducts();
  const allProducts = [...defaultProducts, ...userProducts];

  const keyword = filterText.trim().toLowerCase();

  // 🔍 SEARCH FILTER
  const filteredProducts = allProducts.filter(p => {
    const code = (p.code || "").toLowerCase();
    const name = (p.name || "").toLowerCase();
    return !keyword || code.includes(keyword) || name.includes(keyword);
  });

  // 📄 PAGINATION
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filteredProducts.slice(start, start + ITEMS_PER_PAGE);

  let rowsHtml = "";

  pageItems.forEach(p => {
    const isDefault = defaultProducts.some(d => d.code === p.code);

    const imgHtml = p.img
      ? `<img src="${p.img}" class="product-img" alt="${p.name || ""}">`
      : "なし";

    const editButtonHtml = isDefault
      ? `<button class="edit-button" onclick="editDefault('${p.code}')">編集</button>`
      : `<button class="edit-button" onclick="editUser(${userProducts.findIndex(u => u.code === p.code)})">編集</button>`;

    rowsHtml += `
      <tr>
        <td>${p.code || ""}</td>
        <td>${imgHtml}</td>
        <td>${p.name || ""}</td>
        <td>${p.price || ""}</td>
        <td>${editButtonHtml}</td>
      </tr>
    `;
  });

  tbody.innerHTML = rowsHtml;

  renderPagination(filteredProducts.length, filterText);
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
    prev.className = "page-btn";
    prev.onclick = () => {
      currentPage--;
      renderProducts(filterText);
    };
    pagination.appendChild(prev);
  }

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "page-btn";

    if (i === currentPage) {
      btn.classList.add("active");
      btn.disabled = true;
    }

    btn.onclick = () => {
      currentPage = i;
      renderProducts(filterText);
    };

    pagination.appendChild(btn);
  }

  // Next
  if (currentPage < totalPages) {
    const next = document.createElement("button");
    next.textContent = "»";
    next.className = "page-btn";
    next.onclick = () => {
      currentPage++;
      renderProducts(filterText);
    };
    pagination.appendChild(next);
  }
}

// ================== EDIT ==================
function editUser(index) {
  window.location.href = `./Addproduct.html?index=${index}`;
}

function editDefault(code) {
  window.location.href = `./Addproduct.html?preset=${encodeURIComponent(code)}`;
}

// ================== SEARCH ==================
function setupSearch() {
  const searchInput = document.getElementById("search");
  if (!searchInput) return;

  searchInput.addEventListener("input", function () {
    currentPage = 1;
    renderProducts(this.value);
  });
}

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupSearch();
});
