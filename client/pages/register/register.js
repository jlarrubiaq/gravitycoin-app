import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from "meteor/reactive-var";

Template.register.onCreated(() => {
  const template = Template.instance();
  template.errorMessage = new ReactiveVar(null);
});

Template.register.helpers({
  errorMessage() {
    return Template.instance().errorMessage.get();
  }
});

Template.register.events({
  'submit form': function(event, templateInstance){
    event.preventDefault();

    templateInstance.errorMessage.set(null);
    const email = $('[name=email]').val();
    const password = $('[name=password]').val();
    const username = $('[name=username]').val();

    Accounts.createUser({
      username: username,
      email: email,
      password: password
    }, error => {
      if (error){
        templateInstance.errorMessage.set(error.reason);
      } else {
        Meteor.call("createAccount", email, (err, res) =>  {
          if (err) {
            templateInstance.errorMessage.set(err);
          }
        });
        FlowRouter.go("home");
      }
    });
  }
});