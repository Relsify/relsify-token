import Moralis from '../plugins/moralis';

import PresaleABI from '../../../build/contracts/Presale.json';
import RelsifyTokenABI from '../../../build/contracts/RelsifyToken.json'

import config from '../config';

// const chain = 'bsc';
const contractOptions = {
    // chain,
}

const presaleOptions = {
    ...contractOptions,
    contractAddress: config.PRESALE_CONTRACT_ADDRESS,
    abi: PresaleABI.abi,
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
            functionName: "buyTokens",
            params: { beneficiary },
            msgValue: Moralis.Units.ETH(amount)
        };
        return Moralis.executeFunction(options);
    },
    async loadGeneralData({commit}) {
        try {
            const minimumContribution = await Moralis.executeFunction({ functionName: "minimumContribution", ...presaleOptions });
            const maximumContribution = await Moralis.executeFunction({ functionName: "maximumContribution", ...presaleOptions });
            const rate = await Moralis.executeFunction({ functionName: "rate", ...presaleOptions });
            const cap = await Moralis.executeFunction({ functionName: "cap", ...presaleOptions });
            const openingTime = await Moralis.executeFunction({ functionName: "openingTime", ...presaleOptions });
            const closingTime = await Moralis.executeFunction({ functionName: "closingTime", ...presaleOptions });
            const remainingTokens = await Moralis.executeFunction({ functionName: "remainingTokens", ...presaleOptions });
            const contributedAmount = await Moralis.executeFunction({ functionName: "contributedAmount", ...presaleOptions });
            commit('setGeneralData', {
                minimumContribution: Number(Moralis.Units.FromWei(minimumContribution)),
                maximumContribution: Number(Moralis.Units.FromWei(maximumContribution)),
                rate: Number(rate),
                cap: Number(Moralis.Units.FromWei(cap)),
                openingTime: new Date(openingTime * 1000),
                closingTime: new Date(closingTime * 1000),
                remainingTokens: Number(Moralis.Units.FromWei(remainingTokens)),
                contributedAmount: Number(Moralis.Units.FromWei(contributedAmount))
            });
        } catch (error) {
            console.error(error);
        }
    }, 
    async loadVestingData({ commit }) {
        try {
            const vestingStartTime = await Moralis.executeFunction({ functionName: "tokenVestingStartTime", ...presaleOptions });
            const vestingCliffDuration = await Moralis.executeFunction({ functionName: "tokenVestingCliffDuration", ...presaleOptions });
            const vestingDuration = await Moralis.executeFunction({ functionName: "tokenVestingDuration", ...presaleOptions });
            const vestingCliff = await Moralis.executeFunction({ functionName: "tokenVestingCliff", ...presaleOptions });
            const vestingReleasableAmount = await Moralis.executeFunction({ functionName: "tokensVestedReleasableAmount", ...presaleOptions });
            const vestingReleased = await Moralis.executeFunction({ functionName: "tokensVestedReleased", ...presaleOptions });
            const vestedAmount = await Moralis.executeFunction({ functionName: "tokensVestedAmount", ...presaleOptions });
            commit('setVestingData', {
                vestingStartTime: new Date(vestingStartTime * 1000),
                vestingCliffDuration: Number(vestingCliffDuration),
                vestingDuration: Number(vestingDuration),
                vestingCliff: new Date(vestingCliff * 1000),
                vestingReleasableAmount: Number(Moralis.Units.FromWei(vestingReleasableAmount)),
                vestedAmount: Number(Moralis.Units.FromWei(vestedAmount)),
                vestingReleased: Number(Moralis.Units.FromWei(vestingReleased))
            });
        } catch (error) {
            console.error(error);
        }
    },
    releaseTokensVested() {
        try {
            const options = {
                ...presaleOptions,
                functionName: "releaseVestedTokens",
            };
            return Moralis.executeFunction(options);
        }
        catch (error) {
            console.error(error);
        }
    },
    async getTokenVestingContractAdrdress() {
        try {
            const tokenVestedContractAddress = await Moralis.executeFunction({ functionName: "getTokenVesting", ...presaleOptions });
            return tokenVestedContractAddress;
        }
        catch (error) {
            console.error(error);
        }
    },
    async loadTokenData({ commit }) {
        try {
            const tokenContractAddress = await Moralis.executeFunction({ functionName: "token", ...presaleOptions });
            const tokenContract = Moralis.Web3API.getContract(RelsifyTokenABI.abi, tokenContractAddress);
            const name = await tokenContract.methods.name().call();
            const symbol = await tokenContract.methods.symbol().call();
            const decimals = await tokenContract.methods.decimals().call();
            const totalSupply = await tokenContract.methods.totalSupply().call();
            commit('setTokenData', {
                name,
                symbol,
                decimals,
                totalSupply: Number(Moralis.Units.FromWei(totalSupply)),
            });
        } catch (error) {
            console.error(error);
        }
    },
    // On check
    async loadTokenBalance({ commit }, address) {
        try {
            const tokenContractAddress = await Moralis.executeFunction({ functionName: "token", ...presaleOptions });
            const tokenContract = Moralis.Web3API.getContract(RelsifyTokenABI.abi, tokenContractAddress);
            const balance = await tokenContract.methods.balanceOf(address).call();
            commit('setTokenBalance', {
                balance: Number(Moralis.Units.FromWei(balance))
            });
        } catch (error) {
            console.error(error);
        }
    },
    // On check
    async loadTokenAllowance({ commit }, address) {
        try {
            const tokenContractAddress = await Moralis.executeFunction({ functionName: "token", ...presaleOptions });
            const tokenContract = Moralis.Web3API.getContract(RelsifyTokenABI.abi, tokenContractAddress);
            const allowance = await tokenContract.methods.allowance(address, config.PRESALE_CONTRACT_ADDRESS).call();
            commit('setTokenAllowance', {
                allowance: Number(Moralis.Units.FromWei(allowance))
            });
        } catch (error) {
            console.error(error);
        }
    },
    // Working on Safety
    async ensureChainSafety({ commit }) {
        try {
            const chainId = await Moralis.Web3API.getChainId();
            if (chainId !== config.CHAIN_ID) {
                 await Moralis.addNetwork({
                    chainId: config.CHAIN_ID,
                    chainName: config.CHAIN_NAME,
                    currencyName: config.CURRENCY_NAME,
                    currencySymbol: config.CURRENCY_SYMBOL,
                    rpcUrl,
                    blockExplorerUrl
                })
                const chainIdHex = await Moralis.switchNetwork(config.CHAIN_ID);
            }
        } catch (error) {
            console.error(error);
        }
    }
}