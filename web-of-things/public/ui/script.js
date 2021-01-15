const timestampP = document.getElementById('timestamp')
const tempP = document.getElementById('temp')
const humP = document.getElementById('humidity')

const request = new XMLHttpRequest()
const apiUrl = 'http://pi.local:3000'

request.open('GET', apiUrl + '/properties/temperature', true)
request.onload = async function () {
  // Begin accessing JSON data here
  const data = await JSON.parse(this.response)

  if (request.status >= 200 && request.status < 400) {
    timestampP.textContent = await new Date(data[0].timestamp)
    tempP.textContent = await (data[0].temp + ' °C').replace('.', ',')
  } else {
    console.log('error')
  }
}
request.send()

const request2 = new XMLHttpRequest()
request2.open('GET', apiUrl + '/properties/humidity', true)
request2.onload = function () {
  // Begin accessing JSON data here
  const data = JSON.parse(this.response)

  if (request2.status >= 200 && request2.status < 400) {
    humP.textContent = (data[0].h + '%').replace('.', ',')
  } else {
    console.log('error')
  }
}
request2.send()
