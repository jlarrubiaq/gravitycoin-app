import { Meteor } from "meteor/meteor";

export function loadConfig() {
  Meteor.settings.APP_NAME = "GravityCoin";
  Meteor.settings.TOKEN_ADDRESS = "0x0d4d156bfa3fc1e5508e501774001bd0e1f6c722";
  Meteor.settings.TOKEN_NAME = "GravityCoin";
  Meteor.settings.MASTER_ACCOUNT = "0x0de2f8c965126529c527d20598f1aa19ee83acec";
  Meteor.settings.TOKEN_SYMBOL = "GTC";
  Meteor.settings.NETWORK_URL = "https://ropsten.infura.io";
  // ChainId is 3 for the test network ropsten. 
  Meteor.settings.NETWORK_CHAINID = 3;
}
