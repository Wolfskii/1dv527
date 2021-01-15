## Examination 2

Web REST-API server - The fishclub

## Instructions to set up

1. When in the cloned repo, enter "npm install" in a terminal window to install all dependencies
2. Create a .env file in the root directory of the repo with the following keys and their values:
3. To start server enter "npm start"
4. After starting the server you can enter either "npm test" to run the Newman-tests for the local server or "npm run remoteTest" for the remote server. This has to be done in a separate terminal window while running the server (if localhost)!
5. If you want to run the test again or the other one remember to empty the DB ny running the server again with "npm start" first!


Keys in paranthesis are optional

- DB_CONNECTION
- (PORT)
- TOKEN_SECRET
- (NODE_ENV)

## Environment variables info

DB_CONNECTION is the connection url-string provided by the MongoDB-host
Use this temporary DB_CONNECTION url: 

mongodb://adminUser:0ad2c017c4@fishesrest-shard-00-00-skczy.mongodb.net:27017,fishesrest-shard-00-01-skczy.mongodb.net:27017,fishesrest-shard-00-02-skczy.mongodb.net:27017/fishdb?ssl=true&replicaSet=FishesREST-shard-0&authSource=admin&retryWrites=true&w=majority

PORT is the required port to run the server on (optional), don't set it for the testing purposes (default 3000)

TOKEN_SECRET is a by you random string of letters and digits used for the tokens

NODE_ENV is optional and can be set to 'production' if server is in porduction-mode

## Self-signed SSL-certs

Server cert- andd key-files have been included to minimize set-up for the reviewers as it would require them to install OpenSSL or other software to generate them themselves, when server environment variable NODE_ENV is set to 'production' it will not use them anyway.

## Remote server

The remote server is uploaded on the free service called Glitch. To be able to use it you first need to visit the application-URL
to wake it up from hibernation (takes around 5 seconds), or by making a call using the "npm run remoteTest".

The remote-URL is: https://fishclub.glitch.me/
And starting point of the API is: https://fishclub.glitch.me/api/
