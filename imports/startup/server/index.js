import { Meteor } from 'meteor/meteor';
import { loadServerConfig } from './config';

Meteor.startup(() => {
  let env = process.env.NODE_ENV;
  loadServerConfig(env);
  console.log("ALL OK!");
});

