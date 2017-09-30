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

// Setting up mongoose
const mongoose = require('mongoose')

// Setting up mongoose to use ES6 promises
// Note to self --> Need to learn more about this
mongoose.Promise = Promise

// Database configuration
mongoose.connect('mongodb://localhost/mongo-scraper');
const db = mongoose.connection



// Setting up express-sessions and MongoStore
app.use(session({
  secret: 'mongo is mongod',
  store: new MongoStore({mongooseConnection: db}),
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



// Make user info available on all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId
  next();
})


// General Routes
require('./routes/routes.js')(app)
// Authentication Routes
require('./routes/auth.js')(app)



app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Starting server
app.listen(PORT, () => {
  console.log("App running on port 8080!")
})


