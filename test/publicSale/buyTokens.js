const { BigNumber } = require('@ethersproject/bignumber');
const { expect, use } = require('chai')
const { solidity } = require('ethereum-waffle')

const { parseTimeForContract, wait } = require('../functions/functions')
const deployPublicSale = require('../functions/deployPublicSale');
const { parseEther } = require('@ethersproject/units');
const provider = require('../provider');

use(solidity);

const minimumContribution = parseEther('1').toString();
const maximumContribution = parseEther('10').toString();

const createOpenedPublicSale = async (options = {}) => {
    const openingTime = new Date(Date.now() + 2000); // adding a second
    const anHourTime = new Date(openingTime.getTime() + (1000 * 60 * 60));
    const openedCrowdsale = await deployPublicSale({
        openingTime: parseTimeForContract(openingTime).toString(),
        closingTime: parseTimeForContract(anHourTime).toString(),
        minimumContribution,
        maximumContribution,
        ...options
    });
    await wait(2000);
    return openedCrowdsale;
}

// This is to create a distraction to make the blockchain to create a new block
const createDistraction = async (wallets) => {
    await wallets[5].sendTransaction({
        value: parseEther('0.05').toHexString(),
        to: wallets[6].address
    })
}

describe('Buying of Public Sale tokens', () => {

    it('The owner of the crowdsale should be the deployer', async () => {
        const { publicSale, wallets } = await deployPublicSale();
        const ownerWallet = wallets[0];
        expect(await publicSale.owner()).to.equal(ownerWallet.address);
    });

    it('User should be able to buy tokens by just sending Ether', async () => {
        const { token, wallets, publicSale } = await createOpenedPublicSale();
        const ownerWallet = wallets[0];
        const aUserWallet = wallets[4];
        const aUserWalletInitialTokenBalance = BigNumber.from(await token.balanceOf(aUserWallet.address));
        await token.connect(ownerWallet).approve(publicSale.address, parseEther('10000000').toString());
        await aUserWallet.sendTransaction({
            to: publicSale.address,
            value: parseEther('2').toHexString()
        });
        const aUserWalletFinalTokenBalance = BigNumber.from(await token.balanceOf(aUserWallet.address));
        expect(aUserWalletFinalTokenBalance.gt(aUserWalletInitialTokenBalance) ).to.be.true;
    }).timeout(5000)

    it('User can buy when the crowdsale is open', async () => {
        const { token, wallets, publicSale } = await createOpenedPublicSale();
        const ownerWallet = wallets[0];
        commonUserWallet = wallets[9];
        await token.connect(ownerWallet).approve(publicSale.address, parseEther('10000000').toString())
        expect(await publicSale.isOpen()).to.be.true;
        const commonUserWalletInitialTokenBalance = BigNumber.from(await token.balanceOf(commonUserWallet.address));
        await publicSale.connect(commonUserWallet).buyTokens(commonUserWallet.address, { value: parseEther('2').toString() });
        const commonUserWalletFinalTokenBalance = BigNumber.from(await token.balanceOf(commonUserWallet.address));
        expect(commonUserWalletFinalTokenBalance.gt(commonUserWalletInitialTokenBalance)).to.be.true;
    }).timeout(5000)

    it('User can not buy when the crowdsale has ended', async () => {
        const openingTime = new Date(Date.now() + 2000); // adding a second
        const twoSecondsLater = new Date(openingTime.getTime() + (1000 * 2));
        // For Ended Crowdsale, you will have to wait for more than 2 seconds
        const createdEndedCrowdsale = await deployPublicSale({
            openingTime: parseTimeForContract(openingTime).toString(),
            closingTime: parseTimeForContract(twoSecondsLater).toString(),
            minimumContribution: parseEther('1').toString()
        });
        await wait(4000);
        const { token, wallets, publicSale } = createdEndedCrowdsale;
        commonUserWallet = wallets[9];
        await wait(1000);
        await createDistraction(wallets);
        expect(await publicSale.isOpen()).to.be.false;
        const hasClosed = await publicSale.hasClosed();
        expect(hasClosed).to.be.true;
        await expect(publicSale.connect(commonUserWallet).buyTokens(commonUserWallet.address, { value: parseEther('2').toString() }))
            .to.be.revertedWith("Crowdsale not open");
    }).timeout(7000)

    it('User can only buy within the maximum and minimum contribution', async () => {
        const { token, wallets, publicSale } = await createOpenedPublicSale();
        commonUserWallet = wallets[9];
        await createDistraction(wallets);
        expect(await publicSale.isOpen()).to.be.true;
        await expect(publicSale.connect(commonUserWallet).buyTokens(commonUserWallet.address, { value: parseEther('0.5').toString() }))
            .to.be.revertedWith("Contribution must be between minimum and maximum");
        await expect(publicSale.connect(commonUserWallet).buyTokens(commonUserWallet.address, { value: parseEther('12').toString() }))
            .to.be.revertedWith("Contribution must be between minimum and maximum");
    }).timeout(5000)

    it('Only owner can change the maximum and minimum contribution', async () => {
        const { publicSale, wallets } = await deployPublicSale();
        const ownerWallet = wallets[0]
        const commonUserWallet = wallets[1];

        const userMinimumContribution = parseEther('1').toString();
        const userMaximumContribution = parseEther('10').toString()
        const ownerMaximumContribution = parseEther('21').toString();
        const ownerMinimumContribution = parseEther('11').toString();

        await expect(publicSale.connect(commonUserWallet).setMinimumContribution(userMinimumContribution))
            .to.be.reverted;
        await expect(publicSale.connect(commonUserWallet).setMaximumContribution(userMaximumContribution))
            .to.be.reverted;
        
        await publicSale.connect(ownerWallet).setMaximumContribution(ownerMaximumContribution);
        await publicSale.connect(ownerWallet).setMinimumContribution(ownerMinimumContribution);
        const fetchedMinimumContribution = BigNumber.from(await publicSale.minimumContribution());
        const fetchedMaximimContribution = BigNumber.from(await publicSale.maximumContribution())

        expect(fetchedMinimumContribution.eq(BigNumber.from(ownerMinimumContribution))).to.be.true;
        expect(fetchedMaximimContribution.eq(BigNumber.from(ownerMaximumContribution))).to.be.true;
    }).timeout(5000)

    it('Can be extended, when the crowdsale is opened ', async () => {
        const { token, wallets, publicSale } = await createOpenedPublicSale();
        const extendedToFourHoursTime = parseTimeForContract(new Date(Date.now() + (1000 * 60 * 60 * 4)));
        const extendedToSixHoursTime = parseTimeForContract(new Date(Date.now() + (1000 * 60 * 60 * 6)));
        const ownerWallet = wallets[0]
        commonUserWallet = wallets[9];
        await createDistraction(wallets);
        await expect(publicSale.connect(commonUserWallet).extendTime(extendedToFourHoursTime))
            .to.be.reverted;
        await publicSale.connect(ownerWallet).extendTime(extendedToSixHoursTime);
        expect('extendTime').to.be.calledOnContractWith(publicSale, [extendedToSixHoursTime]);
        const closingTime = BigNumber.from(await publicSale.closingTime()).toString()
        expect(extendedToSixHoursTime).to.eql(closingTime);

    }).timeout(5000)

    it('Crowdsales cannot exceed the cap', async () => {
        const rate = 1000;
        const cap = parseEther('6');
        const toMintAmount = cap.add(BigNumber.from(1)).mul(BigNumber.from(rate));
        const maximumContribution = parseEther('4').toString()
        const toApproveAmount = cap.mul(BigNumber.from(rate))
        const { token, wallets, publicSale } = await createOpenedPublicSale({
            rate,
            cap: cap.toString(),
            maximumContribution
        });
        const ownerWallet = wallets[0];
        const user1Wallet = wallets[9];
        const user2Wallet = wallets[8];

        await token.mint(ownerWallet.address, toMintAmount.toString())
        await token.approve(publicSale.address, toApproveAmount.toString() )
        
        await publicSale.connect(user1Wallet).buyTokens(user1Wallet.address, { value: maximumContribution})

        await expect(publicSale.connect(user2Wallet).buyTokens(user2Wallet.address, { value: maximumContribution }))
            .to.be.revertedWith("Cap exceeded");
    }).timeout(7000)

    it('Crowdsale owner should be able to withdraw ether', async () => {
        const wallets = await provider.getWallets();
        const ownerWallet = wallets[0];
        const reciever = wallets[7];
        const amountUsed = parseEther('2');
        const { token, publicSale } = await createOpenedPublicSale({
            wallet: reciever.address
        });
        const recieverInitialBalance = await reciever.getBalance();
        await token.mint(ownerWallet.address, parseEther('10000').toString())
        await token.approve(publicSale.address, parseEther('10000').toString())
        const user1Wallet = wallets[9];
        await publicSale.connect(user1Wallet).buyTokens(user1Wallet.address, { value: amountUsed.toString() });
        await createDistraction(wallets); // Create a distraction
        const recieverFinalBalance = await reciever.getBalance();
        expect(recieverFinalBalance.gt(recieverInitialBalance)).to.be.true;
    }).timeout(7000)


});