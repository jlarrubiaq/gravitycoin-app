import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from "meteor/reactive-var";
import { Accounts } from 'meteor/accounts-base'

Template.register.onCreated(() => {
  const template = Template.instance();
  template.errorMessage = new ReactiveVar(null);
  template.useExistingAccount = new ReactiveVar(false);
  template.useKeyStoreFile = new ReactiveVar(null);
});

Template.register.helpers({
  errorMessage() {
    return Template.instance().errorMessage.get();
  },
  useExistingAccount() {
    return Template.instance().useExistingAccount.get();
  },
  useKeyStoreFile() {
    return Template.instance().useKeyStoreFile.get();
  }
});

Template.register.events({
  'submit form': function(event, templateInstance) {
    event.preventDefault();

    let keyStoreFile, keyStorePassword, privateKey;

    templateInstance.errorMessage.set(null);

    if (templateInstance.useExistingAccount.get()) {
      if (templateInstance.useKeyStoreFile.get()) {
        keyStoreFile = $('[name=keystore-file]').prop('files');
        keyStorePassword = $('[name=keystore-password]').val();
        if (!keyStoreFile || !keyStorePassword) {
          // @todo: Check with this data we can create an account.
          templateInstance.errorMessage.set('Keystore file and password fields are required.');
          return;
        }
      } else {
        privateKey = $('#private-key').val();
        if (!privateKey) {
          // @todo: Check with this data we can create an account.
          templateInstance.errorMessage.set('Private key field is required.');
          return;
        }
      }
    }
    
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
        if (templateInstance.useExistingAccount.get()) {
          if (templateInstance.useKeyStoreFile.get()) {
            const fr = new FileReader();
            fr.readAsText(keyStoreFile[0]);
            fr.onload = function(fileContent) {
              keyStoreFile = fileContent.target.result;
              console.log({ keyStoreFile, keyStorePassword });
              Meteor.call("associateAccount", email, { keyStoreFile, keyStorePassword }, (err, res) =>  {
                if (err) {
                  templateInstance.errorMessage.set(err);
                }
                else {
                  FlowRouter.go("home");
                }
              });
            };
            
          } else {
            Meteor.call("associateAccount", email, { privateKey }, (err, res) =>  {
              if (err) {
                templateInstance.errorMessage.set(err);
              }
              else {
                FlowRouter.go("home");
              }
            });
          }
        } else {
          Meteor.call("createAccount", email, (err, res) =>  {
            if (err) {
              templateInstance.errorMessage.set(err);
            }
            else {
              FlowRouter.go("home");
            }
          });
        }
      }
    });
  },

  'click #register-existing': function(event, templateInstance) {
    templateInstance.useExistingAccount.set(true);
  },

  'click #register-new': function(event, templateInstance) {
    templateInstance.useExistingAccount.set(false);
  },

  'click #register-existing-privatekey': function(event, templateInstance) {
    templateInstance.useKeyStoreFile.set(false);
  },

  'click #register-existing-keystore': function(event, templateInstance) {
    templateInstance.useKeyStoreFile.set(true);
  }

});