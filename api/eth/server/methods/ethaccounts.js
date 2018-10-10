import { Meteor } from "meteor/meteor";
import { Web3jsWrapper } from "../models/Web3jsWrapper";
import { Match } from 'meteor/check'
import { Ethaccounts, Ethtransfers } from "../../common/collections/collections";

Meteor.methods({
  /**
   * 
   */
  createAccount: (email) => {
    check(email, String);

    // @todo: Double check if this works to check the user is not anonymous.
    // if (Meteor.userId()) {
    //   //return Response.unauthorised();
    //   return {
    //     error: 1,
    //     message: "User is not authorised",
    //   }
    // }

    const user = Meteor.users.findOne({ "emails.address": email });
    if (!user) {
      throw new Error(`ERROR creating Eth account - User not found: ${email}`);
    }

    const web3Wrapper = new Web3jsWrapper();
    const web3 = web3Wrapper.getWeb3Instance();

    let account = web3.eth.accounts.create();
    let update = Ethaccounts.insert({
      address: account.address,
      privateKey: account.privateKey,
      userId: user._id
    });

    if (!update) {
      return {
        error: 1,
        message: "User is not authorised",
      }
    }

    return {
      message: "The account was created successfully in the Ethereum network!.",
    }
  },

  /**
   * 
   */
  getUserBalance: (userId) => {
    check(userId, String);
    // @todo: Check the id is the same as current user id.

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
   * 
   */
  transfer: (fromUser, toUser, amount) => {
    check(fromUser, String);
    check(toUser, String);
    check(amount, Match.OneOf(String, Number));
    // @todo: Check the id is the same as current user id.

    const fromAccount = Ethaccounts.findOne({ userId: fromUser });
    const toAccount = Ethaccounts.findOne({ userId: toUser });
    if (!fromAccount || !toAccount) {
      throw new Error(`ERROR transfering token: Not found account for userId: ${fromUser} or ${toUser}`);
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