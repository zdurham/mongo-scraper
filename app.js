// Set up dependencies
const express = require('express')
const expressHB = require('express-handlebars')
const bodyParser = require('body-parser')
const cheerio = require('cheerio')
const logger = require('morgan')
const mongoose = require('mongoose')
const request = require('request')

let PORT = process.env.PORT || 8080

// Setting up express server
const app = express()
// Setting up public folder dir
app.use(express.static('public'))

// Setting up mongoose to use ES6 promises
// Note to self --> Need to learn more about this
mongoose.Promise = Promise

// Database configuration
mongoose.connect('mongodb://localhost/news-scraper');
const db = mongoose.connection

// Setting up morgan
app.use(logger('dev'))
// Setting up body-parser
app.use(bodyParser.urlencoded({extended: false}))

// Setting up handlebars
app.engine('handlebars', expressHB({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars')

// Routes below
require('./routes/routes.js')(app)


// Starting server
app.listen(PORT, () => {
  console.log("App running on port 8080!")
})


