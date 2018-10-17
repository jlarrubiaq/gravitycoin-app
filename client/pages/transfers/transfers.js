import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Ethtransfers } from '/api/eth/common/collections/collections';
import { Ethaccounts } from '/api/eth/common/collections/collections';

/**
 * On created.
 */
Template.transfers.onCreated(() => {
  const template = Template.instance();

  template.subscribe("ethAccounts", { userId: Meteor.userId() });
  template.subscribe("ethTransfers");
});

Template.transfers.helpers({
  /**
   * Return user transfers.
   */
  transfers() {
    const ethAccount = Ethaccounts.findOne({ userId: Meteor.userId() });

    return Ethtransfers.find({ from: ethAccount.address.toLowerCase() }).fetch();
  },
});
