module.exports.loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");
    return res.redirect("admin/auth/login");
  }

  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập password!");
    return res.redirect("admin/auth/login");
  }

  next();
}
