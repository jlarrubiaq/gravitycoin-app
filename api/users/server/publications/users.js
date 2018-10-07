import { Meteor } from 'meteor/meteor';

Meteor.publish('usersProfile', function(query = {}) {
  return Meteor.users.find(query, {
    fields: { username: 1, profile: 1 }
  });
});