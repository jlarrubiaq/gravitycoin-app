import { Meteor } from "meteor/meteor";
import { Web3jsWrapper } from "../models/Web3jsWrapper";
import { Match } from 'meteor/check'
import { Ethaccounts, Ethtransfers } from "../../common/collections/collections";

Meteor.methods({
  /**
   * Create an account in the Ethereum netowrk for an user.
   */
  createAccount: (email) => {
    check(email, String);

    const user = Meteor.users.findOne({ "emails.address": email });
    if (!user) {
      throw new Error(`ERROR creating Eth account - User not found: ${email}`);
    } else if (user._id !== Meteor.userId()) {
      return {
        error: 1,
        message: `ERROR creating Eth account - You are not allowed to use this user.`
      }
    }

    let web3 = new Web3jsWrapper();
    const account = web3.createAccount(user._id);

    if (account.error) {
      return {
        error: 1,
        message: account.message,
      }
    }
   
    return {
      message: "The account was created successfully in the Ethereum network!.",
    }
  },

  /**
   * Associate an user to an existing Ethereum account.
   * 
   * @param {String} email - User's email. It must already exist in the platform.
   * @param {String} account - Ethereum account.
   */
  associateAccount: (email, account) => {
    check(email, String);

    const user = Meteor.users.findOne({ "emails.address": email });
    if (!user) {
      return {
        error: 1,
        message: `ERROR creating Eth account - User not found: ${email}`
      }
    } else if (user._id !== Meteor.userId()) {
      return {
        error: 1,
        message: `ERROR creating Eth account - You are not allowed to use this user.`
      }
    }

    let web3 = new Web3jsWrapper();
    const result = web3.associateAccount(user._id, account);

    if (result.error) {
      return {
        error: 1,
        message: result.message,
      }
    }
   
    return {
      message: "The account was created successfully associated!.",
    }
  },

  /**
   * Get the balance of an user.
   *
   * @param {String} userId - The user id.
   * 
   * @returns {Number} - The account balance.
   */
  getUserBalance: (userId) => {
    check(userId, String);

    const account = Ethaccounts.findOne({ userId });
    if (!account) {
      throw new Error(`ERROR retrieving user balance: Not found account for userId: ${userId}`);
    }

    let web3 = new Web3jsWrapper();
    try {
      return web3.getAccountBalance(account.address);
    } catch(error) {
      return {
        error: 1,
        message: error
      };
    }
  },

  /**
   * Decrypts a keystore v3 JSON returning its account.
   *
   * @param {*} keyStoreFile - The encrypted private key to decrypt.
   * @param {*} keyStorePassword - The password used for encryption.
   * 
   * @returns {Object} = The Ethereum account.
   */
  loadAccountFromKeystore: (keyStoreFile, keyStorePassword) => {
    check(keyStoreFile, String);
    check(keyStorePassword, String);

    let web3 = new Web3jsWrapper();
    try {
      return web3.getWeb3Instance().eth.accounts.decrypt(keyStoreFile, keyStorePassword);
    } catch (error) {
      return {
        error: 1,
        message: `ERROR loading account from Keystore: ${error.message}`
      }
    }
  },

  /**
   * Creates an account object from a private key.
   *
   * @param {String} privateKey - The account private key.
   * 
   * @returns {Object} = The Ethereum account.
   */
  loadAccountFromPrivateKey: (privateKey) => {
    check(privateKey, String);

    let web3 = new Web3jsWrapper();
    try {
      return web3.getWeb3Instance().eth.accounts.privateKeyToAccount(privateKey);
    } catch (error) {
      return {
        error: 1,
        message: `ERROR loading account from Private Key: ${error.message}`
      }
    }
  },

  /**
   * Transfer tokens between users.
   * 
   * @param {String} fromUser - sender user. It is required to have
   *  tokens and Ether in the current network.
   * @param {String} toUser - recipient account user.
   * @param {String|Number} amount - amount of tokens to send.
   * 
   * @returns {Promise<Object>} - The transaction receipt.
   */
  transfer: (fromUser, toUser, amount) => {
    check(fromUser, String);
    check(toUser, String);
    check(amount, Match.OneOf(String, Number));
    
    if (fromUser !== Meteor.userId()) {
      return {
        error: 1,
        message: `ERROR transfering token: You are not allowed to transfer from this user.`
      }
    }

    const fromAccount = Ethaccounts.findOne({ userId: fromUser });
    const toAccount = Ethaccounts.findOne({ userId: toUser });
    if (!fromAccount || !toAccount) {
      return {
        error: 1,
        message: `ERROR transfering token: Not found account for userId: ${fromUser} or ${toUser}`
      }
    }

    let web3 = new Web3jsWrapper();
    return web3.transferFrom(fromAccount.address, toAccount.address, parseInt(amount), fromAccount.privateKey)
    .then(receipt => {
      const transfer = {
        status: 'success',
        from: receipt.from,
        to: toAccount.address,
        gasUsed: receipt.gasUsed,
        transactionHash: receipt.transactionHash,
        amount: amount,
        receipt: receipt
      };

      const transferId = Ethtransfers.insert(transfer);
      transfer._id = transferId;

      return transfer;
    })
    .catch(error => {
      const transfer = {
        status: 'error',
        error: error
      };
      const transferId = Ethtransfers.insert(transfer);
      transfer._id = transferId;

      return {
        ...transfer,
        error: 1,
      };
    });
  }
});