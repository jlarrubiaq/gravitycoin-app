import { Meteor } from "meteor/meteor";
import { Web3jsWrapper } from "../models/Web3jsWrapper";
import { Ethaccounts } from "../../collections";

Meteor.methods({
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

    let web3 = new Web3jsWrapper();

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
});