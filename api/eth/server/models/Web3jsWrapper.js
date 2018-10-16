import Web3 from 'web3';
import { Meteor } from "meteor/meteor";
import { Ethaccounts } from '../../common/collections/collections';

export class Web3jsWrapper {
  /**
   * Web3jsWrapper.
   * 
   * Initialise Web3 object with platform-dependant parameters.
   * 
   * @param {*} httpProvider - Ethereum network.
   */
  constructor(httpProvider = Meteor.settings.NETWORK_URL) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(httpProvider));
    
    // ChainId is 3 for the test network ropsten. 
    this.chainId = Meteor.settings.NETWORK_CHAINID;
     // This is the contract deployed to the Eth network with the token info.
    this.tokenAddress = Meteor.settings.TOKEN_ADDRESS;
    
    let abiOfContract = Meteor.settings.TOKEN_ABI;
    abiOfContract = JSON.parse(abiOfContract);
    this.contract = new this.web3.eth.Contract(abiOfContract, this.tokenAddress);
  }

  /**
   * Get the Web3 instance.
   * 
   * @return {Object} - Web3 instance.  
   */
  getWeb3Instance() {
    return this.web3;
  }

  /**
   * Create an account in the ethereum network for an user.
   * 
   * @param {String} userId - Id of the user.
   *
   * @return {Object} - Created Ethereum account.  
   */
  createAccount(userId) {
    let account;

    try {
      account = this.web3.eth.accounts.create();
    } catch (error) {
      return {
        error: 1,
        message: `ERROR creating Ethereum account: ${error.message}`
      }
    }
    
    return this.associateAccount(userId, account);
  }

  /**
   * Associate an Ethereum account with an user.
   * 
   * @param {String} userId - Id of the user.
   *
   * @return {Object} - Created Ethereum account.
   */
  associateAccount(userId, account) {
    let accountData = {
      address: account.address,
      privateKey: account.privateKey,
      userId: userId
    };

    const existing = Ethaccounts.findOne({ address: account.address });
    if (existing) {
      return {
        error: 1,
        message: `ERROR associating Ethereum account to the user: The account already exist`
      }
    }

    let accountId = Ethaccounts.insert(accountData);
    if (!accountId) {
      return {
        error: 1,
        message: `ERROR associating Ethereum account: The account couldn't be persisted in DB`
      }
    }

    return {
      ...accountData,
      _id: accountId
    }
  } catch(error) {
    return {
      error: 1,
      message: `ERROR associating Eth account: ${error.message}`
    }
  }

  /**
   * Get the balance of an account.
   *
   * @param {String} account - Account address.
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
          reject(error);
          return;
        });
    });
  }
  
  /**
   * Transfer tokens between accounts.
   * 
   * @param {String} fromAccount - sender account address. It is required to have
   *  tokens and Ether.
   * @param {String} toAccount - recipient account address.
   * @param {String} amount - tokens to send.
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
