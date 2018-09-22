import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';

Template.register.events({
  'submit form': function(event){
    event.preventDefault();

    const email = $('[name=email]').val();
    const password = $('[name=password]').val();
    const username = $('[name=username]').val();

    Accounts.createUser({
      username: username,
      email: email,
      password: password
    }, error => {
      if (error){
        console.log(error.reason);
      } else {
        Meteor.call("createAccount", email, (err, res) =>  {
          if (err) {
            console.log(err);
          } else {
            console.log(res);
          }
        });
        FlowRouter.go("home");
      }
    });
  }
});