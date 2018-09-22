import { Meteor } from 'meteor/meteor';

Meteor.publish('usersProfile',function(){
  return Meteor.users.find({},{ fields: { username: 1, profile: 1 }});
});