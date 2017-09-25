
module.exports = (app) => {
  
  // Landing page route
  app.get('/', (req, res) => {
    res.render('index')
  })
}


// app.get('/scrape', (req, res) => {
//   request("asdasd", (err, res) => {
//     if (err) throw err;
//     else {
//       console.log(doc)
//     }
//     // Add code here
//   })
// })

