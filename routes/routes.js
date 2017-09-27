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



// Routes to be exported
module.exports = (app) => {
  
  // Landing page route
  app.get('/', (req, res) => {
    Article.find().sort({added: -1}).exec((err, data) => {
      if (err) {
        console.log(err)
      }
      else {
        res.render('index', {articles: data})
      }
    });
  });


  // Scraping pathway
  app.get('/scrape', (req, res) => {
    request("https://www.theatlantic.com/latest/", (err, res, html) => {
      // HTML is saved as $ selector
      const $ = cheerio.load(html)

      
      // Iterating through each element
      $('li.article').each((i, element) => {
        
        let post = {}
        // Capturing title
        post.title = $(element).find('a').find('.hed').text()
        // Capturing summary
        post.summary = $(element).find('p').text()
        // capturing URL  
        post.link = `https://www.theatlantic.com/latest/${$(element).find("a").attr('href')}`
        // Capture img
        post.img = $(element).find('a').find('figure').find('img').attr('src')
        post.date = new Date

        // Get db info to check for duplicates
        Article.find({title: post.title}, (err, docs) => {
          if (err) {
            console.log(err)
          }
          else {
            if (docs.length > 0) {
              return console.log(`{${post.title}} is a duplicate entry, and will not be saved`)
            }
            else {
              savePost(post)
            }
          }
        })
      });
    });
    res.redirect('/')
  });
    


  // Getting all articles
  app.get('/articles', (req, res) => {
    Article.find({}, (err, doc) => {
      if (err) {
        console.log(err)
      }
      else {
        res.json(doc)
      }
    });
  });

  

  // This function saves the article
  const savePost = (post) => {
    let article = new Article(post)

    article.save((err, doc) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log(doc)
      }
    })
  }
}