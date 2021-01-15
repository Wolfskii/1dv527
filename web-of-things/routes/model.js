const express = require('express')
const router = express.Router()

// model-route of the WoT-device
router.get('/', async (req, res) => {
  res.set({
    Link: '<http://model.webofthings.io/#model-resource>; rel="type"'
  })
  res.json({
    id: 'http://pi.local:3000',
    name: 'Network-central sensor device',
    description: 'A Raspberry Pi device that measures the temperature and humidity of the network central of a home.',
    tags: ['raspberry', 'pi', 'WoT', 'DHT22', 'temperature', 'humidity', 'bluetooth', 'speaker'],
    properties: {
      link: '/properties',
      title: 'List of Properties',
      resources: {
        temperature: {
          name: 'Temperature Sensor',
          description: 'An ambient temperature sensor',
          values: {
            temp: {
              name: 'Temperature sensor',
              description: 'The temperature in celsius',
              unit: 'celsius'
            }
          },
          tags: [
            'sensor',
            'public',
            'indoors',
            'temperature'
          ]
        },
        humidity: {
          name: 'Humidity Sensor',
          description: 'An ambient humidity sensor',
          values: {
            h: {
              name: 'Humidity',
              description: 'Percentage of Humidity',
              unit: 'percent'
            }
          },
          tags: [
            'sensor',
            'public',
            'indoors',
            'humidity'
          ]
        }
      }
    },
    actions: {
      link: '/actions',
      title: 'Actions of this Web Thing',
      resources: {
        speakall: {
          values: {
            name: {
              type: 'string',
              required: false
            },
            gender: {
              type: 'string',
              required: false
            }
          }
        },
        speaktemp: {
          values: {
            name: {
              type: 'string',
              required: false
            },
            gender: {
              type: 'string',
              required: false
            }
          }
        },
        speakhumidity: {
          values: {
            name: {
              type: 'string',
              required: false
            },
            gender: {
              type: 'string',
              required: false
            }
          }
        }
      }
    },
    type: {
      link: 'http://model.webofthings.io',
      title: 'Type of this WoT-device.'
    },
    help: {
      link: 'https://1drv.ms/b/s!ApLdO-GLzd7qgccoN_Xdz1LjoGFchw?e=YhnPKl',
      title: 'The documentation of this WoT-device (not finished).'
    },
    ui: {
      link: '/ui',
      title: 'UI of this WoT-device.'
    }
  })
})

module.exports = router
