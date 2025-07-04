const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

// [GET] /
module.exports.index = async (req, res) => {
  // Lay ra san pham noi bat
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active"
  }).limit(6);

  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);
  // End Lay ra san pham noi bat

  // Hien thi danh sach san pham moi nhat
  const productsNew = await Product.find({
    deleted: false,
    status: "active"
  }).sort({ position: "desc" }).limit(6);

  const newProductsNew = productsHelper.priceNewProducts(productsNew);
  // End Hien thi danh sach san pham moi nhat

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew
  });
};
