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
      presaleContractVestingAddress: '',
    }
  },
  getters: {
    hasVesting() {},
    presaleAmountPerNativeCoin(state) {
      return state.presaleContractRate * 1;
    },
    vesting(state) {
      const startTime = state.presaleContractVestingStartTime ? state.presaleContractVestingStartTime : new Date();
      let endTime;
      if (startTime && state.presaleContractVestingDuration) {
        endTime = new Date(startTime.getTime() + (Number(state.presaleContractVestingDuration) * 1000))
      }
      else {
        endTime = new Date()
       }
      const cliff = state.presaleContractVestingCliff ? new Date(state.presaleContractVestingCliff): new Date();
      return {
        startTime,
        endTime,
        cliff,
        released: state.presaleContractVestingReleased,
        vested: state.presaleContractVestedAmount,
        releasableAmount: state.presaleVestingReleasableAmount,
        address: state.presaleContractVestingAddress,
      }
    },
    formattedUserAddress(state) {
      if (state.userAddress.length > 10) {
        return state.userAddress.slice(0, 6) + '...' + state.userAddress.slice(-4);
      } else {
        return "";
      }
    },
    hasVestingAccount(state) {
      const condition = state.presaleContractVestingAddress !== ''
        && state.presaleContractVestingAddress !== '0x0000000000000000000000000000000000000000'
        && state.presaleContractVestingAddress !== '0x0000000000000000000000000000000000000000000000000000000000000000'
        && state.presaleContractVestingAddress.length >= 10;
      return condition;
    }
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
      console.log(payload)
    },
    setTokenVestingContractAddress(state, payload) {
      state.presaleContractVestingAddress = payload;
    },
    setVestingData(state, payload) {
      state.presaleContractVestingStartTime = payload.vestingStartTime;
      state.presaleContractVestingCliffDuration = payload.vestingCliffDuration;
      state.presaleContractVestingDuration = payload.vestingDuration;
      state.presaleContractVestingCliff = payload.vestingCliff;
      state.presaleVestingReleasableAmount = payload.vestingReleasableAmount;
      state.presaleContractVestedAmount = payload.vestedAmount;
      state.presaleContractVestingReleased = payload.vestingReleased;
      console.log(payload)
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