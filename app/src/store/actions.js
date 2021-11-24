import Moralis from '../plugins/moralis';

import PresaleABI from '../../../build/contracts/Presale.json';
// import RelsifyTokenABI from '../../../build/contracts/RelsifyToken.json'

import config from '../config';

const chain = 'bsc';
const contractOptions = {
    chain,
}

const presaleOptions = {
    ...contractOptions,
    address: config.PRESALE_CONTRACT_ADDRESS,
    abi: PresaleABI,
}

// const tokenOptions = {
//     ...contractOptions,
//     address: config.TOKEN_CONTRACT_ADDRESS,
//     abi: RelsifyTokenABI,
// }


export default  {
    async buyTokens(context, { beneficiary, amount }) {
        const options = {
            ...presaleOptions,
            function_name: "buyTokens",
            params: { beneficiary },
            msgValue: Moralis.Units.ETH(amount)
        };
        return Moralis.Web3API.native.runContractFunction(options);
    },
    async contributedAmount() { },
    async minimumContribution() { },
    async maximumContribution() { },
    async releaseTokensVested() { },
    async getTokenVestedContractAdrdress() { },
    async tokenVestingStartTime() { },
    async tokenVestingDuration() { },
    async tokenVestingCliffDuration() { },
    async tokenVestingCliff() { },
    async tokensVestedReleased() { },
    async tokensReleasableAmount() { },
    async tokensVestedAmount() { },
    async fetchUserBNBBalance() { },
    async fetchUserVestingDetails() { },
    async openingTime() { },
    async closingTime() { },
    async getOpeningAndClosingTime() { },
}