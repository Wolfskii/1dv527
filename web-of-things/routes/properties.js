const express = require('express')
const router = express.Router()
const SensorData = require('../models/SensorData')
const Subscription = require('../models/Subscription')
const dataHandler = require('../scripts/dataHandler')

// properties-route of the WoT-device
router.get('/', async (req, res) => {
  try {
    res.set({
      Link: '<http://model.webofthings.io/#properties-resource>; rel="type",</temperature/>; rel="temperature",</humidity/>; rel="humidity"'
    })
    res.json([
      {
        id: 'temperature',
        name: 'Temperature',
        description: 'An ambient temperature sensor, in Celcius',

        action: {
          GET: {
            description: 'Retrieval of 25 latest temperature datas',
            values: {
              temp: await dataHandler.getTemp(),
              timestamp: new Date()
            }
          },
          POST: {
            description: 'Register a webhook to temperature datas',
            values: {
              callbackUrl: {
                type: 'string',
                required: true,
                contentType: 'application/json'
              }
            }
          }
        },
        link: '/temperature'
      },
      {
        id: 'humidity',
        name: 'Humidity',
        description: 'An ambient humidity sensor, in %',
        action: {
          GET: {
            description: 'Retrieval of 25 latest humidity datas',
            values: {
              h: await dataHandler.getHumidity(),
              timestamp: new Date()
            }
          },
          POST: {
            description: 'Register a webhook to humidity datas',
            values: {
              callbackUrl: {
                type: 'string',
                required: true,
                contentType: 'application/json'
              }
            }
          }
        },
        link: '/humidity'
      }
    ])
  } catch (err) {
    res.error(err)
  }
})

// TEMPERATURE GET
router.get('/temperature', async (req, res) => {
  // start with fresh actual data
  const tempDatas = [{ temp: await dataHandler.getTemp(), timestamp: new Date() }]

  // Get latest 24 in DB (+ the fresh one below)
  await SensorData.find().limit(24).sort({ timestamp: -1 }).exec(async (err, datas) => {
    if (!err) {
      datas.forEach((data) => {
        const tempData = {
          temp: data.temp,
          timestamp: data.timestamp
        }
        tempDatas.push(tempData)
      })

      res.set({
        Link: '<http://model.webofthings.io/#properties-resource>; rel="type"'
      })
      res.json(tempDatas)
    } else {
      console.log(err)
    }
  })
})

// HUMIDITY GET
router.get('/humidity', async (req, res) => {
  // start with fresh actual data
  const hDatas = [{ h: await dataHandler.getHumidity(), timestamp: new Date() }]

  // Get latest 24 in DB (+ the fresh one below)
  await SensorData.find().limit(24).sort({ timestamp: -1 }).exec(async (err, datas) => {
    if (!err) {
      datas.forEach((data) => {
        const hData = {
          h: data.h,
          timestamp: data.timestamp
        }
        hDatas.push(hData)
      })

      res.set({
        Link: '<http://model.webofthings.io/#properties-resource>; rel="type"'
      })
      res.json(hDatas)
    } else {
      console.log(err)
    }
  })
})

// CREATE SUBSCRIPTIONS
router.post('/temperature', async (req, res) => { saveSubscription(req, res, 'temperature') })
router.post('/humidity', async (req, res) => { saveSubscription(req, res, 'humidity') })

// Not allowed route methods
router.put('/temperature', resMethodNotAllowed)
router.delete('/temperature', resMethodNotAllowed)
router.patch('/temperature', resMethodNotAllowed)
router.put('/humidity', resMethodNotAllowed)
router.delete('/humidity', resMethodNotAllowed)
router.patch('/humidity', resMethodNotAllowed)

async function resMethodNotAllowed (req, res) {
  try {
    res.status(405).json('Method not allowed')
  } catch (err) {
    res.json(err)
  }
}
async function saveSubscription (req, res, prop) {
  const sub = new Subscription({
    type: req.body.type,
    resource: '/properties/' + prop,
    callbackUrl: req.body.callbackUrl,
    links: {}
  })

  try {
    sub.links = {
      self: `/${sub._id}`
    }
    const savedSub = await sub.save()
    res.status(201).json(savedSub)
  } catch (err) {
    res.json({ message: err })
  }
}

module.exports = router
