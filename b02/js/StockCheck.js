// ================== CONSTANT ==================
const ITEMS_PER_PAGE = 7;
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

// ================== STATUS ==================
function getStatusHtml(stockValue) {
  const stockNum = Number(stockValue);

  if (Number.isNaN(stockNum) || stockNum <= 0) {
    return `<span style="color:red;">在庫なし</span>`;
  }
  if (stockNum < 5) {
    return `<span style="color:orange;">残り ${stockNum} 個</span>`;
  }
  return `<span style="color:green;">在庫あり</span>`;
}

// ================== RENDER ==================
function renderStock(filterText = "") {
  const tbody = document.getElementById("stockTableBody");
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

    html += `
      <tr>
        <td>${p.name || ""}</td>
        <td>${p.code || ""}</td>
        <td style="text-align:center;">${p.stock ?? ""}</td>
        <td>${getStatusHtml(p.stock)}</td>
        <td>
          <button class="edit-button"
            onclick="editStockByCode('${p.code}')">
            在庫編集
          </button>
        </td>
      </tr>
    `;
  });

  if (!html) {
    html = `
      <tr>
        <td colspan="5" style="text-align:center;">
          登録された商品がありません。
        </td>
      </tr>
    `;
  }

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
    prev.className = "page-btn";
    prev.onclick = () => {
      currentPage--;
      renderStock(filterText);
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
      renderStock(filterText);
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
      renderStock(filterText);
    };
    pagination.appendChild(next);
  }
}

// ================== 在庫編集 ==================
function editStockByCode(code) {
  let products = getDefaultProducts();
  let isDefault = true;

  let index = products.findIndex(p => p.code === code);
  if (index === -1) {
    products = getUserProducts();
    isDefault = false;
    index = products.findIndex(p => p.code === code);
  }
  if (index === -1) return;

  const p = products[index];

  const input = prompt(
    `商品名：${p.name}\n在庫数を入力してください（0以上）`,
    p.stock ?? "0"
  );

  if (input === null) return;

  const stockNum = Number(input);
  if (!Number.isInteger(stockNum) || stockNum < 0) {
    alert("在庫数は 0 以上の整数で入力してください。");
    return;
  }

  products[index].stock = String(stockNum);

  if (isDefault) {
    localStorage.setItem("default_products", JSON.stringify(products));
  } else {
    localStorage.setItem("products", JSON.stringify(products));
  }

  renderStock();
}

// ================== SEARCH ==================
function setupSearch() {
  const searchInput = document.getElementById("search");
  if (!searchInput) return;

  searchInput.addEventListener("input", function () {
    currentPage = 1;
    renderStock(this.value);
  });
}

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", () => {
  renderStock();
  setupSearch();
});
