import { Meteor } from "meteor/meteor";
import { Web3jsWrapper } from "../models/Web3jsWrapper";
import { Ethaccounts } from "../../collections";

Meteor.methods({
  createAccount: () => {

    // @todo: Double check if this works to check the user is not anonymous.
    // if (Meteor.userId()) {
    //   //return Response.unauthorised();
    //   return {
    //     error: 1,
    //     message: "User is not authorised",
    //   }
    // }

    let web3 = new Web3jsWrapper();

    let account = web3.eth.accounts.create();
    let update = Ethaccounts.insert({
      address: account.address,
      privateKey: account.privateKey,
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