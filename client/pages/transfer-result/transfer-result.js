import { FlowRouter } from 'meteor/kadira:flow-router';
import {
  Ethaccounts
} from '/api/eth/common/collections/collections';
import { Ethtransfers } from '../../../api/eth/common/collections/collections';

Template.transferResult.onCreated(() => {
  const template = Template.instance();
  const transferId = FlowRouter.getParam("transferId");

  template.subscribe("ethTransfers", { _id: transferId });
});

Template.transferResult.helpers({
  /**
   * Text with transfer status.
   */
  statusText() {
    const transferId = FlowRouter.getParam("transferId");
    const transfer = Ethtransfers.findOne({ _id: transferId });
    console.log('transfer', transfer);

    return transfer.status === 'success' ? 'Cool! The transfer was successful!' : 'Oh no! There was an error with your transfer';
  },
  /**
   * Text with transfer details message.
   */
  detailsText() {
    const transferId = FlowRouter.getParam("transferId");
    const transfer = Ethtransfers.findOne({ _id: transferId });

    return transfer.status === 'success' ? 'Transaction details' : 'Details';
  },
  /**
   * Details of the transfer.
   */
  details() {
    const transferId = FlowRouter.getParam("transferId");
    const transfer = Ethtransfers.findOne({ _id: transferId });
    const details = [];

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
        label: 'Used gas',
        value: transfer.gasUsed
      });
      details.push({
        label: 'Transaction Hash',
        value: transfer.transactionHash
      });
    } else {
      const error = Template.instance().data.error;

      details.push({
        label: 'Error',
        value: transfer.error
      });
    }

    return details;
  },
});
