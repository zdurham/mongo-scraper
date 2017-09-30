const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  img: {
    type: String
  },
  added: {
    type: Date,
    default: Date.now
  },
  saved: {
    type: Boolean,
    default: false
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

let Article = mongoose.model("Article", ArticleSchema)

module.exports = Article