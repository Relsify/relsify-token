const { expect, use } = require('chai')
const { solidity } = require('ethereum-waffle')
const web3 = require('web3');

const provider = require('../provider')
const deployedToken = require('../functions/deployedToken');
const { BigNumber } = require('@ethersproject/bignumber');

use(solidity);

describe('Pausing of Token Transfer', () => {
    let token;
    let wallets
    let deployerAddress;
    let commonUserAddress;
    let commonUserWallet;

    before(async () => {
        const deployedTokenInstance = await deployedToken();
        token = deployedTokenInstance;
        wallets = provider.getWallets();
        deployerAddress = wallets[0].address
        commonUserWallet = wallets[9]
        commonUserAddress = commonUserWallet.address;
    });

    it('The deployer should be able to pause token transfer', async () => {
        expect(await token.hasRole(web3.utils.keccak256('PAUSER_ROLE'), deployerAddress)).to.equal(true);
    });

    it('When token is paused, transaction cannot take place', async () => {
        await token.mint(deployerAddress, 100);
        const commonUserBalance = BigNumber.from(await token.balanceOf(commonUserAddress))
        await token.pause();
        await expect(token.transfer(commonUserAddress, 50))
            .to.be.reverted;
        await token.unpause();
        await token.transfer(commonUserAddress, 50);
        const afterCommonUserBalance = BigNumber.from(await token.balanceOf(commonUserAddress))
        expect(afterCommonUserBalance).to.equal(commonUserBalance.add(BigNumber.from(50)));
    });

    it('A common user cannot pause tokens', async () => {
        await expect(token.connect(commonUserWallet).pause())
            .to.be.reverted;
    });

});