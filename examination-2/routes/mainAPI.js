const express = require('express')
const router = express.Router()

// Main API route - HATEOAS to guide through the API
router.get('/', async (req, res) => {
  res.json({
    links: {
      self: { href: '', method: 'GET', desc: 'Starting point of the fishing clubs REST-API' },
      fishes: { href: '/fishes/', method: 'GET, POST', desc: 'GET all registered fishes or POST a new fish if logged in', params: 'POST: { {longitude}, {latitude}, {specie}, {weight}, {lenght}, {image} }', authToken: '{token}' },
      getOneFish: { href: '/fishes/:shortId', method: 'GET', desc: 'Get a specific fish from shortId', params: '{shortId}' },
      deleteFish: { href: '/fishes/:shortId', method: 'DELETE', desc: 'Delete a fish by its shortId if logged in and is yours', params: '{shortId}', authToken: '{token}' },
      editFish: { href: '/fishes/:shortId', method: 'PUT', desc: 'Change a fish if logged in and is yours', params: '{shortId}, {longitude}, {latitude}, {specie}, {weight}, {lenght}, {image}', authToken: '{token}' },
      editFishSpecie: { href: '/fishes/:shortId', method: 'PATCH', desc: 'Change the specie of a fish if logged in and is yours', params: '{shortId}, {specie}', authToken: '{token}' },
      registerUser: { href: '/users/register', method: 'POST', desc: 'Register a new user', params: '{name}, {email}, {password}' },
      loginUser: { href: '/users/login', method: 'POST', desc: 'Login user', params: '{email}, {password}' },
      getUser: { href: '/users/:shortId', method: 'GET', desc: 'GET user-info if logged in and is you', params: '{shortId}', authToken: '{token}' },
      deleteUser: { href: '/users/:shortId', method: 'DELETE', desc: 'Delete a user by its shortId if logged in and is you', params: '{shortId}', authToken: '{token}' },
      editUser: { href: '/users/:shortId', method: 'PUT', desc: 'Change a user if logged in and is you', params: '{shortId}, {name}, {email}, {password}', authToken: '{token}' },
      hook: { href: '/fishes/hook', method: 'POST', desc: 'Register a new webhook to receive updates about fishes', params: '{url}' }
    }
  })
})

module.exports = router
