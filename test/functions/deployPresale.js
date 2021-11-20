const { deployContract } = require('ethereum-waffle')
const web3 = require('web3');
const PresaleContractABI = require('../../build/contracts/Presale.json')
const { parseTimeForContract } = require('./functions')
const deployedToken = require('./deployedToken')
const provider = require('../provider');

const wallets = provider.getWallets();
const firstwallet = wallets[0];

module.exports = async function (options = {}) {
    const presaleConfig = {
        rate: 400,
        wallet: firstwallet.address, // the wallet to recieve the BNB
        tokenWallet: firstwallet.address,
        cap: web3.utils.toWei('7500000', 'ether'), // 7.5M of the tokens
        openingTime: parseTimeForContract(new Date(2021, 10, 28, 13)),
        closingTime: parseTimeForContract(new Date(2021, 11, 11, 23)),
        minimumContribution: web3.utils.toWei('1', 'ether'),
        maximumContribution: web3.utils.toWei('8', 'ether'),
        vestingStartTime: parseTimeForContract(new Date(2021, 11, 11, 23)),
        vestingCliffDuration: (60 * 60) * 24 * 7 * 2, // 2 weeks
        vestingDuration: (60 * 60) * 24 * 60, // 60 days
        ...options
    }
    const { rate, wallet, tokenWallet, cap, openingTime, closingTime,
        minimumContribution, maximumContribution, vestingStartTime, vestingCliffDuration, vestingDuration
    } = presaleConfig;

    // console.log(`Opening time: ${openingTime}`);
    // console.log(`Closing time: ${closingTime}`);

    const token = await deployedToken();
    const configArr = [rate, wallet, token.address, tokenWallet, cap, openingTime, closingTime,
        minimumContribution, maximumContribution, vestingStartTime, vestingCliffDuration, vestingDuration
    ]
    const presale = await deployContract(firstwallet, PresaleContractABI, configArr)
    return { presale, token, wallets };
}
