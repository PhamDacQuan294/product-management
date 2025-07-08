const md5 = require("md5");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");

const generateHelper= require("../../helpers/generate");
const sendMailHelper= require("../../helpers/sendMail");

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

  await Cart.updateOne({
    _id: req.cookies.cartId
  }, {
    user_id: user.id
  });

  res.cookie("tokenUser", user.tokenUser);
  
  res.redirect("/")
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
}

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lay lai mat khau",
  });
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false
  });

  if(!user) {
    req.flash("error", "Email khong ton tai");
    res.redirect("/user/password/forgot");
    return;
  }

  // Luu thong tin vao DB
  const otp = generateHelper.generateRandomNumber(8);

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now() 
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // Neu ton tai email thi gui ma OTP qua email
  const subject = "Ma OTP xac minh lay lai mat khau";
  const html = `
    Ma OPT de lay lai mat khau la <b>${otp}</b>. Thoi han su dung la 3 phut
  `;

  sendMailHelper.sendMail(email, subject, html);
  
  res.redirect(`/user/password/otp?email=${email}`);
}

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhap ma OTP",
    email: email
  });
}

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if(!result) {
    req.flash("error", "OTP khong hop le!");
    res.redirect(`/user/password/otp?email=${email}`);
    return;
  }

  const user = await User.findOne({
    email: email
  });

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/user/password/reset");
}

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Doi mat khau"
  });
}

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  await User.updateOne({
    tokenUser: tokenUser
  }, {
    password: md5(password)
  });

  res.redirect("/");
}

// [GET] /user/info
module.exports.info = async (req, res) => {
  res.render("client/pages/user/info",{
    pageTitle: "Thong tin tai khoan",
  });
}