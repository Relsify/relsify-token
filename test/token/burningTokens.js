const { expect, use } = require('chai')
const { solidity } = require('ethereum-waffle')
const provider = require('../provider')
const deployedToken = require('../functions/deployedToken');
const { BigNumber } = require('@ethersproject/bignumber');

use(solidity);

describe('Burning of Tokens', () => {
    let token;
    let wallets
    let deployerAddress;
    let commonUserAddress;
    let commonUserWallet;

    before(async () => {
        const deployedTokenInstance = await deployedToken();
        token = deployedTokenInstance;
        wallets = provider.getWallets()
        deployerAddress = wallets[0].address
        commonUserWallet = wallets[9]
        commonUserAddress = commonUserWallet.address;
    });

    it('Anybody can burn the tokens they have', async () => {
        const amount = 100
        await token.mint(commonUserAddress, amount)
        const totalSupply = BigNumber.from(await token.totalSupply())
        await token.transfer(commonUserAddress, amount)
        const commonUserBalance = BigNumber.from(await token.balanceOf(commonUserAddress));
        await token.connect(commonUserWallet).burn(amount)
        const afterCommonUserBalance = BigNumber.from(await token.balanceOf(commonUserAddress));
        const afterTotalSupply = BigNumber.from(await token.totalSupply());
        expect(afterTotalSupply.eq(totalSupply.sub(BigNumber.from(amount)))).to.be.true;
        expect(afterCommonUserBalance.eq(commonUserBalance.sub(BigNumber.from(amount)))).to.be.true;
    });


});