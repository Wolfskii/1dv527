const express = require('express')
const router = express.Router()
const say = require('say')
const dataHandler = require('../scripts/dataHandler')

// actions-route of the WoT-device
router.get('/', async (req, res) => {
  res.set({
    Link: '<http://model.webofthings.io/#actions-resource>; rel="type",</speakall/>; rel="speakall",</speaktemp/>; rel="speaktemp",</speakhumidity/>; rel="speakhumidity"'
  })
  res.json([
    {
      id: 'speakall',
      name: 'Speak all',
      description: 'Outputs both temperature and humidity of the sensors through the BT-speaker',
      action: 'POST',
      values: {
        name: {
          type: 'string',
          required: false,
          contentType: 'application/json'
        },
        gender: {
          type: 'string',
          required: false,
          contentType: 'application/json'
        }
      },
      link: '/speakall'
    },
    {
      id: 'speaktemp',
      name: 'Speak temperature',
      description: 'Outputs temperature of the sensor through the BT-speaker',
      action: 'POST',
      values: {
        name: {
          type: 'string',
          required: false,
          contentType: 'application/json'
        },
        gender: {
          type: 'string',
          required: false,
          contentType: 'application/json'
        }
      },
      link: '/speaktemp'
    },
    {
      id: 'speakhumidity',
      name: 'Speak humidity',
      description: 'Outputs humidity of the sensor through the BT-speaker',
      action: 'POST',
      values: {
        name: {
          type: 'string',
          required: false,
          contentType: 'application/json'
        },
        gender: {
          type: 'string',
          required: false,
          contentType: 'application/json'
        }
      },
      link: '/speakhumidity'
    }
  ])
})

router.post('/speakall', async (req, res) => {
  let currTemp = await dataHandler.getTemp()
  currTemp = await currTemp.toString().replace('.', ' comma ')
  let currHum = await dataHandler.getHumidity()
  currHum = await currHum.toString().replace('.', ' comma ')

  let speakString = createSpeakString(req)
  speakString += 'the current temperature is ' + currTemp + ' degrees celcius and the current humidity is ' + currHum + ' procent'

  say.speak(speakString)
})

router.post('/speaktemp', async (req, res) => {
  let currTemp = await dataHandler.getTemp()
  currTemp = await currTemp.toString().replace('.', ' comma ')

  let speakString = createSpeakString(req)
  speakString += 'the current temperature is ' + currTemp + ' degrees celcius'

  say.speak(speakString)
})

router.post('/speakhumidity', async (req, res) => {
  let currHum = await dataHandler.getHumidity()
  currHum = await currHum.toString().replace('.', ' comma ')

  let speakString = createSpeakString(req)
  speakString += 'the current humidity is ' + currHum + ' procent'

  say.speak(speakString)
})

function createSpeakString (req) {
  let speakString = ''

  const currHr = new Date().getHours()

  if (currHr < 12) {
    speakString += 'Good morning'
  } else if (currHr < 18) {
    speakString += 'Good afternoon'
  } else {
    speakString += 'Good evening'
  }

  if (req.body.gender === 'male') {
    speakString += ' mister'
  } else if (req.body.gender === 'female') {
    speakString += ' miss'
  }

  if (req.body.name.length) {
    speakString += ' ' + req.body.name + ', '
  } else {
    speakString += ', '
  }

  return speakString
}

module.exports = router
