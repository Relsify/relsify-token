const { deployContract} = require('ethereum-waffle')
const RelsifyToken = require('../../build/contracts/RelsifyToken.json')

const provider = require('../provider');

const firstwallet = provider.getWallets()[0]

module.exports = async function () {
    const token = await deployContract(firstwallet, RelsifyToken)
    return token;
}
