import Moralis from '../plugins/moralis';

import PresaleABI from '../../../build/contracts/Presale.json';
import RelsifyTokenABI from '../../../build/contracts/RelsifyToken.json'

import config from '../config';

const {CHAIN } = config;
// const chain = 'bsc';
const contractOptions = {
    // chain,
}

const presaleOptions = {
    ...contractOptions,
    contractAddress: config.PRESALE_CONTRACT_ADDRESS,
    abi: PresaleABI.abi,
}

const tokenOptions = {
    ...contractOptions,
    contractAddress: config.TOKEN_CONTRACT_ADDRESS,
    abi: RelsifyTokenABI.abi,
}


export default  {
    buyTokens(context, { beneficiary, amount }) {
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
            const data = {
                minimumContribution: Number(Moralis.Units.FromWei(minimumContribution)),
                maximumContribution: Number(Moralis.Units.FromWei(maximumContribution)),
                rate: Number(rate),
                cap: Number(Moralis.Units.FromWei(cap)),
                openingTime: new Date(openingTime * 1000),
                closingTime: new Date(closingTime * 1000),
                remainingTokens: Number(Moralis.Units.FromWei(remainingTokens)),
                contributedAmount: Number(Moralis.Units.FromWei(contributedAmount))
            };
            commit('setGeneralData', data);
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
            const name = await Moralis.executeFunction({ functionName: "name", ...tokenOptions });
            const symbol = await Moralis.executeFunction({ functionName: "symbol", ...tokenOptions });
            const decimals = await Moralis.executeFunction({ functionName: "decimals", ...tokenOptions });
            const totalSupply = await Moralis.executeFunction({ functionName: "totalSupply", ...tokenOptions });
            const data = {
                name,
                symbol,
                decimals,
                totalSupply: Number(Moralis.Units.FromWei(totalSupply)),
            }
            commit('setTokenData', data);
        } catch (error) {
            console.error(error);
        }
    },
    async loadUserNativeBalance({ commit, state }) {
        try {
            if (window.web3) {
                const balance = await window.web3.eth.getBalance(state.userAddress)
                const balanceFromWei = Moralis.Units.FromWei(balance);
                console.log(balanceFromWei);
                commit('setUserNativeBalance', balanceFromWei);
            }
        } catch (error) {
            console.error(error);
        }
    },
    async loadUserTokenBalance({ commit, state }) {
        try {
            const options = { functionName: "balanceOf", ...tokenOptions, params: { account: state.userAddress } };
            const balance = await Moralis.executeFunction(options);
            commit('setUserTokenBalance', Number(Moralis.Units.FromWei(balance)));
        } catch (error) {
            console.error(error);
        }
    },
    async onAccountChange({ commit, dispatch }, address) {
        try {
            commit('setUserAddress', address);
            dispatch('loadUserNativeBalance');
            dispatch('loadUserTokenBalance');
        } catch (error) {
            console.error(error);
        }
    },
    // Working on Making sure they are using the right Chain
    async ensureChainSafety() {
        try {
            const chainId = await Moralis.Web3API.getChainId();
            if (chainId !== CHAIN.ID) {
                 await Moralis.addNetwork({
                    chainId: CHAIN.ID,
                    chainName: CHAIN.NAME,
                    currencyName: CHAIN.CURRENCY_NAME,
                    currencySymbol: CHAIN.CURRENCY_SYMBOL,
                    rpcUrl: CHAIN.RPC_URL,
                    blockExplorerUrl: CHAIN.BLOCK_URL,
                })
                 await Moralis.switchNetwork(CHAIN);
            }
        } catch (error) {
            console.error(error);
        }
    }
}