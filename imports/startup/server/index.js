import { Meteor } from 'meteor/meteor';
import Web3 from 'web3';

Meteor.startup(() => {

  let web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io'));
  //console.log(web3);
  console.log( web3.eth.defaultAccount);


  //console.log(web3.eth.getBalance('0xc5F5F7103431CcC1531B900CF70a7dA863522520').toNumber());

  // Reading tokens from account.
  let addr = '0xc5F5F7103431CcC1531B900CF70a7dA863522520';
  let contractAddr = '0x0d4d156bfa3fc1e5508e501774001bd0e1f6c722';
  let tknAddress = (addr).substring(2);

  let contractData = ('0x70a08231000000000000000000000000' + tknAddress);


  web3.eth.call({
    to: contractAddr,
    data: contractData
  }, function(err, result) {
    if (result) {
      //var tokens = result.toNumber();
      let tokens =  result;
      console.log(typeof tokens);
      console.log(parseInt(tokens, 16) + ' GTCs');
      //console.log('Tokens Owned: ' + web3.utils.fromWei(tokens, 'ether'));
    }
    else {
      console.log(err); // Dump errors here
    }
  });

});