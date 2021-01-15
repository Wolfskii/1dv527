const express = require('express')
const app = express()
const fs = require('fs')
const https = require('https')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const port = process.env.PORT || 3000
const SeedScript = require('./scripts/SeedScript')

// Rate limiting options
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

// MIDDLEWARE
app.use(cors()) // Allows cross origins
app.use(limiter)
app.use(helmet.contentSecurityPolicy({ directives: { defaultSrc: ["'self'"] } }))
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

  // EMPTY AND POPULATE DB WITH DUMMY DATA (fishes and users)
  const seedScript = new SeedScript() // Comment these two rows out to not do this
  await seedScript.populateDB()
})

// ROUTES
app.get('/', (req, res) => {
  res.json({
    links: {
      self: { href: '', method: 'GET', desc: 'Root-URL of the Web-server' },
      api: { href: '/api/', method: 'GET', desc: 'Starting point of the fishclubs REST-API' }
    }
  })
})

const mainRoute = require('./routes/mainAPI')
const fishesRoute = require('./routes/fishes')
const authRoute = require('./routes/auth')
app.use('/api', mainRoute)
app.use('/api/fishes', fishesRoute)
app.use('/api/users', authRoute)

// START SERVER // IF PRODUCTION -> DON'T USE SELF SIGNED CERT, AS HEROKU AND GLITCH ALREADY USE THEIR OWN
app.set('Connection', db)
if (process.env.NODE_ENV !== 'production') {
  https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }, app)
    .listen(port, () => {
      console.log('Server started on https://localhost:' + port)
      console.log('Press Ctrl-C to stop')
    })
} else {
  app.listen(port, () => {
    console.log('Server started!')
  })
}
