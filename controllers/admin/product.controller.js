const Product = require("../../models/product.model");

const systemConfig = require("../../config/system");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false
  };

  if(req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelper(req.query);

  if(objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Pagination
  const countProducts = await Product.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 2
    },
    req.query,
    countProducts
  );
  // End Pagination
  
  const products = await Product.find(find)
    .sort({ position: "desc" })
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.render("admin/pages/products/index", {
    pageTitle: "Danh sach san pham",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  const redirectUrl = req.query.redirect;

  await Product.updateOne({ _id: id }, { status: status });
  
  req.flash("success", "Cap nhat trang thai thanh cong!");
  
  if (redirectUrl) {
    return res.redirect(redirectUrl);
  }

  res.redirect("/admin/products");
}

// [PATCH] /admin/products//change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  const redirectUrl = req.query.redirect;

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash("success", `Cap nhat trang thai thanh cong ${ids.length} san pham!`);
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash("success", `Cap nhat trang thai thanh cong ${ids.length} san pham!`);
      break;
    case "delete-all":
      await Product.updateMany({ _id: { $in: ids } }, {
        deleted: true,
        deletedAt: new Date()
      });
      req.flash("success", `Da xoa thanh cong ${ids.length} san pham!`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id }, {
          position: position
        });
        req.flash("success", `Da doi vi tri thanh cong ${ids.length} san pham!`);
      }
      break;
    default:
      break;
  }

  if (redirectUrl) {
    return res.redirect(redirectUrl);
  }

  res.redirect("/admin/products");
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  const redirectUrl = req.query.redirect;

  // await Product.deleteOne({ _id: id});
  await Product.updateOne({ _id: id}, { 
    deleted: true,
    deletedAt: new Date()
  });

  req.flash("success", `Da xoa thanh cong san pham!`);

  if (redirectUrl) {
    return res.redirect(redirectUrl);
  }
  
  res.redirect("/admin/products");
}


// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Them moi san pham"
  });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if(req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  if(req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  const product = new Product(req.body);
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
}
