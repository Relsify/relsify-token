const { BigNumber } = require('@ethersproject/bignumber');
const { expect, use } = require('chai')
const { solidity } = require('ethereum-waffle')

const { parseTimeForContract } = require('../functions/functions')
const deployPresale = require('../functions/deployPresale');
const { parseEther, parseUnits } = require('@ethersproject/units');
const provider = require('../provider');

use(solidity);

const minimumContribution = parseEther('1').toString();
const maximumContribution = parseEther('10').toString();

const wait = function (ms = 2000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, ms);
    });
}

const createOpenedPresale = async (presaleOptions = {}) => {
    const openingTime = new Date(Date.now() + 2000); // adding a second
    const anHourTime = new Date(openingTime.getTime() + (1000 * 60 * 60));
    const openedCrowdsale = await deployPresale({
        openingTime: parseTimeForContract(openingTime).toString(),
        closingTime: parseTimeForContract(anHourTime).toString(),
        minimumContribution,
        maximumContribution,
        ...presaleOptions
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

describe('Buying of Presale tokens', () => {

    it('The owner of the presale should be the deployer', async () => {
        const { presale, wallets } = await deployPresale();
        const ownerWallet = wallets[0];
        expect(await presale.owner()).to.equal(ownerWallet.address);
    });

    it('User should be able to buy tokens by just sending Ether', async () => {
        const { token, wallets, presale } = await createOpenedPresale();
        const ownerWallet = wallets[0];
        const aUserWallet = wallets[4]
        await token.connect(ownerWallet).approve(presale.address, parseEther('10000000').toString());
        await aUserWallet.sendTransaction({
            to: presale.address,
            value: parseEther('2').toHexString()
        });
        const vestingAddress = await presale.connect(aUserWallet).getTokenVesting();
        const vestingAddressBalance = BigNumber.from(await token.balanceOf(vestingAddress));
        expect(vestingAddressBalance.gt(BigNumber.from(0))).to.be.true;
    }).timeout(5000)

    it('User can only buy when the crowdsale is open', async () => {
        const { token, wallets, presale } = await createOpenedPresale();
        const ownerWallet = wallets[0];
        commonUserWallet = wallets[9];
        await token.connect(ownerWallet).approve(presale.address, parseEther('10000000').toString())
        expect(await presale.isOpen()).to.be.true;
        await presale.connect(commonUserWallet).buyTokens(commonUserWallet.address, { value: parseEther('2').toString() });
        const vestingAddress = await presale.connect(commonUserWallet).getTokenVesting();
        const vestingAddressBalance = BigNumber.from(await token.balanceOf(vestingAddress))
        expect(vestingAddressBalance.gt(BigNumber.from(0))).to.be.true;
    }).timeout(5000)

    it('User can not buy when the crowdsale has ended', async () => {
        const openingTime = new Date(Date.now() + 2000); // adding a second
        const twoSecondsLater = new Date(openingTime.getTime() + (1000 * 2));
        // For Ended Crowdsale, you will have to wait for more than 2 seconds
        const createdEndedCrowdsale = await deployPresale({
            openingTime: parseTimeForContract(openingTime).toString(),
            closingTime: parseTimeForContract(twoSecondsLater).toString(),
            minimumContribution: parseEther('1').toString()
        });
        await wait(4000);
        const { token, wallets, presale } = createdEndedCrowdsale;
        commonUserWallet = wallets[9];
        await wait(1000);
        await createDistraction(wallets);
        expect(await presale.isOpen()).to.be.false;
        const hasClosed = await presale.hasClosed();
        expect(hasClosed).to.be.true;
        await expect(presale.connect(commonUserWallet).buyTokens(commonUserWallet.address, { value: parseEther('2').toString() }))
            .to.be.revertedWith("Crowdsale not open");
    }).timeout(7000)

    it('User can only buy within the maximum and minimum contribution', async () => {
        const { token, wallets, presale } = await createOpenedPresale();
        commonUserWallet = wallets[9];
        await createDistraction(wallets);
        expect(await presale.isOpen()).to.be.true;
        await expect(presale.connect(commonUserWallet).buyTokens(commonUserWallet.address, { value: parseEther('0.5').toString() }))
            .to.be.revertedWith("Contribution must be between minimum and maximum");
        await expect(presale.connect(commonUserWallet).buyTokens(commonUserWallet.address, { value: parseEther('12').toString() }))
            .to.be.revertedWith("Contribution must be between minimum and maximum");
    }).timeout(5000)

    it('Only owner can change the maximum and minimum contribution', async () => {
        const { presale, wallets } = await deployPresale();
        const ownerWallet = wallets[0]
        const commonUserWallet = wallets[1];

        const userMinimumContribution = parseEther('1').toString();
        const userMaximumContribution = parseEther('10').toString()
        const ownerMaximumContribution = parseEther('21').toString();
        const ownerMinimumContribution = parseEther('11').toString();

        await expect(presale.connect(commonUserWallet).setMinimumContribution(userMinimumContribution))
            .to.be.reverted;
        await expect(presale.connect(commonUserWallet).setMaximumContribution(userMaximumContribution))
            .to.be.reverted;
        
        await presale.connect(ownerWallet).setMaximumContribution(ownerMaximumContribution);
        await presale.connect(ownerWallet).setMinimumContribution(ownerMinimumContribution);
        const fetchedMinimumContribution = BigNumber.from(await presale.minimumContribution());
        const fetchedMaximimContribution = BigNumber.from(await presale.maximumContribution())

        expect(fetchedMinimumContribution.eq(BigNumber.from(ownerMinimumContribution))).to.be.true;
        expect(fetchedMaximimContribution.eq(BigNumber.from(ownerMaximumContribution))).to.be.true;
    }).timeout(5000)

    it('Can be extended, when the crowdsale is opened ', async () => {
        const { token, wallets, presale } = await createOpenedPresale();
        const extendedToFourHoursTime = parseTimeForContract(new Date(Date.now() + (1000 * 60 * 60 * 4)));
        const extendedToSixHoursTime = parseTimeForContract(new Date(Date.now() + (1000 * 60 * 60 * 6)));
        const ownerWallet = wallets[0]
        commonUserWallet = wallets[9];
        await createDistraction(wallets);
        await expect(presale.connect(commonUserWallet).extendTime(extendedToFourHoursTime))
            .to.be.reverted;
        await presale.connect(ownerWallet).extendTime(extendedToSixHoursTime);
        expect('extendTime').to.be.calledOnContractWith(presale, [extendedToSixHoursTime]);
        const closingTime = BigNumber.from(await presale.closingTime()).toString()
        expect(extendedToSixHoursTime).to.eql(closingTime);

    }).timeout(5000)

    it('User account is vested for the required time and can be released', async () => {
        const openingTime = new Date(Date.now() + 2000); // adding two second
        const fiveSecondsLater = new Date(openingTime.getTime() + (1000 * 5));
        const sixSecondsLater = new Date(openingTime.getTime() + (1000 * 6));
        // For Ended Crowdsale, you will have to wait for more than 2 seconds
        const createdCrowdsale = await deployPresale({
            openingTime: parseTimeForContract(openingTime),
            closingTime: parseTimeForContract(fiveSecondsLater),
            minimumContribution: parseEther('1').toString(),
            vestingStartTime: parseTimeForContract(sixSecondsLater),
            vestingCliffDuration: Number(3).toString(),
            vestingDuration: Number(6).toString(),
        });

        /**
         * With this configuratiom
         * at 2 seconds - Crowdsale started
         * at 7 seconds - Crowdsale ended
         * at 8 seconds - Vesting started
         * at 11 seconds - Cliff started
         * at 14 seconds - Duration Ended
         * 
         */
        const { token, wallets, presale } = createdCrowdsale;
        const ownerWallet = wallets[0]
        const commonUserWallet = wallets[9];

        await wait(2000); // Time needed for Crowdsale to start
        let openingPeriod = Date.now();

        //Owner mint tokens and approve Crowdsale to use them
        await token.connect(ownerWallet).mint(ownerWallet.address, parseEther('1000000').toString());
        await token.connect(ownerWallet).approve(presale.address, parseEther('1000000').toString());

        await createDistraction(wallets);

        const commonUserBalance = BigNumber.from(await token.balanceOf(commonUserWallet.address))
        // const presaleOpeningTime = (await presale.openingTime()).toString();
        // const presaleClosingTime = (await presale.closingTime()).toString()

        // console.log('Openign time ', presaleOpeningTime);
        // console.log('Closing Time ', presaleClosingTime);
        // console.log('Current Time', parseTimeForContract(Date.now()))

        //Common user buys when open and has a vesting account
        expect(await presale.isOpen()).to.be.true;
        await createDistraction(wallets);
        await presale.connect(commonUserWallet).buyTokens(commonUserWallet.address, { value: parseEther('2').toString() });
        const vestingAddress = await presale.connect(commonUserWallet).getTokenVesting();
        const vestingAddressBalance = BigNumber.from(await token.balanceOf(vestingAddress))
        expect(vestingAddressBalance.gt(BigNumber.from(0))).to.be.true;
        const tokensVested = BigNumber.from(await presale.connect(commonUserWallet).tokensVestedAmount());
        expect(tokensVested.eq(BigNumber.from(0))).to.be.true;
        
        // Crowdsale closed
        await wait(6000 - (Date.now() - openingPeriod )); // Time Needed for Crodsale to be closed
        let closedPeriod = Date.now()
        await createDistraction(wallets);

        expect(await presale.isOpen()).to.be.false;
        expect(await presale.hasClosed()).to.be.true;

        // The startTime of vesting started
        // await wait(1000 - (Date.now() - closedPeriod));
        let vestingStartTimePeriod = Date.now();
        await createDistraction(wallets);
        // Should not be able to release tokens at this period

        expect(Number(parseTimeForContract(Date.now())) <= Number((await presale.connect(commonUserWallet).tokenVestingCliff()).toString())).to.be.true;
        await expect(presale.connect(commonUserWallet).releaseTokenVested())
            .to.be.reverted;

        // The Cliff Should start
        await wait(3000 - (Date.now() - vestingStartTimePeriod))
        let cliffStartTimePeriod = new Date();
        await presale.connect(commonUserWallet).releaseTokenVested();
        expect('releaseTokenVested').to.be.calledOnContract(presale);
        const afterInitalReleaseBalance = BigNumber.from(await token.balanceOf(commonUserWallet.address))
        expect(afterInitalReleaseBalance.gt(commonUserBalance)).to.be.true;

        // Vesting Duration Ended
        await wait(4000 - (Date.now() - cliffStartTimePeriod));
        await createDistraction(wallets);
        await presale.connect(commonUserWallet).releaseTokenVested();
        expect('releaseTokenVested').to.be.calledOnContract(presale);
        const afterFinalReleaseBalance = BigNumber.from(await token.balanceOf(commonUserWallet.address))
        expect(afterFinalReleaseBalance.gt(afterInitalReleaseBalance)).to.be.true;
    }).timeout(20000)

    it('Crowdsales cannot exceed the cap', async () => {
        const rate = 1000;
        const cap = parseEther('6');
        const toMintAmount = cap.add(BigNumber.from(1)).mul(BigNumber.from(rate));
        const maximumContribution = parseEther('4').toString()
        const toApproveAmount = cap.mul(BigNumber.from(rate))
        const { token, wallets, presale } = await createOpenedPresale({
            rate,
            cap: cap.toString(),
            maximumContribution
        });
        const ownerWallet = wallets[0];
        const user1Wallet = wallets[9];
        const user2Wallet = wallets[8];

        await token.mint(ownerWallet.address, toMintAmount.toString())
        await token.approve(presale.address, toApproveAmount.toString() )
        
        await presale.connect(user1Wallet).buyTokens(user1Wallet.address, { value: maximumContribution})

        await expect(presale.connect(user2Wallet).buyTokens(user2Wallet.address, { value: maximumContribution }))
            .to.be.revertedWith("Cap exceeded");
    }).timeout(7000)

    it('Crowdsale owner should be able to withdraw ether', async () => {
        const wallets = await provider.getWallets();
        const ownerWallet = wallets[0];
        const reciever = wallets[7];
        const amountUsed = parseEther('2');
        const { token, presale } = await createOpenedPresale({
            wallet: reciever.address
        });
        const recieverInitialBalance = await reciever.getBalance();
        await token.mint(ownerWallet.address, parseEther('10000').toString())
        await token.approve(presale.address, parseEther('10000').toString())
        const user1Wallet = wallets[9];
        await presale.connect(user1Wallet).buyTokens(user1Wallet.address, { value: amountUsed.toString() });
        await createDistraction(wallets); // Create a distraction
        const recieverFinalBalance = await reciever.getBalance();
        const user1WalletFinalBalance = await user1Wallet.getBalance();
        expect(recieverFinalBalance.gt(recieverInitialBalance)).to.be.true;
    }).timeout(7000)


});