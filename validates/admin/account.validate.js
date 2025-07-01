module.exports.createPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng nhập ho ten!");
    return res.redirect("/admin/accounts/create");
  }

  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");
    return res.redirect("/admin/accounts/create");
  }

  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mat khau!");
    return res.redirect("/admin/accounts/create");
  }

  next();
}

module.exports.editPatch = (req, res, next) => {
  const id = req.params.id;

  if (!req.body.fullName) {
    req.flash("error", "Vui lòng nhập ho ten!");
    return res.redirect(`/admin/accounts/edit/${id}`);
  }

  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");
    return res.redirect(`/admin/accounts/edit/${id}`);
  }

  next();
}