const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const verify = require('./verifyToken')
const { registerValidation, loginValidation } = require('./validation')

// GET of api/users
router.get('/', async (req, res) => {
  res.json({
    links: {
      self: { href: '', method: 'GET', desc: 'Details about the users methods and further links' },
      registerUser: { href: '/register', method: 'POST', desc: 'Register a new user', params: '{name}, {email}, {password}' },
      loginUser: { href: '/login', method: 'POST', desc: 'Login user', params: '{email}, {password}' },
      getUser: { href: '/:shortId', method: 'GET', desc: 'GET user-info if logged in and is you', params: '{shortId}', authToken: '{token}' },
      deleteUser: { href: '/:shortId', method: 'DELETE', desc: 'Delete a user by its shortId if logged in and is you', params: '{shortId}', authToken: '{token}' },
      editUser: { href: '/:shortId', method: 'PUT', desc: 'Change a user if logged in and is your', params: '{shortId}, {name}, {email}', authToken: '{token}' }
    }
  })
})

// GET of api/users/register
router.get('/register', async (req, res) => {
  res.json({
    links: { self: { href: '', method: 'POST', desc: 'Register a new user', params: '{name}, {email}, {password}' } }
  })
})

// GET of api/users/login
router.get('/login', async (req, res) => {
  res.json({
    links: { self: { href: '', method: 'POST', desc: 'Login user', params: '{email}, {password}' } }
  })
})

// POST of api/users/register (NEW USER)
router.post('/register', async (req, res) => {
  // Let's validate the data
  const { error } = registerValidation(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  // Check if user already exists
  const emailExist = await User.findOne({ email: req.body.email })
  if (emailExist) {
    return res.status(400).send('Email already exists')
  }

  // Salting and hashing of the password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  // Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  })
  try {
    // Adding HATEOAS-linkings
    user.links = {
      self: `/api/users/${user._shortId}`
    }
    await user.save()
    res.status(201).json({
      message: 'User created succesfully',
      name: user.name,
      email: user.email,
      _shortId: user._shortId
    })
  } catch (err) {
    res.status(400).send(err)
  }
})

// POST of api/users/login (LOGIN OF USER)
router.post('/login', async (req, res) => {
  // Let's validate the data
  const { error } = loginValidation(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  // Check if user exists
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return res.status(400).send('Email or password is wrong')
  }

  // Check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password)
  if (!validPass) {
    return res.status(400).send('Email or password is wrong')
  }

  // Create and give token - Expiry of 1 hour
  const token = jwt.sign({ _id: user._id, _shortId: user._shortId, name: user.name }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 })
  res.header('auth-token', token)
  res.header('expires', 3600)
  res.status(303).json({
    authToken: token,
    expiresIn: 3600,
    links: { self: { href: '', method: 'POST', desc: 'Login user', params: '{email}, {password}' } }
  })
})

// GET USER BY SHORT-ID (Only yourself if logged in)
router.get('/:userShortId', verify, async (req, res) => {
  try {
    if (req.user._shortId === req.params.userShortId) {
      const user = await User.findOne({ _shortId: req.params.userShortId })
      res.json(user)
    } else {
      res.status(401).send('Access denied, you can only see your own user data!')
    }
  } catch (err) {
    res.json({ message: err })
  }
})

// DELETE USER BY SHORT-ID (Only yourself if logged in)
router.delete('/:userShortId', verify, async (req, res) => {
  try {
    if (req.user._shortId === req.params.userShortId) {
      const removedUser = await User.remove({ _shortId: req.params.userShortId })
      res.json({
        removeduser: removedUser,
        links: {
          self: { href: '', method: 'DELETE', desc: 'Delete a user by its shortId if logged in and is you', params: '{shortId}', authToken: '{token}' }
        }
      })
    } else {
      res.status(401).send('Access denied, you can only delete your own user account!')
    }
  } catch (err) {
    res.json({ message: err })
  }
})

// CHANGE NAME AND EMAIL OF USER BY SHORT-ID (Only yourself if logged in)
router.put('/:userShortId', verify, async (req, res) => {
  try {
    const searchedUser = await User.findOne({ _shortId: req.params.userShortId })
    if (req.user._shortId === req.params.userShortId) {
      await User.updateOne({ _shortId: req.params.userShortId }, { $set: { name: req.body.name, email: req.body.email } })
      res.json({
        updatedUser: searchedUser,
        links: {
          self: { href: '', method: 'PUT', desc: 'Change a user if logged in and is your', params: '{shortId}, {name}, {email}', authToken: '{token}' }
        }
      })
    } else {
      res.status(401).send('Access denied, you can only update your own user data!')
    }
  } catch (err) {
    res.json({ message: err })
  }
})

module.exports = router
