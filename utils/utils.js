export const isLoggedIn = (req, res, next) => {
  if (req.session.id && req.session.userId) {
    return res.redirect('/profile')
  }
  return next();
}

export const reqLogin = (req, res, next) => {
  if (req.session.id && req.session.userId) {
    return next()
  }
  else {
    let err = new Error('You must be logged in to view this page.')
    err.status = 401;
    return next(err;)
  }
}