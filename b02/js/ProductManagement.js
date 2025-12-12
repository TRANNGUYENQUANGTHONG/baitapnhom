// USER PRODUCTS（localStorage: products）

// Lấy danh sách sản phẩm user đã lưu
function getProducts() {
  return JSON.parse(localStorage.getItem("products") || "[]");
}

// Lưu danh sách sản phẩm user
function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

// DEFAULT PRODUCTS（localStorage: default_products hoặc file DefaultProducts.js）

// Lấy danh sách sản phẩm mặc định (đã sửa nếu có)
function getDefaultProducts() {
  const saved = localStorage.getItem("default_products");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return DEFAULT_PRODUCTS;
}

// Hiển thị danh sách sản phẩm vào bảng（innerHTML方式）
function renderProducts(filterText = "") {
  const tbody = document.getElementById("productTableBody");
  if (!tbody) return;

  const defaultProducts = getDefaultProducts();
  const userProducts    = getProducts();
  const products        = [...defaultProducts, ...userProducts];

  const keyword = filterText.trim().toLowerCase();
  let rowsHtml = "";

  products.forEach((p, index) => {
    const code = (p.code || "").toLowerCase();
    const name = (p.name || "").toLowerCase();

    // 検索フィルター（コード or 商品名）
    if (keyword && !code.includes(keyword) && !name.includes(keyword)) {
      return;
    }

    // 画像があれば表示、なければ「なし」
    const imgHtml = p.img
      ? `<img src="${p.img}" class="product-img" alt="${p.name || ""}">`
      : "なし";

    const isDefault = index < defaultProducts.length;

    const editButtonHtml = isDefault
      ? `<button class="edit-button" onclick="editDefault('${p.code}')">編集</button>`
      : `<button class="edit-button" onclick="editUser(${index - defaultProducts.length})">編集</button>`;

    rowsHtml += `
      <tr>
        <td>${p.code || ""}</td>
        <td>${imgHtml}</td>
        <td>${p.name || ""}</td>
        <td>${p.price || ""}</td>
        <td>${p.stock || ""}</td>
        <td>${editButtonHtml}</td>
      </tr>
    `;
  });

  tbody.innerHTML = rowsHtml;
}

// 編集ボタン処理
function editUser(userIndex) {
  window.location.href = `./Addproduct.html?index=${userIndex}`;
}

function editDefault(code) {
  window.location.href = `./Addproduct.html?preset=${encodeURIComponent(code)}`;
}


// 検索ボックス設定
function setupSearch() {
  const searchInput = document.getElementById("search");
  if (!searchInput) return;

  searchInput.addEventListener("input", function () {
    renderProducts(this.value);
  });
}

// ページ読み込み時の初期化
//Thiết lập ban đầu khi trang được tải
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupSearch();
});
