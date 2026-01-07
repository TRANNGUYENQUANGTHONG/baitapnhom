// Lấy danh sách sản phẩm user đã lưu
function getUserProducts() {
  return JSON.parse(localStorage.getItem("products") || "[]");
}

// Lấy default đã sửa (nếu có) hoặc default gốc
function getDefaultProducts() {
  const saved = localStorage.getItem("default_products");
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return DEFAULT_PRODUCTS;
}

// Ghép default + user
function getAllProducts() {
  return [...getDefaultProducts(), ...getUserProducts()];
}

// Tạo trạng thái từ stock
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

// Hiển thị bảng 在庫
function renderStock(filterText = "") {
  const tbody = document.getElementById("stockTableBody");
  if (!tbody) return;

  const defaultProducts = getDefaultProducts();
  const userProducts = getUserProducts();
  const products = [...defaultProducts, ...userProducts];
  const keyword = filterText.trim().toLowerCase();

  let html = "";

  products.forEach((p, index) => {
    const name = (p.name || "").toLowerCase();
    const code = (p.code || "").toLowerCase();

    // 検索フィルター
    if (keyword && !name.includes(keyword) && !code.includes(keyword)) return;

    const isDefault = index < defaultProducts.length;

    html += `
      <tr>
        <td>${p.name || ""}</td>
        <td>${p.code || ""}</td>
        <td style="text-align:center;">${p.stock ?? ""}</td>
        <td>${getStatusHtml(p.stock)}</td>
        <td>
          <button class="edit-button"
            onclick="editStock(${isDefault}, ${isDefault ? index : index - defaultProducts.length})">
            在庫編集
          </button>
        </td>
      </tr>
    `;
  });

  if (!html) {
    html = `
      <tr>
        <td colspan="5" style="text-align:center;">登録された商品がありません。</td>
      </tr>
    `;
  }

  tbody.innerHTML = html;
}

// ================= 在庫編集 =================
function editStock(isDefault, index) {
  let products;

  if (isDefault) {
    products = getDefaultProducts();
  } else {
    products = getUserProducts();
  }

  const p = products[index];
  if (!p) return;

  const input = prompt(
    `商品名：${p.name}\n在庫数を入力してください（0以上）`,
    p.stock ?? "0"
  );

  if (input === null) return; // cancel

  const stockNum = Number(input);
  if (!Number.isInteger(stockNum) || stockNum < 0) {
    alert("在庫数は 0 以上の整数で入力してください。");
    return;
  }

  products[index].stock = String(stockNum);

  // 保存
  if (isDefault) {
    localStorage.setItem("default_products", JSON.stringify(products));
  } else {
    localStorage.setItem("products", JSON.stringify(products));
  }

  renderStock();
}

// Search
function setupSearch() {
  const searchInput = document.getElementById("search");
  if (!searchInput) return;

  searchInput.addEventListener("input", function () {
    renderStock(this.value);
  });
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  renderStock();
  setupSearch();
});
