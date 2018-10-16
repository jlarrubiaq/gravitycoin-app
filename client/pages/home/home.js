import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

/**
 * On created.
 */
Template.home.onCreated(() => {
  let template = Template.instance();
  template.subscribe("usersProfile");
});

Template.home.helpers({
  /**
   * Return existing users.
   * 
   * Current logged-in user is not included.
   */
  users() {
    return Meteor.users.find().fetch().filter(user => user._id !== Meteor.userId());
  },

  /**
   * Whether the current user is logged in or not.
   */
  isLoggedInUser() {
    return Meteor.userId() ? true : false;
  },

  /**
   * Return token name.
   */
  tokenName() {
    return Meteor.settings.TOKEN_NAME;
  }
});
