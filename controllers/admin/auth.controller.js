const md5 = require("md5");
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
  res.render("admin/pages/auth/login", {
    pageTitle: "Dang nhap",
    old: req.flash("old")[0] || {},
  });
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await Account.findOne({
    email: email,
    deleted: false
  });

  if(!user) {
    req.flash("error", "Email Khong ton tai!");
    req.flash("old", req.body); 
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    return;
  }

  if(md5(password) != user.password) {
    req.flash("error", "Sai mat khau!");
    req.flash("old", req.body); 
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    return;
  }

  if(user.status == "inactive") {
    req.flash("error", "Tai khoan da bi khoa!");
    req.flash("old", req.body); 
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    return;
  }

  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}