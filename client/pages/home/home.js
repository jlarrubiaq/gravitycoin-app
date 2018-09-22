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
  users() {
    return Meteor.users.find().fetch();
  },
});
