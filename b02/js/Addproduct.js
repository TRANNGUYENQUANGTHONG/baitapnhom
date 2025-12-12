let currentImageData = "";    // base64 của ảnh
let editIndex        = null;  // nếu != null thì đang edit sản phẩm cũ

// Lấy danh sách sản phẩm từ localStorage
function getProducts() {
    return JSON.parse(localStorage.getItem("products") || "[]");
}

// Lưu thêm dữ liệu mới vào
function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

// Khi chọn file ảnh
function setupImageInput() {
    const imageInput = document.getElementById("imageInput"); // nhập ảnh vào
    const preview    = document.getElementById("preview");    // hiển thị ảnh preview

    if (!imageInput) return;

    imageInput.addEventListener("change", function (event) {
        const file = event.target.files[0];  // ban đầu không có ảnh
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            currentImageData = e.target.result;
            preview.src      = currentImageData;
        };
        reader.readAsDataURL(file);
    });
}

// Nếu có ?index=... trên URL thì load dữ liệu để sửa
function loadEditDataIfNeeded() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("index")) return;

    editIndex = parseInt(params.get("index"), 10);
    const products = getProducts();
    const p        = products[editIndex];

    if (!p) return;

    document.getElementById("codeInput").value  = p.code;
    document.getElementById("nameInput").value  = p.name;
    document.getElementById("priceInput").value = p.price;
    document.getElementById("stockInput").value = p.stock;

    if (p.img) {
        currentImageData = p.img;
        document.getElementById("preview").src = p.img;
    }
}

// Xử lý submit form
function setupForm() {
    const form = document.getElementById("productForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const code  = document.getElementById("codeInput").value.trim();
        const name  = document.getElementById("nameInput").value.trim();
        const price = document.getElementById("priceInput").value.trim();
        const stock = document.getElementById("stockInput").value.trim();

        // XÓA LỖI CŨ
        document.getElementById("codeError").innerText  = "";
        document.getElementById("nameError").innerText  = "";
        document.getElementById("priceError").innerText = "";
        document.getElementById("stockError").innerText = "";
        document.getElementById("imgError").innerText   = "";

        document.getElementById("codeInput").classList.remove("input-error");
        document.getElementById("nameInput").classList.remove("input-error");
        document.getElementById("priceInput").classList.remove("input-error");
        document.getElementById("stockInput").classList.remove("input-error");
        document.getElementById("imageInput").classList.remove("input-error");

        let hasError   = false;
        let firstError = null;

        //未入力の場合
        // KIỂM TRA LỖI TỪNG TRƯỜNG

        // 商品コード
        if (!code) {
            document.getElementById("codeError").innerText = "商品コードを入力してください。";
            document.getElementById("codeInput").classList.add("input-error");
            if (!firstError) firstError = document.getElementById("codeInput");
            hasError = true;
        }

        // 商品名
        if (!name) {
            document.getElementById("nameError").innerText = "商品名を入力してください。";
            document.getElementById("nameInput").classList.add("input-error");
            if (!firstError) firstError = document.getElementById("nameInput");
            hasError = true;
        }

        // 価格
        if (!price) {
            document.getElementById("priceError").innerText = "価格を入力してください。";
            document.getElementById("priceInput").classList.add("input-error");
            if (!firstError) firstError = document.getElementById("priceInput");
            hasError = true;
        }

        // 在庫
        if (!stock) {
            document.getElementById("stockError").innerText = "在庫数を入力してください。";
            document.getElementById("stockInput").classList.add("input-error");
            if (!firstError) firstError = document.getElementById("stockInput");
            hasError = true;
        }

        // 画像
        if (!currentImageData) {
            document.getElementById("imgError").innerText = "画像を選択してください。";
            document.getElementById("imageInput").classList.add("input-error");
            if (!firstError) firstError = document.getElementById("imageInput");
            hasError = true;
        }

        // Nếu có lỗi → focus trường đầu tiên
        if (hasError) {
            firstError.focus();
            return;
        }

        // TẠO OBJECT SẢN PHẨM MỚI
        const products = getProducts();

        const newProduct = {
            code,
            name,
            price,
            stock,
            img: currentImageData
        };

        if (editIndex !== null) {
            products[editIndex] = newProduct; // UPDATE
        } else {
            products.push(newProduct);        // ADD
        }

        saveProducts(products);
        // thông báo thành công
        alert("商品が正常に登録されました。");
        // Quay lại trang quản lý
        window.location.href = "ProductManagement.html";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupImageInput();
    loadEditDataIfNeeded();
    setupForm();
});
