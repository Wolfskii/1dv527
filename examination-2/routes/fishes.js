const express = require('express')
const router = express.Router()
const request = require('request')
const verify = require('./verifyToken')
const Fish = require('../models/Fish')
const Hook = require('../models/Hook')

// GETS ALL FISHES
router.get('/', async (req, res) => {
  try {
    const fishes = await Fish.find() // .limit() for a limit of gotten
    res.json({
      fishes: fishes,
      links: {
        self: { href: '', method: 'GET, POST', desc: 'GET all registered fishes or POST a new fish if logged in', params: 'POST: { {longitude}, {latitude}, {specie}, {weight}, {lenght}, {image} }', authToken: '{token}' },
        getOneFish: { href: '/:shortId', method: 'GET', desc: 'Get a specific fish from shortId', params: '{shortId}' },
        deleteFish: { href: '/:shortId', method: 'DELETE', desc: 'Delete a fish by its shortId if logged in and is yours', params: '{shortId}', authToken: '{token}' },
        editFish: { href: '/:shortId', method: 'PUT', desc: 'Change a fish if logged in and is yours', params: '{shortId}, {longitude}, {latitude}, {specie}, {weight}, {lenght}, {image}', authToken: '{token}' },
        editFishSpecie: { href: '/:shortId', method: 'PATCH', desc: 'Change the specie of a fish if logged in and is yours', params: '{shortId}, {specie}', authToken: '{token}' },
        hook: { href: '/hook', method: 'POST', desc: 'Register a new webhook to receive updates about fishes', params: '{url}' }
      }
    })
  } catch (err) {
    res.json({ message: err })
  }
})

// CREATES FISHES (need to be logged in)
router.post('/', verify, async (req, res) => {
  const fish = new Fish({
    fisherman: req.user.name,
    fishermanId: req.user._shortId,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    specie: req.body.specie,
    weight: req.body.weight,
    length: req.body.length,
    image: req.body.image,
    links: {

    }
  })

  try {
    fish.links = {
      self: `/api/fishes/${fish._shortId}`,
      user: `/api/users/${fish.fishermanId}`
    }
    const savedFish = await fish.save()
    delete savedFish.links
    res.status(201).json(savedFish)

    // Get all hooks and send them updates
    const message = 'New fish created'
    await sendAllHooks(message, savedFish)
  } catch (err) {
    res.json({ message: err })
  }
})

// GETS INFO ABOUT THE WEBHOOK
router.get('/hook', async (req, res) => {
  res.json({
    links: { self: { href: '', method: 'POST', desc: 'Register a new webhook to receive updates about fishes', params: '{url}' } }
  })
})

// CREATES WEBHOOK FROM POST
router.post('/hook', async (req, res) => {
  try {
    const hook = new Hook({
      url: req.body.url
    })

    const savedHook = await hook.save()
    sendHook(req.body.url, 'Hook created succesfully')
    res.status(201).json(savedHook)
  } catch (err) {
    res.json({ message: err })
  }
})

// GET SPECIFIC FISH BY SHORT-ID
router.get('/:fishShortId', async (req, res) => {
  try {
    const fish = await Fish.findOne({ _shortId: req.params.fishShortId })
    res.json(fish)
  } catch (err) {
    res.json({ message: err })
  }
})

// DELETE SPECIFIC FISH BY SHORT-ID (if logged in and yours)
router.delete('/:fishShortId', verify, async (req, res) => {
  try {
    const searchedFish = await Fish.findOne({ _shortId: req.params.fishShortId })
    if (searchedFish.fishermanId === req.user._shortId) {
      await Fish.deleteOne({ _shortId: req.params.fishShortId })
      delete searchedFish.links
      res.json({
        removedFish: searchedFish,
        links: {
          self: { href: '', method: 'DELETE', desc: 'Delete a fish by its shortId if logged in and is yours', params: '{shortId}', authToken: '{token}' }
        }
      })

      // Get all hooks and send them updates
      const message = 'Fish removed'
      await sendAllHooks(message, searchedFish)
    } else {
      res.status(401).send('Access denied, you can only delete your own fish!')
    }
  } catch (err) {
    res.json({ message: err })
  }
})

// UPDATE SPECIFIC FISH BY SHORT-ID BY PUT (if logged in and yours)
router.put('/:fishShortId', verify, async (req, res) => {
  try {
    const searchedFish = await Fish.findOne({ _shortId: req.params.fishShortId })
    if (searchedFish.fishermanId === req.user._shortId) {
      await Fish.updateOne({ _shortId: req.params.fishShortId }, { $set: { longitude: req.body.longitude, latitude: req.body.latitude, specie: req.body.specie, weight: req.body.weight, length: req.body.length, image: req.body.image } })
      const updatedFish = await Fish.findOne({ _shortId: req.params.fishShortId })
      delete updatedFish.links
      res.json({
        updatedFish: updatedFish,
        links: {
          self: { href: '', method: 'PUT', desc: 'Change a fish if logged in and is yours', params: '{shortId}, {longitude}, {latitude}, {specie}, {weight}, {lenght}, {image}', authToken: '{token}' }
        }
      })

      // Get all hooks and send them updates
      const message = 'Fish updated'
      await sendAllHooks(message, await Fish.findOne({ _shortId: req.params.fishShortId }))
    } else {
      res.status(401).send('Access denied, you can only update your own fish!')
    }
  } catch (err) {
    res.json({ message: err })
  }
})

// UPDATE SPECIFIC FISH BY SHORT-ID BY PATCH (if logged in and yours)
router.patch('/:fishShortId', verify, async (req, res) => {
  try {
    const searchedFish = await Fish.findOne({ _shortId: req.params.fishShortId })
    if (searchedFish.fishermanId === req.user._shortId) {
      await Fish.updateOne({ _shortId: req.params.fishShortId }, { $set: { specie: req.body.specie } })
      const updatedFish = await Fish.findOne({ _shortId: req.params.fishShortId })
      delete updatedFish.links
      res.json({
        updatedFish: updatedFish,
        links: {
          self: { href: '', method: 'PATCH', desc: 'Change the specie of a fish if logged in and is yours', params: '{shortId}, {specie}', authToken: '{token}' }
        }
      })

      // Get all hooks and send them updates
      const message = 'Fish updated'
      await sendAllHooks(message, updatedFish)
    } else {
      res.status(401).send('Access denied, you can only update your own fish!')
    }
  } catch (err) {
    res.json({ message: err })
  }
})

// Send new data to all registered hooks
async function sendAllHooks (message, fish) {
  try {
    // Find all hooks in DB
    const hooks = await Hook.find()

    hooks.forEach(async hook => {
      await sendHook(hook.url, message, fish)
    })
  } catch (err) {
    console.log(err)
  }
}

// Send POST-request with message and optionally fish to a targetUrl (hook)
async function sendHook (targetUrl, message, fish) {
  try {
    let body = { message: message }
    if (fish) { body = { message: message, currFish: fish } }

    const clientServerOptions = {
      uri: targetUrl,
      body: JSON.stringify(body),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    // POST to client webhook
    request(clientServerOptions, function (error, response, body) {
      if (error) {
        console.error('error:', error)
        console.log('statusCode:', response && response.statusCode)
        console.log('body:', body)
      }
    })
  } catch (err) {
    console.log(err)
  }
}

module.exports = router
