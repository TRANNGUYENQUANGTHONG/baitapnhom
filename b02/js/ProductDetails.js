// Lấy danh sách sản phẩm người dùng đã lưu
function getUserProducts() {
    return JSON.parse(localStorage.getItem("products") || "[]");
}

// Lấy default (đã sửa nếu có)
function getDefaultProducts() {
    const saved = localStorage.getItem("default_products");
    if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_PRODUCTS;
}

// Ghép default + user product
function getAllProducts() {
    const defaults = getDefaultProducts();
    const user = getUserProducts();
    return [...defaults, ...user];
}

// Hiển thị danh sách sản phẩm chi tiết
function renderProductDetails(filterText = "") {
    const tbody = document.getElementById("productTableBody");
    if (!tbody) return;

    const defaultProducts = getDefaultProducts();
    const products = getAllProducts();
    const keyword = filterText.trim().toLowerCase();

    let html = "";

    products.forEach((p, index) => {
        const name = (p.name || "").toLowerCase();
        const code = (p.code || "").toLowerCase();

        // bộ lọc tìm kiếm
        if (keyword && !name.includes(keyword) && !code.includes(keyword)) return;

        // ảnh
        const imgHtml = p.img
            ? `<img src="${p.img}" class="product-img" alt="${p.name}">`
            : "なし";

        // thông tin
        const infoHtml = `<div>${p.information || ""}</div>`;

        // trạng thái
        let statusHtml = "";
        if (!p.stock || p.stock === "0") {
            statusHtml = `<span style="color:red;">在庫なし</span>`;
        } else if (p.stock < 5) {
            statusHtml = `<span style="color:orange;">残り ${p.stock} 個</span>`;
        } else {
            statusHtml = `<span style="color:green;">在庫あり (${p.stock})</span>`;
        }

        const isDefault = index < defaultProducts.length;

        // 🔥 đổi nút thành 情報編集
        const infoEditButton = isDefault
            ? `<button class="edit-button" onclick="editInfoDefault(${index})">情報編集</button>`
            : `<button class="edit-button" onclick="editInfoUser(${index - defaultProducts.length})">情報編集</button>`;

        html += `
            <tr>
                <td>${p.name}</td>
                <td>${imgHtml}</td>
                <td>${infoHtml}</td>
                <td>${p.stock}</td>
                <td>${statusHtml}</td>
                <td>${infoEditButton}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// ================= 情報編集 =================

// default product
function editInfoDefault(defaultIndex) {
    const defaults = getDefaultProducts();
    const p = defaults[defaultIndex];
    if (!p) return;

    const newInfo = prompt(
        `商品名：${p.name}\n\n情報を入力してください（必須）`,
        p.information || ""
    );

    if (newInfo === null) return; // cancel
    if (!newInfo.trim()) {
        alert("情報は必須です。");
        return;
    }

    defaults[defaultIndex].information = newInfo.trim();
    localStorage.setItem("default_products", JSON.stringify(defaults));
    renderProductDetails();
}

// user product
function editInfoUser(userIndex) {
    const users = getUserProducts();
    const p = users[userIndex];
    if (!p) return;

    const newInfo = prompt(
        `商品名：${p.name}\n\n情報を入力してください（必須）`,
        p.information || ""
    );

    if (newInfo === null) return;
    if (!newInfo.trim()) {
        alert("情報は必須です。");
        return;
    }

    users[userIndex].information = newInfo.trim();
    localStorage.setItem("products", JSON.stringify(users));
    renderProductDetails();
}

// xử lý tìm kiếm
function setupSearchBox() {
    const searchInput = document.getElementById("search");
    if (!searchInput) return;

    searchInput.addEventListener("input", function () {
        renderProductDetails(this.value);
    });
}

// Khi trang load xong
document.addEventListener("DOMContentLoaded", () => {
    renderProductDetails();
    setupSearchBox();
});
