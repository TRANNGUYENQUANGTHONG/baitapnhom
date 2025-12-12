// Các sản phẩm mặc định
const DEFAULT_PRODUCTS = [
  {
    code: "A001",
    name: "和牛ステーキ",
    price: "2500",
    stock: "5",
    img: "../img/beef.png"     
  },
  {
    code: "A002",
    name: "唐揚げ弁当",
    price: "800",
    stock: "12",
    img: "../img/karaage.jpg"
  },
  {
    code: "A003",
    name: "サーモン寿司セット",
    price: "1500",
    stock: "8",
    img: "../img/sushi.jpg"
  }
];

// Thêm default vào ĐẦU mảng trong localStorage nếu chưa có
function insertDefaultToLocalStorage() {
  let products = JSON.parse(localStorage.getItem("products") || "[]");

  // Nếu chưa từng chèn default (vd: check theo code A001)
  const hasDefault = products.some(p => p.code === DEFAULT_PRODUCTS[0].code);

  if (!hasDefault) {
    products = [...DEFAULT_PRODUCTS, ...products];
    localStorage.setItem("products", JSON.stringify(products));
  }
}