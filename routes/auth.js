// Requiring models
const Article = require('../models/Article.js')
const Note = require('../models/Note.js')
const User = require('../models/User.js')
// Requiring request and cheerio for scraper, as well as mongoose
const request = require('request')
const cheerio = require('cheerio')

// Setting up mongoose
const mongoose = require('mongoose')

// Setting up mongoose to use ES6 promises
// Note to self --> Need to learn more about this
mongoose.Promise = Promise

// Database configuration
mongoose.connect('mongodb://localhost/news-scraper');
const db = mongoose.connection

module.exports = (app) => {
  // Login Page
  app.get('/login', (req, res) => {
    res.render('login')
  })

  // Post Login
  app.post('/login', (req, res) => {

  })

  // Logout
  app.get('/logout', (req, res) => {
    
  })
  // Register Page
  app.get('/register', (req, res) => {
    res.render('register')
  })
  // Post registration request
  app.post('/register', (req, res) => {
    if (req.body.username && req.body.email && req.body.password && req.body.confPassword) {
      if (req.body.password !== req.body.confPassword) {
        let err = new Error('Passwords do not match')
        err.status = 400
        return next(err)
      }

      let user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      };

      User.create(user, (err, user) => {
        if (err) {
          return next(err)
        }
        else {
          req.session.userId = user._id
          return res.redirect('/profile')
        }
      })
    }
    else {
      let err = 'All fields are required';
      err.status = 400;
      return next(err);
    }
  })
}