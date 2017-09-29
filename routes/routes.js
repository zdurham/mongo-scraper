// Requiring models
const Article = require('../models/Article.js')
const Note = require('../models/Note.js')
const User = require('../models/User.js')
// Requiring request and cheerio for scraper, as well as mongoose
const request = require('request')
const cheerio = require('cheerio')


// Routes to be exported
module.exports = (app) => {
  
  // Landing page route
  app.get('/', (req, res, next) => {
    Article.find().sort({added: -1}).populate('notes').exec((err, data) => {
      if (err) {
        console.log(err)
      }
      else {
        res.render('index', {articles: data, user: res.locals.currentUser ? res.locals.currentUser : false})
      }
    });
  });


  // Scraping pathway
  app.get('/scrape', (req, res, next) => {
    request("https://www.theatlantic.com/latest", (err, response, html) => {
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
        post.link = `https://www.theatlantic.com/${$(element).find("a").attr('href')}`

        // Capture img
        post.img = $(element).find('a').find('figure').find('img').attr('data-src')
        console.log('IMG SRC', post.img)
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
      res.redirect('back')
    });
  });

  // Post New Comment Route
  app.post('/add/note/:id', (req, res) => {
    let id = req.params.id;
    User.findOne({'_id': `${res.locals.currentUser}`}, function(err, docs) {
      if (err) {
        return err
      }
      else {
        let request = {  
          author: docs.username,
          body: req.body.comment
        }
        saveNote(request, id, res)
        res.redirect('back')
      }
    })
  })

  app.get('/delete/note/:id', (req, res) => {
    Note.remove({'_id': req.params.id}).exec((err, data) => {
      if (err) {
        console.log(err)
      }
      else {
        res.redirect('back')
      }
    })
  })

  

  // Route to save articles
  app.get('/save/:id', (req, res) => {
    Article.update({'_id': req.params.id}, {$set: {"saved": true}})
      .exec((err, docs) => {
        if (err) {
          console.log(err)
        }
        else {
          console.log(docs)
        }
      })
    User.update({'_id': res.locals.currentUser}, {$push: {'articles': req.params.id}}, {new: true})
      .exec((err, docs) => {
        if (err) {
          console.log(err)
        }
        else {
          console.log(docs)
        }
      })
    res.redirect('back')
  })

  // Route to remove saved articles
  app.get('/unsave/:id', (req, res) => {
    Article.update({'_id': req.params.id}, {$set: {'saved': false}})
      .exec((err, docs) => {
        if (err) {
          console.log(err)
        }
        else {
          console.log(docs)
        }
      })
    User.update({$pull: {'articles': req.params.id}})
      .exec((err, docs) => {
        if (err) {
          console.log(err)
        }
        else {
          console.log(docs)
        }
      })
      res.redirect('/dashboard')
  })
    


  // Helper functions
  // This function saves the article

  const saveNote = (input, id) => {
    let note = new Note(input)

    note.save((err, doc) => {
      if (err) {
        console.log(err)
      }
      else {
        Article.update({'_id': id}, {$push: {'notes': doc._id}}, {new: true})
          .exec((err, doc) => {
            if (err) {
              console.log(err)
            }
            else {
              console.log(doc)
            }
        })
      }
    })
  }
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


