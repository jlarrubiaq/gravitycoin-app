import Web3 from 'web3';

export class Web3jsWrapper {
  /**
   * 
   * @param {*} httpProvider 
   */
  constructor(httpProvider = "https://ropsten.infura.io", chainId = 3) {
    // @todo: Get this info from config file!
    this.web3 = new Web3(new Web3.providers.HttpProvider(httpProvider));
    // ChainId is 3 for the test network ropsten. 
    this.chainId = chainId;

     // This is the contract deployed to the Eth network with the token info.
    this.tokenAddress = '0x12760DFC8a36ed044F6Cca4d89154bD002d0C13A';
    
    let abiOfContract = `[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeSub","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeDiv","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"},{"name":"data","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeMul","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferAnyERC20Token","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeAdd","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenOwner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Approval","type":"event"}]`;
    abiOfContract = JSON.parse(abiOfContract);
    this.contract = new this.web3.eth.Contract(abiOfContract, this.tokenAddress);
  }

  /**
   * Get a Web3 instance.
   */
  getWeb3Instance() {
    return this.web3;
  }

  /**
   * Get the balance of an account.
   *
   * @param {*} account - Account address.
   * 
   * @returns {Promise<number>} - The account balance.
   */
  getAccountBalance(account) {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .balanceOf(account)
        .call({from: this.tokenAddress})
        .then(data => {
          resolve(data)
        })
        .catch(error => {
          console.log(error); // Dump errors here
          reject(error);
          return;
        });
    });
  }
  
  /**
   * Transfer tokens between accounts.
   * 
   * @param {*} fromAccount - sender account address. It is required to have
   *  tokens and Ether.
   * @param {*} toAccount - recipient account address.
   * @param {*} amount - tokens to send.
   * 
   * @returns {Promise<Object>} - The transaction receipt.
   */
  transferFrom(fromAccount, toAccount, amount, privateKey) {
    let gasLimit, gasPrice;
    
    return new Promise((resolve, reject) => {
      this.web3.eth.estimateGas({
        from: fromAccount,
            to: this.tokenAddress,
            chainId: this.chainId,
            data : this.contract.methods.transfer(toAccount, amount).encodeABI()
      })
      .then(estimatedGas => {
        gasLimit = estimatedGas * 2;

        return this.web3.eth.getGasPrice()
      })
      .then(price => {
        gasPrice = price;
        
        return this.web3.eth.getTransactionCount(fromAccount);
      })
      .then(count => {
        return this.web3.eth.accounts.privateKeyToAccount(privateKey).signTransaction({
          from: fromAccount,
          to: this.tokenAddress,
          value: '0x0',
          gasPrice: this.web3.utils.toHex(gasPrice),
          gasLimit: this.web3.utils.toHex(gasLimit),
          nonce: "0x" + count.toString(16),
          chainId: this.chainId,
          data : this.contract.methods.transfer(toAccount, amount).encodeABI()
        });
      })
      .then(transaction =>  {
        this.web3.eth.sendSignedTransaction(transaction.rawTransaction)
          .on('receipt', (receipt) => {
          // console.log('Transfer transaction finished succesfully:', receipt);
          resolve(receipt);
        })
        .on('error', error => {
          // console.log('ERROR in transfer transaction:', error.message);
          reject(error.message);
        });
      })
      .catch(error => {
        reject(error.message);
      });
    });
  }
}
