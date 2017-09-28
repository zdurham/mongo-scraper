const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  author: {
    type: String
  },
  body: {
    type: String
  },
  added: {
    type: Date,
    default: new Date
  }
});

var Note = mongoose.model("Note", NoteSchema)

module.exports = Note;