import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from "meteor/reactive-var";
import {
  Ethaccounts
} from '/api/eth/common/collections/collections';

Template.transferTo.onCreated(() => {
  const template = Template.instance();
  const userId = FlowRouter.getParam("userId");
  template.isLoading = new ReactiveVar(false);

  // @todo: limit this to 10 users?
  template.subscribe("usersProfile", { _id: userId });
  template.subscribe("ethAccounts", { userId: userId });
});

Template.transferTo.helpers({
  /**
   * Return user to transfer.
   */
  user() {
    const userId = FlowRouter.getParam("userId");
    return Meteor.users.findOne({ _id: userId });
  },
  /**
   * Return account to transfer.
   */
  account() {
    const userId = FlowRouter.getParam("userId");
    return Ethaccounts.findOne({ userId: userId });
  },
  isLoading() {
    return Template.instance().isLoading.get();
  }
});

Template.transferTo.events({
  
  'submit #transferFrom': function(event, template){
    event.preventDefault();

    const amount = $('[name=amount]').val();
    const fromUser = Meteor.userId();
    const toUser = FlowRouter.getParam("userId");
    template.isLoading.set(true);

    Meteor.call('transfer', fromUser, toUser, amount, function(error, transfer) {
      if (error){
        console.log('Error', error);
      } else {
        console.log('Success', transfer);
      }
      template.isLoading.set(false);
      FlowRouter.go("transferResult", { transferId: transfer._id });
    });
  }
});