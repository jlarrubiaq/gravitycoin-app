import { Meteor } from 'meteor/meteor';
import { loadClientConfig } from './config';

Meteor.startup(() => {
  loadClientConfig();
});

