const { expect, use } = require('chai')
const { solidity } = require('ethereum-waffle')
const provider = require('../provider')
const deployedToken = require('../functions/deployedToken');
const { BigNumber } = require('@ethersproject/bignumber');
const web3 = require('web3');

const { keccak256 } = web3.utils;

use(solidity);

describe('Minting of Tokens', () => {
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

    it('The deployer should be a minter', async () => {
        expect(await token.hasRole(keccak256('MINTER_ROLE'), deployerAddress)).to.equal(true);
    });

    it('Minter should be able to mint tokens', async () => {
        const totalSupply = BigNumber.from(await token.totalSupply());
        const deployerBalance = BigNumber.from(await token.balanceOf(deployerAddress))
        const tokenAmount = BigNumber.from(100)
        await token.mint(deployerAddress, tokenAmount.toString())
        const deployerAfterBalance = BigNumber.from(await token.balanceOf(deployerAddress))
        const afterTotalSupply = BigNumber.from(await token.totalSupply());
        expect(afterTotalSupply).to.equal(totalSupply.add(tokenAmount));
        expect(deployerAfterBalance).to.equal(deployerBalance.add(tokenAmount));
    });

    it('A common holder should not be able to mint tokens', async () => {
        await expect(token.connect(commonUserWallet).mint(commonUserAddress, 100))
            .to.be.reverted;
    });


    it('Minter can not mint more than the capped amount', async () => {
        const cap = BigNumber.from(await token.cap());
        const totalSupply = BigNumber.from(await token.totalSupply());
        const remainingSupplyToCap = cap.sub(totalSupply)
        const increasedRemaining = remainingSupplyToCap.add(BigNumber.from(1));
        await expect(token.mint(deployerAddress, increasedRemaining.toString()))
            .to.be.revertedWith('Cap exceeded');
    });

});