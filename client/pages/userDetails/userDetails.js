import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Ethaccounts } from '/api/eth/common/collections/collections';

/**
 * On created.
 */
Template.userDetails.onCreated(() => {
  const template = Template.instance();
  template.subscribe("ethAccounts", { userId: Meteor.userId() });
  template.subscribe("usersProfile", { _id: Meteor.userId() });
});

/**
 * Helpers.
 */
Template.userDetails.helpers({
  /**
   * User details.
   */
  details() {
    const user = Meteor.users.findOne({ _id: Meteor.userId() });
    const ethAccount = Ethaccounts.findOne({ userId: Meteor.userId() });
    const details = [];

    if (user) {
      details.push({
        label: 'Username',
        value: user.username
      });
      details.push({
        label: 'Email',
        value: user.emails[0].address
      });
    }
    if (ethAccount) {
      details.push({
        label: 'Account address',
        value: ethAccount.address
      });
    }
  
    return details;
    
  },
});
