import Web3 from 'web3';

export class Web3jsWrapper {
  constructor(httpProvider = "https://ropsten.infura.io") {
    this.web3js = new Web3(new Web3.providers.HttpProvider(httpProvider));

    return this.web3js;
  }
}