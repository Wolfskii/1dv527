const SensorData = require('../models/SensorData')
const sensor = require('node-dht-sensor').promises
const Subscription = require('../models/Subscription')
const request = require('request')

module.exports = {
  start: async function () {
    setInterval(async () => {
      // CREATES TEMPSTAMP
      const sensorData = new SensorData({
        temp: await this.getTemp(),
        h: await this.getHumidity()
      })

      try {
        await sensorData.save()

        // Get all hooks and send them updates
        const message = 'New data was logged'
        await this.sendAllSubs(message, sensorData, 'temperature')
        await this.sendAllSubs(message, sensorData, 'humidity')
      } catch (err) {
        console.log(err)
      }
    }, 3600000) // Set to push to DB every hour (to not overload the Pi)
  },

  // Retrieval of fresh data
  getTemp: async function () {
    try {
      const res = await sensor.read(22, 22)
      return res.temperature.toFixed(2)
    } catch (err) {
      console.error('Failed to read sensor data:', err)
    }
  },

  // Retrieval of fresh data
  getHumidity: async function () {
    try {
      const res = await sensor.read(22, 22)
      return res.humidity.toFixed(2)
    } catch (err) {
      console.error('Failed to read sensor data:', err)
    }
  },

  // Send new data to all registered subs
  sendAllSubs: async function (message, data, propType) {
    try {
    // Find all subs in DB
      const subs = await Subscription.find()

      subs.forEach(async sub => {
        if (sub.resource === '/properties/' + propType) {
          await this.sendSub(sub.callbackUrl, message, data, propType)
        }
      })
    } catch (err) {
      console.log(err)
    }
  },

  // Send POST-request with message and data to a sub
  sendSub: async function (callbackUrl, message, data, propType) {
    try {
      let body = { message: message }
      if (propType === 'temperature') {
        body = { message: message, temp: data.temp }
      } else if (propType === 'humidity') {
        body = { message: message, h: data.h }
      }

      const clientServerOptions = {
        uri: callbackUrl,
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
}
