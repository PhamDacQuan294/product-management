module.exports = (req, res, defaultPath) => {
  const redirectUrl = req.query.redirect;
  if (redirectUrl) {
    return res.redirect(redirectUrl);
  }

  return res.redirect(defaultPath);
}