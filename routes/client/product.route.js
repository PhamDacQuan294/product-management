const express = require("express")
const router = express.Router();

router.get("/", (req, res) => {
  res.render("client/pages/products/index");
});

module.exports = router;

/*
  Bên index.route.js thì app.use("/products", productRoutes); cái này để /products rồi
  thì bên này ta không để là router.get("/products") được vì nó sẽ nối chuỗi
  /products/products sai để "/" thôi sau này /products/edit ok
*/