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
    async loadGeneralData({commit, state}) {
        try {
            const web3 = await Moralis.enableWeb3();
            const presaleContract = new web3.eth.Contract(PresaleABI.abi, config.PRESALE_CONTRACT_ADDRESS);
            const contributedAmount = await presaleContract.methods.contributedAmount().call({from: state.userAddress});
            const minimumContribution = await Moralis.executeFunction({ functionName: "minimumContribution", ...presaleOptions });
            const maximumContribution = await Moralis.executeFunction({ functionName: "maximumContribution", ...presaleOptions });
            const rate = await Moralis.executeFunction({ functionName: "rate", ...presaleOptions });
            const cap = await Moralis.executeFunction({ functionName: "cap", ...presaleOptions });
            const openingTime = await Moralis.executeFunction({ functionName: "openingTime", ...presaleOptions });
            const closingTime = await Moralis.executeFunction({ functionName: "closingTime", ...presaleOptions });
            const remainingTokens = await Moralis.executeFunction({ functionName: "remainingTokens", ...presaleOptions });
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
    async loadVestingData({ state, commit }) {
        try {
            const userAddress = state.userAddress;
            const web3 = await Moralis.enableWeb3();
            const presaleContract = new web3.eth.Contract(PresaleABI.abi, config.PRESALE_CONTRACT_ADDRESS);
            const tokenContract = new web3.eth.Contract(RelsifyTokenABI.abi, config.TOKEN_CONTRACT_ADDRESS);
            const vestingStartTime = await presaleContract.methods.tokenVestingStartTime().call({ from: userAddress });
            const vestingCliffDuration = await presaleContract.methods.tokenVestingCliffDuration().call({ from: userAddress });
            const vestingDuration = await presaleContract.methods.tokenVestingDuration().call({ from: userAddress });
            const vestingCliff = await presaleContract.methods.tokenVestingCliff().call({ from: userAddress });
            const vestingReleasableAmount = await presaleContract.methods.tokensVestedReleasableAmount().call({ from: userAddress });
            const vestingReleased = await presaleContract.methods.tokensVestedReleased().call({ from: userAddress });
            const vestedAmount = await presaleContract.methods.tokensVestedAmount().call({ from: userAddress });
            const vestingBalance = await tokenContract.methods.balanceOf(state.presaleContractVestingAddress).call();

            const vestingTotal = Number(Moralis.Units.FromWei(vestingBalance)) + Number(Moralis.Units.FromWei(vestingReleased))
            const vestedAmountInEth = Number(Moralis.Units.FromWei(vestedAmount));
            const data = {
                vestingStartTime: new Date(vestingStartTime * 1000),
                vestingCliffDuration: Number(vestingCliffDuration),
                vestingDuration: Number(vestingDuration),
                vestingCliff: new Date(vestingCliff * 1000),
                vestingReleasableAmount: Number(Moralis.Units.FromWei(vestingReleasableAmount)),
                vestedAmount: vestedAmountInEth,
                vestingReleased: Number(Moralis.Units.FromWei(vestingReleased)),
                vestingTotal: vestingTotal,
                vestingRemaining: vestingTotal - vestedAmountInEth,
            }
            console.log(data);

            commit('setVestingData', data);
            // console.log(vestingStartTime)
        } catch (error) {
            console.error(error);
        }
    },
    releaseVestedTokens() {
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
    async loadTokenVestingContractAddress({commit, state, getters, dispatch}) {
        try {
            const web3 = await Moralis.enableWeb3();
            const presaleContract = new web3.eth.Contract(PresaleABI.abi, config.PRESALE_CONTRACT_ADDRESS);
            const tokenVestedContractAddress = await presaleContract.methods.getTokenVesting().call({ from: state.userAddress });
            console.log(tokenVestedContractAddress);
            commit('setTokenVestingContractAddress', tokenVestedContractAddress);
            const hasVestingAccount = getters.hasVestingAccount;
            console.log(hasVestingAccount);
            console.log(await window.web3.eth.defaultAccount);
            if (hasVestingAccount) {
                await dispatch('loadVestingData');
            }
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
    async loadUserAddress({ commit }) {
        try {
            if (window.web3) {
                const userAddress = window.web3.eth.defaultAccount || window.web3.eth.accounts[0];
                commit('setUserAddress', userAddress);
            }
        } catch (error) {
            console.error(error);
        }
    },
    async loadUserNativeBalance({ commit, state }) {
        try {
            if (window.web3) {
                const balance = await window.web3.eth.getBalance(state.userAddress)
                const balanceFromWei = Moralis.Units.FromWei(balance);
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
    async loadNecessaryData({ state, dispatch }) {
        try {
            if (!state.userAddress) {
                await dispatch('loadUserAddress');
            }
            await dispatch('loadGeneralData');
            await dispatch('loadTokenData');
            await dispatch('loadTokenVestingContractAddress');
            await dispatch('loadUserTokenBalance');
            await dispatch('loadUserNativeBalance');
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