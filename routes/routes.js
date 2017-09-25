// Requiring models
const Article = require('../models/Article.js')
const Note = require('../models/Note.js')


module.exports = (app) => {
  
  // Landing page route
  app.get('/', (req, res) => {
    res.render('index')
  })
}


app.get('/scrape', (req, res) => {
  request("https://www.theatlantic.com/latest/", (err, res, html) => {
    // HTML is saved as $ selector
    const $ = cheerio.load(html)

    // Capturing the href then putting it into a total URL
    let href = $(".river").find(".blog-article").find('a').attr('href')
    let url = `https://www.theatlantic.com/latest/${href}`
    

  })
})

