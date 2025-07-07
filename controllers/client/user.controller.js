const md5 = require("md5");
const User = require("../../models/user.model");

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle:  "Dang ky tai khoan"
  });
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email
  });

  if(existEmail) {
    req.flash("error", "Email da ton tai");
    res.redirect("/user/register");
    return;
  }

  req.body.password = md5(req.body.password);

  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/");
}

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle:  "Dang nhap tai khoan"
  });
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false
  });

  if(!user) {
    req.flash("error", "Email khong ton tai!");
    res.redirect("/user/login");
    return;
  }

  if(md5(password) !== user.password) {
    req.flash("error", "Sai mat khau!");
    res.redirect("/user/login");
    return;
  }

  if(user.status === "inactive") {
    req.flash("error", "Tai khoan dang bi khoa!");
    res.redirect("/user/login");
    return;
  }

  res.cookie("tokenUser", user.tokenUser);
  
  res.redirect("/")
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
}
