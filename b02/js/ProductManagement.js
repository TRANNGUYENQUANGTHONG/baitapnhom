

// Lấy và lưu danh sách sản phẩm 
function getProducts() {
  return JSON.parse(localStorage.getItem("products") || "[]");
}

function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

// Hiển thị danh sách sản phẩm vào bảng (dùng innerHTML)
function renderProducts(filterText = "") {
  const tbody = document.getElementById("productTableBody");
  if (!tbody) return;

  const products = getProducts();
  const keyword = filterText.trim().toLowerCase();

  let rowsHtml = "";

  products.forEach((p, index) => {
    const code = (p.code || "").toLowerCase();
    const name = (p.name || "").toLowerCase();

    // Bộ lọc tìm kiếm 
    if (keyword && !code.includes(keyword) && !name.includes(keyword)) {
      return; // Không hiển thị sản phẩm này
    }

    // Nếu có ảnh thì hiển thị, không có thì ghi "なし"
    const imgHtml = p.img
      ? `<img src="${p.img}" class="product-img" alt="${p.name || ""}">`
      : "なし";

    // thêm các phần tử trong local stogare vào bảng
    rowsHtml += `
      <tr>
        <td>${p.code || ""}</td>
        <td>${imgHtml}</td>
        <td>${p.name || ""}</td>
        <td>${p.price || ""}</td>
        <td>${p.stock || ""}</td>
        <td>
          <button class="edit-button" onclick="editProduct(${index})">
            編集
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = rowsHtml;
}

// Nút chỉnh sửa → chuyển sang Addproduct.html với index tương ứng
function editProduct(index) {
  window.location.href = `./Addproduct.html?index=${index}`;
}

// Cài đặt chức năng cho ô tìm kiếm
function setupSearch() {
  const searchInput = document.getElementById("search");
  if (!searchInput) return;

  searchInput.addEventListener("input", function () {
    renderProducts(this.value); 
  });
}

// Khởi tạo khi trang được load xong
document.addEventListener("DOMContentLoaded", () => {
  insertDefaultToLocalStorage(); 
  renderProducts();
  setupSearch();
});
