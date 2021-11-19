const { expect, use } = require('chai')
const { solidity } = require('ethereum-waffle')

const provider = require('../provider')
const deployedToken = require('../functions/deployedToken')

use(solidity);


describe('Basic token test', () => {
    let token;
    let wallets
    before(async () => {
        const deployedTokenInstance = await deployedToken();
        token = deployedTokenInstance;
        wallets = provider.getWallets()
    });

    it('Token should be called Relsify Token', async () => {
        // console.log(token)
        // expect(await token.owner()).to.equal(wallets[0].address);
        expect(await token.name()).to.equal('RelsifyToken');
    });

    it('Token should have symbol RELS', async () => {
        expect(await token.symbol()).to.equal('RELS');
    });

});