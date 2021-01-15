const express = require('express')
const router = express.Router()
const Subscription = require('../models/Subscription')

// subscriptions-route of the WoT-device
router.get('/', async (req, res) => {
  try {
    const subs = await Subscription.find() // .limit() for a limit of gotten
    res.set({
      Link: '<http://model.webofthings.io/#subscriptions-resource>; rel="type"'
    })
    res.json(subs)
  } catch (err) {
    res.json({ message: err })
  }
})

// GET SPECIFIC SUBSCRIPTION
router.get('/:subscriptionId', async (req, res) => {
  try {
    const sub = await Subscription.findOne({ _id: req.params.subscriptionId })
    res.json(sub)
  } catch (err) {
    res.json({ message: err })
  }
})

// DELETE SPECIFIC SUBSCRIPTION
router.delete('/:subscriptionId', async (req, res) => {
  try {
    await Subscription.deleteOne({ _id: req.params.subscriptionId })
    res.status(200).send() // correct status code according to: http://model.webofthings.io/#delete-a-subscription
  } catch (err) {
    res.json({ message: err })
  }
})

// TODO: if not found res

module.exports = router
