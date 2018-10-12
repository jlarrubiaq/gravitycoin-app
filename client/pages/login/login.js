import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base'

Template.login.onCreated(() => {
  const template = Template.instance();
  template.errorMessage = new ReactiveVar(null);
});

Template.login.helpers({
  errorMessage() {
    return Template.instance().errorMessage.get();
  }
});

Template.login.events({
  'submit form': function(event, templateInstance){
    event.preventDefault();
    
    templateInstance.errorMessage.set(null);
    let email = $('[name=email]').val();
    let password = $('[name=password]').val();
    
    Meteor.loginWithPassword(email, password, function(error){
      if(error){
        templateInstance.errorMessage.set(error.reason);
      } else {
        FlowRouter.go("home");
      }
    });
  }
});