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

  })
}