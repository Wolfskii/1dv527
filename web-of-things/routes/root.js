const express = require('express')
const router = express.Router()

// root-route of the WoT-device
router.get('/', async (req, res) => {
  res.set({
    Link: '</model/>; rel="model",</properties/>; rel="properties",</actions/>; rel="actions",</subscriptions/>; rel="subscriptions",<http://model.webofthings.io/>; rel="type",<https://www.raspberrypi.org/products/raspberry-pi-3-model-b-plus/>; rel="product",<https://1drv.ms/b/s!ApLdO-GLzd7qgccoN_Xdz1LjoGFchw?e=YhnPKl/>; rel="help",</ui/>; rel="ui"'
  })
  res.json({
    id: 'http://pi.local:3000',
    name: 'Network-central sensor device',
    description: 'A Raspberry Pi device that measures the temperature and humidity of the network central of a home.',
    tags: ['raspberry', 'pi', 'WoT', 'DHT22', 'temperature', 'humidity', 'bluetooth', 'speaker'],
    links: {
      model: {
        link: '/model',
        title: 'Model of this WoT-device.'
      },
      properties: {
        link: '/properties',
        title: 'Properties of this WoT-device.'
      },
      actions: {
        link: '/actions',
        title: 'Actions of this WoT-device.'
      },
      subscriptions: {
        link: '/subscriptions',
        title: 'Subscriptions of this WoT-device.'
      },
      type: {
        link: 'http://model.webofthings.io',
        title: 'Type of this WoT-device.'
      },
      product: {
        link: 'https://www.raspberrypi.org/products/raspberry-pi-3-model-b-plus',
        title: 'The product this WoT-device is based on.'
      },
      help: {
        link: 'https://1drv.ms/b/s!ApLdO-GLzd7qgccoN_Xdz1LjoGFchw?e=YhnPKl',
        title: 'The documentation of this WoT-device (not finished).'
      },
      ui: {
        link: '/ui',
        title: 'UI of this WoT-device.'
      }
    }
  })
})

module.exports = router
