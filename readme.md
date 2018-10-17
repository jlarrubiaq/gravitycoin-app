# Gravitycoin app

Meteor app for handling and transfering Ethereum token between users.

## How to use it
To start the app, you'll need to:
* Install meteor: https://www.meteor.com/install
* Clone the project

From the console:
* Go to the root folder
* Install the project dependencies by running "npm install"
* Start the meteor app by running "meteor"

The app will start in http://localhost:3000 

### Fork
If you want to try and create your own transfercoin app, you just need to:

* Fork the Gravitycoin app.
* Create and deploy your our token, you can use the contract foundin the project root: token_contract.sol 
  and modify the main parameters to customise it.
* Change the app configuration according to this and your taste: app and token name, symbol, Ethereum
  network to connect, etc. from /imports/startup/common/config.js.
* Signup using the Ethereum account holding the initial token supply. It will represent the “master”
  user that can start delivering the currency.
* Encourage other people to use it and create value from it!

### Important
This project was created as a proof of concept. It shouldn't be used as a production app
as its security hasn't been proved.