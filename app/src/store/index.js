import { createStore } from 'vuex';
import actions from './actions';

import config from '../config';

const store = createStore({
  state () {
    return {
      isWeb3Active: false,
      isMetaMaskInstalled: false,
      userBalance: 0,
      userAddress: '',
      tokenName: '',
      tokenSymbol: '',
      tokenDecimals: '',
      tokenTotalSupply: '',
      userTokenBalance: 0,
      presaleQrCodeImage: `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${config.PRESALE_CONTRACT_ADDRESS}&choe=UTF-8`,
      tokenContractAddress: config.TOKEN_CONTRACT_ADDRESS,
      presaleContractAddress: config.PRESALE_CONTRACT_ADDRESS,
      presaleContractClosingTime: '',
      presaleContractOpeningTime: '',
      presaleContractRate: 400,
      presaleContractCap: '',
      presaleContractMinimumContribution: 1,
      presaleContractMaximumContribution: 8,
      presaleContractVestingStartTime: '',
      presaleContractVestingCliffDuration: '',
      presaleContractVestingDuration: '',
      presaleContractVestingCliff: '',
      presaleVestingReleasableAmount: '',
      presaleContractVestingReleased: '',
      presaleContractVestedAmount: '',
      presaleContributedAmount: '',
      presaleContractRemainingTokens: '',
    }
  },
  getters: {
    hasVesting() {},
    presaleAmountPerNativeCoin(state) {
      return state.presaleContractRate * 1;
    },
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setGeneralData(state, payload) {
      state.presaleContractClosingTime = payload.closingTime;
      state.presaleContractOpeningTime = payload.openingTime;
      state.presaleContractRate = payload.rate;
      state.presaleContractCap = payload.cap;
      state.presaleContractMinimumContribution = payload.minimumContribution;
      state.presaleContractMaximumContribution = payload.maximumContribution;
      state.presaleContributedAmount = payload.contributedAmount;
    },
    setVestingData(state, payload) {
      state.presaleContractVestingStartTime = payload.vestingStartTime;
      state.presaleContractVestingCliffDuration = payload.vestingCliffDuration;
      state.presaleContractVestingDuration = payload.vestingDuration;
      state.presaleContractVestingCliff = payload.vestingCliff;
      state.presaleVestingReleasableAmount = payload.vestingReleasableAmount;
      state.presaleContractVestedAmount = payload.vestedAmount;
      state.presaleContractVestingReleased = payload.vestingReleased;
    },
    setTokenData(state, payload) {
      state.tokenName = payload.name;
      state.tokenSymbol = payload.symbol;
      state.tokenDecimals = payload.decimals;
      state.tokenTotalSupply = payload.totalSupply;
    },
    setUserTokenBalance(state, payload) {
      state.userTokenBalance = payload;
    },

    setUserAddress(state, payload) {
      state.userAddress = payload;
    },
    setUserNativeBalance(state, payload) {
      state.userBalance = payload;
    },
    setMetamaskInstalled(state, payload) {
      state.isMetaMaskInstalled = payload;
    },
    setWeb3Active(state, payload) {
      state.isWeb3Active = payload;
    }
  },
  actions
})

export default store