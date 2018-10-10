import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.header.helpers({
  appName() {
    return Meteor.settings.APP_NAME;
  }
});

Template.header.events({
  'click .logout': function(event){
    event.preventDefault();
    Meteor.logout();
    FlowRouter.go('login');
  }
});