const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: "Username is required"
  },
  email: {
    type: String,
    unique: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"]
  },
  password: {
    type: String,
    required: true
  },
  confPassword: {
    type: String,
    required: true,
    validate: [
      function(input) {
        return input === password
      },
      "Passwords must match"
    ]
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: "Article"
  },
  added: {
    type: Date,
    default: Date.now
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article'
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

let User = mongoose.model("User", UserSchema)

module.exports = User