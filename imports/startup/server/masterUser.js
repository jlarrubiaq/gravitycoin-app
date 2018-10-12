// import { Ethaccounts } from '../../../api/eth/common/collections/collections';
// import { Meteor } from 'meteor/meteor';
// import { Accounts } from 'meteor/accounts-base';
// import { Web3jsWrapper } from '../../../api/eth/server/models/Web3jsWrapper';
// import fs from 'fs';

// /**
//  * 
//  */
// export function createMasterUser() {
//   let privateKey;
//   const privateKeyFile = Meteor.settings.MASTER_ACCOUNT_PRIVATEKEY_FILE;
//   const keystoreFile = Meteor.settings.MASTER_ACCOUNT_KEYSTORE_FILE;
//   const keystorePasswordFile = Meteor.settings.MASTER_ACCOUNT_PASSWORD_FILE;

//   const web3 = new Web3jsWrapper();

//   if (privateKeyFile) {
//     privateKey = fs.readFileSync(privateKeyFile);
//   } else if (keystoreFile && keystorePasswordFile) {
//     const keystoreAccount = fs.readFileSync(keystoreFile);
//     const keystorePassword = fs.readFileSync(keystorePasswordFile);
//     privateKey = this.getWeb3Instance().eth.accounts.decrypt(keystoreAccount, keystorePassword);
//   } else {
//     throw new Error('ERROR creating Master: Not found definition data.');
//   }

//   const userId = Accounts.createUser({
//     username: 'admin',
//     email: 'admin@admin.com',
//     password: 'password'
//   }, error => {
//     if (error){
//       throw new Error(`ERROR creating Master user: ${error.message}.`);
//     } else {
//       const account = web3.createAccount(userId);

//       if (account.error) {
//         return {
//           error: 1,
//           message: account.message,
//         }
//       }
//     }
//   });


// }
