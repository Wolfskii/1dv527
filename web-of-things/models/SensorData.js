const mongoose = require('mongoose')
const shortId = require('shortid')

const newShortId = shortId.generate

const SensorDataSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
    default: newShortId
  },
  temp: {
    type: Number,
    required: true
  },
  h: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: new Date()
  }
}, { _id: false })

module.exports = mongoose.model('SensorData', SensorDataSchema)
