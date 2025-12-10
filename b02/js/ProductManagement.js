// ==============================
// 商品リストの取得・保存（共通）
// ==============================
function getProducts() {
    return JSON.parse(localStorage.getItem("products") || "[]");
}

function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

// ==============================
// 商品一覧をテーブルに表示（innerHTML 方式）
// ==============================
function renderProducts(filterText = "") {
    const tbody = document.getElementById("productTableBody");
    if (!tbody) return;

    const products = getProducts();
    const keyword = filterText.trim().toLowerCase();

    let rowsHtml = "";

    products.forEach((p, index) => {
        const code  = (p.code  || "").toLowerCase();
        const name  = (p.name  || "").toLowerCase();

        // 検索フィルター（コード or 商品名）
        if (keyword && !code.includes(keyword) && !name.includes(keyword)) {
            return; // この商品は表示しない
        }

        const imgHtml = p.img
            ? `<img src="${p.img}" class="product-img" alt="${p.name || ""}">`
            : "なし";

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
        `;
    });

    if (!rowsHtml) {
        rowsHtml = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    登録された商品がありません。
                </td>
            </tr>
        `;
    }

    tbody.innerHTML = rowsHtml;
}

// ==============================
// 編集ボタン → addproduct.html?index=… に遷移
// ==============================
function editProduct(index) {
    window.location.href = `/html/addproduct.html?index=${index}`;
}

// ==============================
// 検索ボックスの設定
// ==============================
function setupSearch() {
    const searchInput = document.getElementById("search");
    if (!searchInput) return;

    searchInput.addEventListener("input", function () {
        renderProducts(this.value);
    });
}

// ==============================
// ページ読み込み時の初期化
// ==============================
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();  // 初回表示
    setupSearch();     // 検索設定
});
