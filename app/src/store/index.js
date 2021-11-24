import { createStore } from 'vuex';
import actions from './actions'

const store = createStore({
  state () {
    return {
      user: {}
    }
  },
  getters: {
    address() { },
    balance(){},
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    updateVesting() {},
  },
  actions
})

export default store