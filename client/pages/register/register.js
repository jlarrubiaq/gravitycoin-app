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
  template.isLoading = new ReactiveVar(false);
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

    let keyStoreFile, keyStorePassword, privateKey, account;

    templateInstance.errorMessage.set(null);
    templateInstance.isLoading.set(true);

    if (templateInstance.useExistingAccount.get()) {
      if (templateInstance.useKeyStoreFile.get()) {
        keyStoreFile = $('[name=keystore-file]').prop('files');
        keyStorePassword = $('[name=keystore-password]').val();
        
        if (!keyStoreFile || !keyStorePassword) {
          templateInstance.errorMessage.set('Keystore file and password fields are required.');
          return;
        }

        const fr = new FileReader();
        fr.readAsText(keyStoreFile[0]);
        fr.onload = function(fileContent) {
          keyStoreFile = fileContent.target.result;
          // console.log({ keyStoreFile, keyStorePassword });
          Meteor.call("loadAccountFromKeystore", keyStoreFile, keyStorePassword, (err, res) =>  {
            if (err) {
              templateInstance.errorMessage.set(err);
            }
            account = res;
          });
        };
      } else {
        privateKey = $('#private-key').val();
        if (!privateKey) {
          templateInstance.errorMessage.set('Private key field is required.');
          return;
        }
        Meteor.call("loadAccountFromPrivateKey", privateKey, (err, res) =>  {
          if (err) {
            templateInstance.errorMessage.set(err);
          }
          account = res;
        });
      }
    }
    
    if (!templateInstance.errorMessage.get()) {
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
            Meteor.call("associateAccount", email, account, (err, res) =>  {
              if (err) {
                templateInstance.errorMessage.set(err);
              }
              else {
                FlowRouter.go("home");
              }
            });
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
    }
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