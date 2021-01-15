const mongoose = require('mongoose')
const shortId = require('shortid')

const newShortId = shortId.generate

const SubSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
    default: newShortId
  },
  type: {
    type: String,
    required: true,
    default: 'webhook'
  },
  resource: {
    type: String,
    required: true
  },
  callbackUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  },
  links: {
    type: Object
  }
})

module.exports = mongoose.model('Subscriptions', SubSchema)
