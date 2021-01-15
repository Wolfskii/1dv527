const mongoose = require('mongoose')
const shortId = require('shortid')

const newShortId = shortId.generate

const FishSchema = mongoose.Schema({
  _shortId: {
    type: String,
    required: true,
    unique: true,
    default: newShortId
  },
  fisherman: {
    type: String,
    required: true
  },
  fishermanId: {
    type: String,
    required: true
  },
  longitude: {
    type: Number,
    required: true,
    min: 1
  },
  latitude: {
    type: Number,
    required: true,
    min: 1
  },
  specie: {
    type: String,
    required: true,
    maxlength: 200,
    minlength: 2
  },
  weight: {
    type: Number,
    required: true
  },
  length: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    required: true,
    minlength: 7
  },
  datetime: {
    type: Date,
    required: true,
    default: Date.now
  },
  links: {
    type: Object
  }
})

module.exports = mongoose.model('Fishes', FishSchema)
