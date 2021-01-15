const mongoose = require('mongoose')
const shortId = require('shortid')

const userSchema = new mongoose.Schema({
  _shortId: {
    type: String,
    required: true,
    unique: true,
    default: shortId.generate
  },
  name: {
    type: String,
    required: true,
    minlength: 6
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 255,
    minlength: 6
  },
  password: {
    type: String,
    required: true,
    maxlength: 1024,
    minlength: 6
  },
  date: {
    type: Date,
    default: Date.now
  },
  links: {
    type: Object
  }
})

module.exports = mongoose.model('User', userSchema)
