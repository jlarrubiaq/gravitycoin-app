import {FlowRouter} from 'meteor/kadira:flow-router';

Template.register.events({
  'submit form': function(event){
    event.preventDefault();

    let email = $('[name=email]').val();
    let password = $('[name=password]').val();

    Accounts.createUser({
      email: email,
      password: password
    }, error => {
      if (error){
        console.log(error.reason);
      } else {
        Meteor.call("createAccount", (err, res) =>  {
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