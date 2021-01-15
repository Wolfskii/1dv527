const mongoose = require('mongoose')

const HookSchema = mongoose.Schema({
  url: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Hooks', HookSchema)
