const { expect, use } = require('chai')
const { solidity } = require('ethereum-waffle')
const web3 = require('web3');

const provider = require('../provider')
const deployedToken = require('../functions/deployedToken');
const { BigNumber } = require('@ethersproject/bignumber');

use(solidity);

describe('Freezing of Token account', () => {
    let token;
    let wallets;
    let deployerAddress;
    let commonUserAddress;
    let commonUserWallet;
    let badUserWallet;
    let badUserAddress

    before(async () => {
        const deployedTokenInstance = await deployedToken();
        token = deployedTokenInstance;
        wallets = provider.getWallets();
        deployerAddress = wallets[0].address
        commonUserWallet = wallets[9]
        badUserWallet = wallets[8]
        badUserAddress = badUserWallet.address;
        commonUserAddress = commonUserWallet.address;

    });

    it('The deployer should be able to freeze an account', async () => {
        expect(await token.hasRole(web3.utils.keccak256('ASSET_PROTECT_ROLE'), wallets[0].address))
            .to.equal(true);
    });

    it('A frozen account can not perform any transactions', async () => {
        await token.mint(deployerAddress, 500);
        await token.transfer(badUserAddress, 100);
        const badUserBalance = BigNumber.from(await token.balanceOf(badUserAddress));
        await token.transfer(commonUserAddress, 100);

        // When the badUser account is frozen
        await token.freeze(badUserAddress);
        await expect(token.connect(badUserWallet).transfer(commonUserAddress, 50))
            .to.be.revertedWith('Address frozen');
        await expect(token.connect(badUserWallet).approve(commonUserAddress, 50))
            .to.be.revertedWith('Address frozen');
        await expect(token.connect(commonUserWallet).transfer(badUserAddress, 50))
            .to.be.revertedWith('Address frozen');
        expect(await token.isFrozen(badUserAddress)).to.be.true;

        // When the badUser account is Unfrozen
        await token.unfreeze(badUserAddress);
        await token.connect(badUserWallet).transfer(commonUserAddress, 20);
        await token.connect(commonUserWallet).transfer(badUserAddress, 70);
        const badUserAfterBalance = BigNumber.from(await token.balanceOf(badUserAddress));

        const supposedBadUserBalance = badUserBalance.sub(BigNumber.from(20)).add(BigNumber.from(70))
        expect(badUserAfterBalance.eq(supposedBadUserBalance)).to.be.true;

    });

    it('A common user cannot freeze an account', async () => {
        await expect(token.connect(commonUserWallet).freeze(badUserAddress))
            .to.be.reverted;
    });

});