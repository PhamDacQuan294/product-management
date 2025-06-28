module.exports.createPost = (req, res, next) => {
  const redirectUrl = req.query.redirect;

  if (!req.body.title) {
    req.flash("error", "Vui lòng nhập tiêu đề!");

    if (redirectUrl) return res.redirect(redirectUrl);

    return res.redirect("/admin/products/create");
  }

  next();
}