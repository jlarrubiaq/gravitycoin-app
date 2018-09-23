import Web3 from 'web3';

export class Web3jsWrapper {
  constructor(httpProvider = "https://ropsten.infura.io") {
    this.web3 = new Web3(new Web3.providers.HttpProvider(httpProvider));
    this.tokenAddress = '0x0d4d156bfa3fc1e5508e501774001bd0e1f6c722';
  }

  getAccountBalance(account) {
    return new Promise((resolve, reject) => {
      let tknAddress = (account).substring(2);
      let contractData = ('0x70a08231000000000000000000000000' + tknAddress);

      this.web3.eth.call({
        to: this.tokenAddress,
        data: contractData
      }, function(err, result) {
        if (result) {
          let tokens =  result;
          resolve(parseInt(tokens, 16));
        }
        else {
          console.log(err); // Dump errors here
          reject(err);
          return;
        }
      });
    });
  }

  getWeb3Instance() {
    return this.web3;
  }
}