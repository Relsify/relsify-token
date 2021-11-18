const web3 = require('web3');
// const dotenv = require('dotenv');
// dotenv.config();

// console.log(process.env);
const RelsifyToken = artifacts.require('RelsifyToken');
const Presale = artifacts.require('Presale');
const PublicSale = artifacts.require('PublicSale');

function parseTimeForContract(date) {
  return date.getTime().toString().slice(0, 10);
}

// Presale configuration
const presaleConfig = {
  rate: 400,
  wallet: "0xf70B82b04d828106386D9AB916FAf0746E128aB7", // the wallet to recieve the BNB
  cap: web3.utils.toWei('7500000', 'ether'), // 7.5M of the tokens
  openingTime: parseTimeForContract(new Date(2021, 10, 28, 13)),
  closingTime: parseTimeForContract(new Date(2021, 11, 11, 23)),
  contribution: {
    minimum: web3.utils.toWei('1', 'ether'),
    maximum: web3.utils.toWei('8', 'ether'),
  },
  vesting: {
    startTime: parseTimeForContract(new Date(2021, 11, 11, 23)),
    cliffDuration: (60 * 60) * 24 * 7 * 2, // 2 weeks
    duration: (60 * 60) * 24 * 60, // 60 days
    isRevocable: false
  }
}

// Public Sale Configuration
const publicSaleConfig = {
  rate: 400,
  wallet: "0xf70B82b04d828106386D9AB916FAf0746E128aB7", // the wallet to recieve the BNB
  cap: web3.utils.toWei('20500000', 'ether'), // 20.5M of the tokens
  openingTime: parseTimeForContract(new Date(2021, 11, 12, 13)),
  closingTime: parseTimeForContract(new Date(2021, 11, 18, 23)),
  contribution: {
    minimum: web3.utils.toWei('0.1', 'ether'),
    maximum: web3.utils.toWei('30', 'ether'),
  },
}


module.exports = async function (deployer, network, accounts) {
  // Deploy the Relsify Token
  await deployer.deploy(RelsifyToken);

  // Get the instance of the deployed token
  const relsifyToken = await RelsifyToken.deployed();

  //Deploy the Presale Contract
  await deployer.deploy(
    Presale,
    presaleConfig.rate, // the rate in TKNbits
    presaleConfig.wallet, //wallet that will recieve ether
    relsifyToken.address, // Relsify token address
    presaleConfig.cap,
    presaleConfig.openingTime,
    presaleConfig.closingTime,
    presaleConfig.contribution.minimum,
    presaleConfig.contribution.maximum,
    presaleConfig.vesting.startTime,
    presaleConfig.vesting.cliffDuration,
    presaleConfig.vesting.duration,
    presaleConfig.vesting.isRevocable
  )

  //Get the presale instance
  const presaleInstance = await Presale.deployed();

  // Approve the tokens for Presale
   await relsifyToken.approve(presaleInstance.address, presaleConfig.cap);

  // Deploy the Public Sale Contract
  await deployer.deploy(
    PublicSale,
    publicSaleConfig.rate,
    publicSaleConfig.wallet,
    relsifyToken.address,
    publicSaleConfig.cap,
    publicSaleConfig.openingTime,
    publicSaleConfig.closingTime,
    publicSaleConfig.contribution.minimum,
    publicSaleConfig.contribution.maximum
  )

  // Get the Public sale intance
  const publicSaleInstance = await PublicSale.deployed();

  // Approve tokens for Public sale
  await relsifyToken.approve(publicSaleInstance.address, publicSaleConfig.cap);
  
};
