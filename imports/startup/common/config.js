import { Meteor } from "meteor/meteor";

export function loadConfig() {
  Meteor.settings.APP_NAME = "GravityCoin";
  Meteor.settings.TOKEN_ADDRESS = "0x0d4d156bfa3fc1e5508e501774001bd0e1f6c722";
  Meteor.settings.TOKEN_NAME = "GravityCoin";
  Meteor.settings.MASTER_ACCOUNT = "0x0de2f8c965126529c527d20598f1aa19ee83acec";
  // Master account just will need one of these ones:
  // - Keystore data.
  Meteor.settings.MASTER_ACCOUNT_KEYSTORE_FILE = "UTC--2018-04-25T14-56-43.147751000Z--c5f5f7103431ccc1531b900cf70a7da863522520";
  Meteor.settings.MASTER_ACCOUNT_PASSWORD_FILE = "UTC--2018-04-25T14-56-43.147751000Z--c5f5f7103431ccc1531b900cf70a7da863522520_password";
  // - Private key.
  // Must be preceded by 0x.
  Meteor.settings.MASTER_ACCOUNT_PRIVATEKEY_FILE = "../../../privateKeys/myPrivateKey";
  Meteor.settings.TOKEN_SYMBOL = "GTC";
  Meteor.settings.NETWORK_URL = "https://ropsten.infura.io";
  // ChainId is 3 for the test network ropsten. 
  Meteor.settings.NETWORK_CHAINID = 3;
}
