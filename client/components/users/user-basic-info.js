import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveMethod } from "meteor/simple:reactive-method";

Template.userBasicInfo.onCreated(() => {
  const template = Template.instance();
  template.subscribe("ethaccounts", { userId: Meteor.userId() });
});


Template.userBasicInfo.helpers({
  username: () => {
    return Meteor.user().username;
  },
  userBalance: () => {
    return ReactiveMethod.call("getUserBalance", Meteor.userId()) || 0;
  }
});