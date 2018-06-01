import {FlowRouter} from 'meteor/kadira:flow-router';

Template.login.events({
  'submit form': function(event){
    event.preventDefault();
    let email = $('[name=email]').val();
    let password = $('[name=password]').val();
    Meteor.loginWithPassword(email, password, function(error){
      if(error){
        console.log(error.reason);
      } else {
        FlowRouter.go("home");
      }
    });
  }
});