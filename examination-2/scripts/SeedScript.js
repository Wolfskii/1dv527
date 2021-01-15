const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Fish = require('../models/Fish')
const Hook = require('../models/Hook')
const users = require('./sample/users.js')
const fishes = require('./sample/fishes.js')

class SeedScript {
  // Populate the DB with users and fishes (emptying it before)
  async populateDB () {
    try {
      await this.emptyDB()
      console.log('Adding dummy content to database...')
      await this.addUsers()
      await this.addFishes()
      console.log('Population of sample data succesful!')
    } catch (err) {
      console.log(err)
    }
  }

  async emptyDB () {
    // Resetting and emptying the DB
    console.log('Emptying database...')
    await User.deleteMany()
    await Fish.deleteMany()
    await Hook.deleteMany()
    console.log('Database is now empty and ready to roll ;)')
  }

  // Create and add all sample users to DB
  async addUsers () {
    users.sample.forEach(async sampleUser => {
      // Salting and hashing of the password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(sampleUser.password, salt)

      const user = new User({
        _shortId: sampleUser._shortId,
        name: sampleUser.name,
        email: sampleUser.email,
        password: hashedPassword,
        links: {
          self: `/api/users/${sampleUser._shortId}`
        }
      })
      await user.save()
    })
  }

  // Create and add all sample fishes to DB
  async addFishes () {
    fishes.sample.forEach(async sampleFish => {
      const fish = new Fish({
        _shortId: sampleFish._shortId,
        fisherman: sampleFish.fisherman,
        fishermanId: sampleFish.fishermanId,
        longitude: sampleFish.longitude,
        latitude: sampleFish.latitude,
        specie: sampleFish.specie,
        weight: sampleFish.weight,
        length: sampleFish.length,
        image: sampleFish.image,
        links: {
          self: `/api/fishes/${sampleFish._shortId}`,
          user: `/api/users/${sampleFish.fishermanId}`
        }
      })
      await fish.save()
    })
  }
}

module.exports = SeedScript
