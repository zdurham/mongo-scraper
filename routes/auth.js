// Requiring models
const Article = require('../models/Article.js')
const Note = require('../models/Note.js')
const User = require('../models/User.js')
const isLoggedIn = require("../middleware/isLoggedIn.js");
const reqLogin = require("../middleware/reqLogin.js");


module.exports = (app) => {

  // Login Page
  app.get('/login', isLoggedIn, (req, res, next) => {
    res.render('login')
  })

  // Post Login
  app.post('/login', (req, res, next) => {
    // Check to see if both inputs were filled out
    if (req.body.email && req.body.password) {

      // Authenticate method (part of UserSchema) used to check email and password against db data 
      User.authenticate(req.body.email, req.body.password, (err, user) => {
        if (err || !user) {
          let err = new Error("Wrong email or password")
          err.status = 401
          return next(err)
        }
        else {
          req.session.userId = user._id;
          return res.redirect('/dashboard')
        }
      })
    }
    // Error sent if one or both inputs weren't filled out
    else {
      var err = new Error("Email and password are both required")
      err.status = 401
      return next(err)
    }
  })

  // Logout
  app.get('/logout', (req, res, next) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return next(err)
        }
        else {
          return res.redirect('/')
        }
      })
    }
  })
  // Register Page
  app.get('/register', isLoggedIn,  (req, res, next) => {
    res.render('register')
  })

  // Post registration request
  app.post('/register', (req, res, next) => {

    // First check to make sure all fields were filled out
    if (req.body.username && req.body.email && req.body.password && req.body.confPassword) {

      // If yes, continue with checking whether passwords matched. If they don't match, send an error on with next()
      if (req.body.password !== req.body.confPassword) {
        let err = new Error('Passwords do not match')
        err.status = 400
        return next(err)
      }

      // If no problems with password, create user object to store input data.
      let user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      };

      // Save user object to mongo
      User.create(user, (err, user) => {
        if (err) {
          return next(err)
        }
        else {
          // Set the session ID as the user's unique id
          req.session.userId = user._id
          // Redirect to the profile page
          return res.redirect('/dashboard')
        }
      })
    }
    // Should we fail the input check, send error stating they need to fill out all fields
    else {
      let err = 'All fields are required';
      err.status = 400;
      return next(err);
    }
  })

  app.get('/dashboard', reqLogin, (req, res, next) => {
    User.findById(req.session.userId).populate('articles').exec((err, user) => {
      if (err) {
        return next(err)
      }
      else {
        console.log('USER', user)
        return res.render('dashboard', {profile: user, articles: user.articles})
      }
    }) 
  })
}