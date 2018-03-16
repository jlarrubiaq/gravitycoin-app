// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import Web3 from 'web3';
import { Links } from '../../api/links/links.js';

Meteor.startup(() => {
  // if the Links collection is empty
  if (Links.find().count() === 0) {
    const data = [
      {
        title: 'Do the Tutorial',
        url: 'https://www.meteor.com/try',
        createdAt: new Date(),
      },
      {
        title: 'Follow the Guide',
        url: 'http://guide.meteor.com',
        createdAt: new Date(),
      },
      {
        title: 'Read the Docs',
        url: 'https://docs.meteor.com',
        createdAt: new Date(),
      },
      {
        title: 'Discussions',
        url: 'https://forums.meteor.com',
        createdAt: new Date(),
      },
    ];

    data.forEach(link => Links.insert(link));
  }



    let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  console.log(web3);
  console.log( web3.eth.defaultAccount);



});
