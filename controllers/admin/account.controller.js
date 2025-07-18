const md5 = require("md5");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };

  const records = await Account.find(find).select("-password-token");

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false
    });
    record.role = role;
  }

  res.render("admin/pages/accounts/index", {
    pageTitle: "Danh sach tai khoan",
    records: records
  });
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false
  });

  res.render("admin/pages/accounts/create", {
    pageTitle: "Tao moi tai khoan",
    old: req.flash("old")[0] || {},
    roles: roles
  });
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false
  });

  if(emailExist) {
    req.flash("error", `Email ${req.body.email} da ton tai`);

    req.flash("old", req.body); 

    return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  } else {
    req.body.password = md5(req.body.password);

    const record = new Account(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
 
}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false
  };

  try {
    const data = await Account.findOne(find);

    const roles = await Role.find({
      deleted: false,
    });

    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chinh sua tai khoan",
      data: data,
      roles: roles,
    });

  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  const emailExist = await Account.findOne({
    _id: { $ne: id },
    email: req.body.email,
    deleted: false
  });

  if(emailExist) {
    req.flash("error", `Email ${req.body.email} da ton tai`);
  } else {

    if(req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    req.flash("success", "Cap nhat tai khoan thanh cong!");

    await Account.updateOne({ _id: id }, req.body);
  }

  res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${id}`);
}