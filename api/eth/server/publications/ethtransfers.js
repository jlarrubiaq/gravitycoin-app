import { Meteor } from 'meteor/meteor';
import { Ethtransfers } from '../../common/collections/collections';

Meteor.publish('ethTransfers', function(query = {}, fields = {}) {
  return Ethtransfers.find(query, {
    fields: fields
  });
});