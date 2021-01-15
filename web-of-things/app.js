const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const port = process.env.PORT || 3000
const dataHandler = require('./scripts/dataHandler')

// Rate limiting options
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

// MIDDLEWARE
app.use(cors()) // Allows cross origins
app.use(limiter)
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    connectSrc: ['*']
  }
}))
app.use(helmet())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Clear all prev. console text
console.clear()

// CONNECT TO DB
mongoose.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true })
mongoose.set('useCreateIndex', true)
const db = mongoose.connection

db.on('error', () => {
  console.log('Connection to database failed!')
})

db.once('open', async () => {
  console.log('Connection to database established!')
})

// ROUTES
const rootRoute = require('./routes/root')
const modelRoute = require('./routes/model')
const propertiesRoute = require('./routes/properties')
const actionsRoute = require('./routes/actions')
const subRoute = require('./routes/subscriptions')

app.use('/', rootRoute)
app.use('/model', modelRoute)
app.use('/properties', propertiesRoute)
app.use('/actions', actionsRoute)
app.use('/ui', express.static('public/ui'))
app.use('/subscriptions', subRoute)

// START SERVER // IF PRODUCTION -> DON'T USE SELF SIGNED CERT, AS HEROKU AND GLITCH ALREADY USE THEIR OWN
app.set('Connection', db)
app.listen(port, () => {
  console.log('Server started on http://localhost:' + port)
  console.log('Press Ctrl-C to stop')
})

// Catch 404
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Page not found'
  })
})

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send(err.message || 'Internal Server Error')
})

dataHandler.start()
