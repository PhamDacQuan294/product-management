module.exports.registerPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng nhập ho ten!");
    return res.redirect("/user/register");
  }

  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");
    return res.redirect("/user/register");
  }

  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mat khau!");
    return res.redirect("/user/register");
  }

  next();
}

module.exports.loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");
    return res.redirect("/user/login");
  }

  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mat khau!");
    return res.redirect("/user/login");
  }

  next();
}

module.exports.forgotPasswordPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");
    return res.redirect("/user/password/forgot");
  }
  next();
}

module.exports.resetPasswordPost = (req, res, next) => {
  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mat khau!");
    return res.redirect("/user/password/reset");
  }

  if (!req.body.confirmPassword) {
    req.flash("error", "Vui lòng xac nhan mat khau!");
    return res.redirect("/user/password/reset");
  }

  if (req.body.password != req.body.confirmPassword) {
    req.flash("error", "Mat khau khong khop!");
    return res.redirect("/user/password/reset");
  }

  next();
}