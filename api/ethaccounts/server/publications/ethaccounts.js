import { Meteor } from 'meteor/meteor';
import { Ethaccounts } from '../../common/collections/ethaccounts';

Meteor.publish('ethAccounts', function(query = {}) {
  return Ethaccounts.find(query, {
    fields: { _id: 1, address: 1, userId: 1 }
  });
});