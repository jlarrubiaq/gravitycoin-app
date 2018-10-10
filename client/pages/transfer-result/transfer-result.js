import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Ethtransfers } from '../../../api/eth/common/collections/collections';

Template.transferResult.onCreated(() => {
  const template = Template.instance();
  const transferId = FlowRouter.getParam("transferId");

  template.subscribe("ethTransfers", { _id: transferId });
});

Template.transferResult.helpers({
  statusSuccess() {
    const transferId = FlowRouter.getParam("transferId");
    const transfer = Ethtransfers.findOne({ _id: transferId });

    if (transfer) {
      return transfer.status === 'success';
    }
  },
  /**
   * Text with transfer status.
   */
  statusText() {
    const transferId = FlowRouter.getParam("transferId");
    const transfer = Ethtransfers.findOne({ _id: transferId });

    if (transfer) {
      return transfer.status === 'success' ? 'Cool! The transfer was successful!' : 'Oh no! There was an error with your transfer';
    }
  },
  /**
   * Text with transfer details message.
   */
  detailsText() {
    const transferId = FlowRouter.getParam("transferId");
    const transfer = Ethtransfers.findOne({ _id: transferId });

    if (transfer) {
      return transfer.status === 'success' ? 'Transaction details' : 'Details';
    }
  },
  /**
   * Details of the transfer.
   */
  details() {
    const transferId = FlowRouter.getParam("transferId");
    const transfer = Ethtransfers.findOne({ _id: transferId });
    const details = [];
    const tokenSymbol = Meteor.settings.TOKEN_SYMBOL;

    if (transfer) {
      if (transfer.status === 'success') {
        details.push({
          label: 'Sender address',
          value: transfer.from
        });
        details.push({
          label: 'Recepient address',
          value: transfer.to
        });
        details.push({
          label: 'Amount',
          value: transfer.amount ? `${transfer.amount} ${tokenSymbol}` : `0 ${tokenSymbol}`
        });
        details.push({
          label: 'Used gas',
          value: transfer.gasUsed
        });
        details.push({
          label: 'Transaction Hash',
          value: transfer.transactionHash
        });
      } else {
        details.push({
          label: 'Error',
          value: transfer.error
        });
      }
  
      return details;
    }
  },
});
