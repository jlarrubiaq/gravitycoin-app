import { Template } from 'meteor/templating';

/**
 * On created.
 */
Template.home.onCreated(() => {
  let template = Template.instance();
  // @todo: limit this to 10 users?
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
});
