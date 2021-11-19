const web3 = require('web3');

const { isBN, BN} = web3.utils;
console.log(new BN('4000000000').add(new BN(1)).toNumber())