// Set up dependencies
const express = require('express')
const expressHB = require('express-handlebars')
const bodyParser = require('body-parser')
const logger = require('morgan')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const PORT = process.env.PORT || 8080

// Setting up express server
const app = express()

// Setting up express-sessions and MongoStore
app.use(session({
  secret: process.env.SECRET,
  store: new MongoStore({url: 'mongodb://localhost/news-scraper' }),
  resave: false,
  saveUninitialized: true,
}))
// Setting up public folder dir
app.use(express.static('public'))

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


