# Network Central WoT-device

The project consists of a Raspberry Pi 3B+, a REST-server application written in Javascript with Node.js and a DHT22 temperature and humidity sensor.
The server is based on the Web of Things model: http://model.webofthings.io

## What does it do?

The devices purpose is to monitor and store data in a MongoDB database about the conditions in a ventilated cabinet with routers and other network peripherals.
The device can therefore provide both the current and previously stored data. The device is made according to the standards of REST-APIs and the Web of Things model 
and can therefore easily be used by many different clients. The device also follows the HATEOAS-principle, which means its resources and endpoints can be traversed from the root-URL without having to read any documentation.

The device has a basic UI built-in that interacts with the server externally and can be reached on: {mainurl}/ui.
On top of this the device has some extra functionality that implements the action in the WoT-model, where it can speak the current data to the devices connected audio devices.
In this implementation and the UI, the audio output is targeted to a Bluetooth-speaker.

The device is made with a direct integration pattern in mind, as it can talk directly to the network (can also be made available on the Internet) via either an Ethernet cable or WiFi.
This device is mainly targeted to be a local network device and not accessible remotely for security reasons, but was intended to be demoed with a remotely accessible link using Ngrok.
Due to Ngrok changing their business model, making it cost to set up a fixed external URL (it changes after a few hours), the demo will be made as a video, uploaded to YouTube.

## WoT architecture

If we speak in terms of the Web of Things architecture layers we first find, in the Access layer, that the device uses HTTP and JSON to communicate over the network.
Often the resources of data is in JSON-format. I've also mentioned before that the device consists of a REST API that can be accessed through the different URL-link endpoints.
And lastly in this layer we also find the webhooks, where the device sends the updated data.

In the next layer, the Find-layer, we find a continuation of the implementation of URL-link endpoints using HATEOAS, which I described before, makes it possible to traverse through the device,
without additional documentation. The device also uses the Web Thing model and link headers to provide link information (with HATEOAS).

In the third layer, the Share-layer, there is not much done, as the decision was made to keep it a local network device. But the device could eventually be made accessible online and would then have implemented OAuth from e.g. a social network, own JWT-tokens and encryption with HTTPS/TLS.

In the last layer, the Compose-layer, the choice was to make a simple dashboard under the /ui endpoint to see the actual current humidity and temperature, and the possibility to try out the audio output of the data to a connected speaker (in this case a Blueetooth-connected one).

## Questions about the project

### What has gone well and what has gone worse in the project?

I think that it mostly has gone quite well for me during the project. The main problem I had was getting the sensors to work on my Raspberry Pi, as many NPM-modules seem to be outdated.
Also due to the situation of the COVID-19 outbreak I had to reorder the products in Sweden (as I live in Italy since about 4 years). That has made the project somewhat delayed.
Also in Sweden, there were some parts missing so I had to improvise and work with what I got, one compromise being the implemented Bluetooth-speaker as an action.

Also for the demo I made the device available on the internet with Ngrok and HTTPS, but their recent change in business plan made this harder with only the option of the paid plan to get a fixed URL.

### What could have been made better looking back at it?

I think if I had more time I could have implemented a more straightforward way to create more resources/routes with HATEOAS-linking being retrieved and set up automatically. But I considered the fact that there weren't that many resources and thought it would be superfluous for this.

Also I was thinking of making the device available on the internet with a remote URL, but considered that I would only use it locally in my home. On the other hand, 
if I would have had more people in my home I could potentially implement an authorization function with JWT-tokens or OAuth like in the last examination project, 
but also considered there were really not any resources that had the need to be changed/created.

### What did you learn from the project?

Firstly, I of course learned a lot about Web of Things, the model and what you can do with these small devices, having the possibility to connect them into a big mesh of devices that talk and can be interacted with.
I gained more knoweldge about REST APIs, HATEOAS, setting up Node.js in a Linux (Ubuntu) server environment together with programs/modules to keep the application running 24/7 (PM2).
I improved my knowledge by this time using the link-headers to guide the user from the entry point and got experience with getting real data from a physical device/sensor.

### How long time did it take you?

In total the project took me 107h as I had to redo some work that had already been made at home in Italy.
What I had noted in Pomodoro is that setting up the Pi, installing the OS, getting Node.js and experimenting with the sensors took me around 17h.
The documentation and all documents/texts (this README.md included) took me around 4h in total.
Planning of the routes and links with HATEOAS alone took around 7h as I had to go back and forth and change as I progressed and checked with the book.
The frontend UI took more or less 11h, getting it to connect to the application included.
Making of the video, editing and recording it took a little less than 4h.
The rest was on implementing the code of the REST API / WoT server, sometimes getting stuck and trying to solve it myself.

### Something else you would like to take up?

I think it was a nice experience and to see a demo of the project please see the linked YouTube-video below:

[![IMAGE ALT TEXT](http://img.youtube.com/vi/5SBR5e3tCcw/0.jpg)](https://youtu.be/5SBR5e3tCcw "1DV527 - Web of Things device")
