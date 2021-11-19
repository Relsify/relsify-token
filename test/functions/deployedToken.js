const { deployContract} = require('ethereum-waffle')
const RelsifyToken = require('../../build/contracts/RelsifyToken.json')

const provider = require('../provider');

const firstwallet = provider.getWallets()[0]

module.exports = function() {
    return new Promise((resolve, reject) => {
        deployContract(firstwallet, RelsifyToken)
            .then((token) => resolve(token))
            .catch(err => reject(err))
    })
}
