<template>
  <div>
    <div class="container d-flex align-items-center min-vh-100">
      <div class="row g-0 justify-content-center">
        <!-- TITLE -->
        <!-- TITLE -->
        <div class="col-lg-4 offset-lg-1 mx-0 px-0">
          <div id="title-container">
            <a href="https://relsify.com" class=""
              ><img class="covid-image" src="./assets/images/relsify.png"
            /></a>
            <h3>Pre Sale</h3>
            <br />
            <p>Fiil in the form to purchase our Pre-sale tokens</p>
          </div>
        </div>
        <!-- FORMS -->
        <div class="col-lg-7 mx-0 px-0">
          <div class="progress">
            <div
              aria-valuemax="100"
              aria-valuemin="0"
              aria-valuenow="50"
              class="
                progress-bar progress-bar-striped progress-bar-animated
                bg-danger
              "
              role="progressbar"
              style="width: 0%"
            ></div>
          </div>
          <div id="qbox-container">
            <form
              class="needs-validation"
              id="form-wrapper"
              method="post"
              name="form-wrapper"
              novalidate=""
            >
              <div id="steps-container">
                <div class="step">
                  <div class="mt-1">
                    <h4 style="margin-bottom: 0px">Buy Rels Token</h4>
                    <div class="closing-text">
                      <p>
                        Connect your wallet, input the amount you want to purchase, then click on the
                        "Buy RELS Token" button to continue. Kindly note, your RELS token will be vested over a period of time.
                      </p>
                    </div>
                    <h4>1 BNB = {{presaleAmountPerNativeCoin}} RELS token</h4>
                    <div v-if="isWeb3Active">
                        <table class="center">
                          <tr>
                            <td>Address: </td>
                            <td>{{formattedUserAddress}}</td>
                          </tr>
                          <tr>
                            <td>BNB Balance: </td>
                            <td>{{Number(userBalance).toFixed(3)}} BNB</td>
                          </tr>
                          <tr>
                            <td> Amount Contributed:  </td>
                            <td> {{Number(presaleContributedAmount).toFixed(3)}} BNB</td>
                          </tr>
                        </table>
                        <br>
                    </div>
                  </div>

                  <div class="mt-1" id="section-1" v-if="section1Toggle">
                    <div class="row">
                      <div class="col-lg-12" style="margin-bottom: 20px">
                        <div class="form-group row">
                          <label
                            for="staticEmail"
                            class="col-sm-4 col-form-label"
                            >BNB</label
                          >
                          <div class="col-sm-6 input-group mb-2 mr-sm-2">
                            <input
                              type="number"
                              class="form-control"
                              id="bnb-input-value"
                              min="8.3"
                              v-model="nativeCoinAmount"
                              @keyup="onNativeCoinAmountChange"
                              placeholder="Amount"
                            />
                            <div class="input-group-prepend">
                              <div class="input-group-text">BNB</div>
                            </div>
                          </div>
                        </div>
                        <div class="form-group row">
                          <label
                            for="inputPassword"
                            class="col-sm-4 col-form-label"
                            >RELS Token</label
                          >
                          <div class="col-sm-6 input-group mb-2 mr-sm-2">
                            <input
                              type="number"
                              class="form-control"
                              id="rels-input-value"
                              v-model="tokenAmount"
                              @keyup="onTokenAmountChange"
                              placeholder="Token Amount"
                            />
                            <div class="input-group-prepend">
                              <div class="input-group-text">RELS</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="q-box__buttons"  v-if="isWeb3Active">
                      <button id="buy-token-button" @click="buyTokens">Buy RELS Token</button>
                    </div>
                    <div id="q-box__buttons" v-if="!isWeb3Active">
                      <button id="connect-metamask-button"  @click="connectWeb3">Connect using Metamask</button>
                      <button id="connect-walletconnect-button" @click="connectWalletConnect">Connect using Walletconnect</button>
                    </div>
                    <div id="q-box__buttons" v-if="!isWeb3Active">
                      <button class="btn btn-outline-primary btn-lg btn-block" id="connect-no-wallet"  @click="buyWithoutWeb3">Buy without using Web3 </button>
                    </div>
                  </div>

                  <!--- Section 2-->
                  <div class="mt-1" id="section-2" v-if="section2Toggle">
                    <div class="closing-text" style="margin-top: 0px">
                      <p>
                        Send the required amount of BNB to purchase you RELS
                        token.
                      </p>
                    </div>
                    <img
                      class="center"
                      :src="presaleQrCodeImage"
                    />

                    <table class="table">
                      <tbody>
                        <tr>
                          <td>BNB Address</td>
                          <td>
                            <div class="input-group">
                              <input
                                type="text"
                                class="form-control"
                                id="bnb-address-input-copy"
                                disabled
                                placeholder="address"
                                :value="presaleContractAddress"
                                aria-describedby="inputGroupPrepend"
                              /> 
                              <div class="input-group-prepend">
                                <span class="input-group-text">
                                  <button
                                    id="bnb-address-copy-button"
                                    data-clipboard-text="{{presaleContractAddress}}"
                                    v-clipboard:copy="presaleContractAddress"
                                    v-clipboard:success="onPresaleContractAddressCopy"
                                    @click="onPresaleContractAddressCopy"
                                    style="
                                      padding: 0px;
                                      border: 0px solid;
                                      margin: 0px;
                                    "
                                  >
                                    Copy
                                  </button>
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>Amount</td>
                          <td id="ammount-in-bnb">{{nativeCoinAmount}} BNB (Smart Chain)</td>
                        </tr>
                        <tr>
                          <td>Time remaining</td>
                          <td>
                            <span id="time-remaining">{{displayTimer}} </span> mins remaining
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div id="q-box__buttons">
                      <button id="btn-go-back-button" @click="goBackButton">Go Back</button>
                      <button
                        id="done-button"
                        data-toggle="modal"
                        data-target="#thanks-modal"
                        @click="doneButton"
                      >
                        Done
                      </button>
                    </div>
                  </div>


                  <!--- Section 3-->
                  <div class="mt-1" id="section-2" v-if="isWeb3Active && hasVestingAccount">
                    <div class="closing-text" style="margin-top: 20px">
                     <h4>Vesting Destails</h4>
                    </div>
                    <table class="table">
                      <tbody>
                        <tr>
                          <td>Vesting Address: </td>
                          <td>{{vesting.address}} </td>
                        </tr>
                        <tr>
                          <td>Start Date: </td>
                          <td> {{vesting.startTime}}</td>
                        </tr>
                        <tr>
                          <td>Cliff: </td>
                          <td> {{vesting.cliff}} </td>
                        </tr>
                        <tr>
                          <td>End Date: </td>
                          <td> {{vesting.endTime}} </td>
                        </tr>
                        <tr>
                          <td>Vested: </td>
                          <td> {{vesting.vested}} RELS</td>
                        </tr>
                        <tr>
                          <td>Already Released: </td>
                          <td> {{vesting.released}} RELS</td>
                        </tr>
                        <tr>
                          <td>Releasable Amount: </td>
                          <td> {{vesting.releasableAmount}} RELS <button id="release-vesting-button" @click="releaseVestedTokens">Release Vesting</button> </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>

    <div id="preloader-wrapper">
      <div id="preloader"></div>
      <div class="preloader-section section-left"></div>
      <div class="preloader-section section-right"></div>
    </div>
  </div>
</template>

<script>
import { onMounted, inject, computed, ref } from "vue";
import { useStore } from "vuex";
import Swal from 'sweetalert2'

export default {
  name: "App",
  setup() {
    const store = useStore();
    const $moralis = inject("$moralis");

    const setUserAddress = (payload) => store.commit("setUserAddress", payload);
    const setMetamaskInstalled = (payload) => store.commit("setMetamaskInstalled", payload);
    const setWeb3Active = (payload) => store.commit("setWeb3Active", payload);

    const presaleAmountPerNativeCoin = computed(() => store.getters.presaleAmountPerNativeCoin );
    const presaleContractAddress = computed(() => store.state.presaleContractAddress );
    const presaleQrCodeImage = computed(() => store.state.presaleQrCodeImage );
    const minimumContribution = computed(() => store.state.presaleContractMinimumContribution)
    const maximumContribution = computed(() => store.state.presaleContractMaximumContribution)
    const isWeb3Active =  computed(() => store.state.isWeb3Active);
    const isMetamaskInstalled = computed(() => store.state.isMetamaskInstalled);

    const nativeCoinAmount = ref(store.state.presaleContractMinimumContribution);
    const tokenAmount = ref(nativeCoinAmount.value * presaleAmountPerNativeCoin.value);

    const section1Toggle = ref(true);
    const section2Toggle = ref(false);

    const displayTimer = ref(0);

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    const connectWeb3 = async ($event) => {
      $event.preventDefault();
      const isMetaMaskInstalled= await $moralis.isMetaMaskInstalled();
      setMetamaskInstalled(isMetaMaskInstalled)
      if(isMetaMaskInstalled){
         window.web3 = await $moralis.enableWeb3();
         const userAddress = (await window.web3.eth.getAccounts())[0];
         setUserAddress(userAddress)
        const isWeb3Active = $moralis.ensureWeb3IsInstalled();
        setWeb3Active(isWeb3Active)
        if (!isWeb3Active) {
          await $moralis.enable();
          const isWeb3Active = $moralis.ensureWeb3IsInstalled();
          setWeb3Active(isWeb3Active);
          if (setWeb3Active) {
            await store.dispatch("loadNecessaryData");
          } else {
            Toast.fire({
            icon: 'error',
            title: 'Could not connect to Metamask'
          })
          }
        } else {
          await store.dispatch("loadNecessaryData");
        }
      } else {
        Toast.fire({
          icon: 'error',
          title: 'Please install Metamask'
        })
      }
    };

    const connectWalletConnect = async ($event) => {
       $event.preventDefault();
      window.web3 = await $moralis.enableWeb3({
      provider: "walletconnect",
      mobileLinks: [
        "rainbow",
        "metamask",
        "argent",
        "trust",
        "imtoken",
        "pillar",
      ]
      });
      setUserAddress((await window.web3.eth.getAccounts())[0])
      const isWeb3Active = $moralis.ensureWeb3IsInstalled()
      setWeb3Active(isWeb3Active);
      if (!isWeb3Active) {
        await $moralis.enable();
        const isWeb3Active = $moralis.ensureWeb3IsInstalled();
        setWeb3Active(isWeb3Active);
        if (isWeb3Active) {
          await store.dispatch("loadNecessaryData");
        } else {
          Toast.fire({
            icon: 'error',
            title: 'Could not connect to Wallet Connect'
          })
        }
      } else {
        await store.dispatch("loadNecessaryData");
      }
    }

    const safeToBuy  = computed(() => {
      if(!isWeb3Active.value){
        return false;
      }
      if(!isMetamaskInstalled.value){
        return false;
      }
      if(nativeCoinAmount.value < minimumContribution.value){
        return false;
      }
      if(nativeCoinAmount.value > maximumContribution.value){
        return false;
      }
      return true;
    })

    const checkSafetoBuyAndCreateAlert = () => {
      const amount = nativeCoinAmount.value;
      if (Number(amount) > Number(maximumContribution.value)) {
        Toast.fire({
          icon: 'error',
          title: 'Maximum Contribution is ' + maximumContribution.value + ' BNB'
        })
        return false;
      } else if (Number(amount) < Number(minimumContribution.value)) {
        Toast.fire({
          icon: 'error',
          title: 'Minimum Contribution is ' + minimumContribution.value + ' BNB'
        });
        return false;
      } else {
        return true;
      }
    }

    const buyTokens = async ($event) => {
      $event.preventDefault();
      const amount = nativeCoinAmount.value;
      const beneficiary = store.state.userAddress;
      const safeCheck = checkSafetoBuyAndCreateAlert();
      if (safeCheck) {
        try {
          Swal.fire({
              html: '<h5>Loading...</h5>',
              showConfirmButton: false,
          });
          await store.dispatch("buyTokens", { amount, beneficiary });
          Swal.fire({
            icon: 'success',
            title: 'RELS bought successfully',
            text: `You have successfully purchase ${tokenAmount.value} RELS token`
          })
          store.dispatch("loadNecessaryData");
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occured'
          })
        }
      }
      
    }

    const releaseVestedTokens = async ($event) => {
      try {
        $event.preventDefault();
        await store.dispatch("releaseVestedTokens");
        Toast.fire({
          icon: 'success',
          title: 'Token has been released to your account'
        });
        store.dispatch("loadNecessaryData");
      } catch(error) {
        console.error(error)
        Toast.fire({
          icon: 'error',
          title: 'An error occured'
        })
      }
    }
  
    const onTokenAmountChange = async ($event) => {
      nativeCoinAmount.value = Number($event.target.value) / presaleAmountPerNativeCoin.value;
    }

    const onNativeCoinAmountChange = async ($event) => {
      tokenAmount.value = Number($event.target.value) * presaleAmountPerNativeCoin.value;
    }

    const onPresaleContractAddressCopy = async ($event) => {
      $event.preventDefault();
      window.navigator.clipboard.writeText(store.state.presaleContractAddress);
      Toast.fire({
        icon: 'success',
        title: 'Address copied successfully'
      })
    }

    const moveToSection1 = () => {
      section1Toggle.value = true;
      section2Toggle.value = false;
    }

    const moveToSection2 = () => {
      section1Toggle.value = false;
      section2Toggle.value = true;
    }

    const goBackButton = async ($event) => {
      $event.preventDefault();
      moveToSection1();
    }

    const doneButton = async ($event) => {
      $event.preventDefault();
      Swal.fire({
        title: 'Congratulations',
        text:  `
        Congratulations for purchasing RELS tokens. Kindly
        note your tokens will be vested over a period of time. And the
        token will be released to the same BNB address you used
        to purchase the RELS token. Have a nice day
        `,
        icon: 'success',
      })
      moveToSection1();
    }

    const buyWithoutWeb3 = ($event) => {
       $event.preventDefault();
      const safeCheck = checkSafetoBuyAndCreateAlert();
        if (safeCheck) {
          moveToSection2();
          startTimer(60 * 15, displayTimer);
        }
    }

    let previousTimer;

    const startTimer = (duration, displayTimer) => {
    var timer = duration, minutes, seconds;
    if (previousTimer) {
        clearInterval(previousTimer);
    }
    previousTimer = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        displayTimer.value = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

    onMounted(() => {
      if (isWeb3Active.value) {
        store.dispatch("loadNecessaryData");
      }
    });

    return {
      connectWeb3,
      connectWalletConnect,
      presaleContractAddress,
      tokenAmount,
      nativeCoinAmount,
      onTokenAmountChange,
      onNativeCoinAmountChange,
      presaleAmountPerNativeCoin,
      buyTokens,
      buyWithoutWeb3,
      releaseVestedTokens,
      presaleQrCodeImage,
      onPresaleContractAddressCopy,
      isWeb3Active,
      isMetamaskInstalled,
      goBackButton,
      doneButton,
      moveToSection1,
      moveToSection2,
      section1Toggle,
      section2Toggle,
      safeToBuy,
      displayTimer,
      formattedUserAddress: computed(() => store.getters.formattedUserAddress),
      // isAuthenticated: computed(() => Object.keys(store.state.user).length > 0),
      user: computed(() => store.state.user),
      userBalance: computed(() => store.state.userBalance),
      userAddress: computed(() => store.state.userAddress),
      presaleContributedAmount: computed(() => store.state.presaleContributedAmount),
      vesting: computed(() => store.getters.vesting),
      hasVestingAccount: computed(() => store.getters.hasVestingAccount),
    };
  },
};
</script>

<style>
* {
  margin: 0;
  box-sizing: border-box;
}
html,
body,
#app {
  /* height: 100%; */
  display: block;
}

.text-center {
  text-align: center;
}
.text-moralis-green {
  color: #b7e803;
}
.text-moralis-gray {
  color: #041836;
}
.mt-4 {
  margin-top: 20px;
}
.mt-1 {
  margin-top: 4px;
}
.mt-10 {
  margin-top: 40px;
}
.text-xl {
  font-size: 28px;
}
.text-base {
  font-size: 16px;
}
.font-semibold {
  font-weight: 600;
}

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* GENERAL */

body {
  background: #f7f9ff;
  font-family: "Josefin Sans", sans-serif;
  font-size: 16px;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  color: #555;
  padding: 50px;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: #00011c;
}

p {
  margin-bottom: 24px;
  line-height: 1.9;
}

label {
  font-size: 16px;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: #00011c;
}

/* TITLE */

#title-container {
  min-height: 460px;
  height: 100%;
  color: #fff;
  background-color: #10cb6c;
  text-align: center;
  padding: 105px 28px 28px 28px;
  box-sizing: border-box;
  position: relative;
  box-shadow: 10px 8px 21px 0px rgba(204, 204, 204, 0.75);
  -webkit-box-shadow: 10px 8px 21px 0px rgba(204, 204, 204, 0.75);
  -moz-box-shadow: 10px 8px 21px 0px rgba(204, 204, 204, 0.75);
  background-image: url(http://relsify.com/wp-content/uploads/2021/10/Parallax-Background-Dark-03.jpg?id=1060) !important;
}

#title-container h2 {
  font-size: 45px;
  font-weight: 800;
  color: #fff;
  padding: 0;
  margin-bottom: 0px;
}

#title-container h3 {
  font-size: 25px;
  font-weight: 600;
  color: whitesmoke;
  padding: 0;
}

#title-container p {
  font-size: 16px;
  padding: 0 25px;
  line-height: 20px;
}

.covid-image {
  width: 214px;
  margin-bottom: 15px;
}

/* FORMS */

#qbox-container {
  background-repeat: repeat;
  position: relative;
  padding: 62px;
  min-height: 630px;
  box-shadow: 10px 8px 21px 0px rgba(204, 204, 204, 0.75);
  -webkit-box-shadow: 10px 8px 21px 0px rgba(204, 204, 204, 0.75);
  -moz-box-shadow: 10px 8px 21px 0px rgba(204, 204, 204, 0.75);
}

#steps-container {
  margin: auto;
  width: 500px;
  min-height: 420px;
  display: flex;
  vertical-align: middle;
  align-items: center;
}

/* .step {
    display: none;
} */

.step h4 {
  margin: 0 0 26px 0;
  padding: 0;
  position: relative;
  font-weight: 500;
  font-size: 23px;
  font-size: 1.4375rem;
  line-height: 1.6;
}

button#prev-btn,
button#next-btn,
#buy-token-button,
#btn-go-back-button,
#connect-metamask-button,
#connect-walletconnect-button,
#done-button,
button#submit-btn {
  font-size: 17px;
  font-weight: bold;
  position: relative;
  width: 200px;
  height: 60px;
  background: #10cb6c;
  margin: 10px;
  /* margin-top: 40px; */
  overflow: hidden;
  z-index: 1;
  cursor: pointer;
  transition: color 0.3s;
  text-align: center;
  color: #fff;
  border: 0;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
}

button#prev-btn:after,
button#next-btn:after,
button#submit-btn:after {
  position: absolute;
  top: 90%;
  left: 0;
  width: 100%;
  height: 100%;
  background: #10cb6c;
  content: "";
  z-index: -2;
  transition: transform 0.3s;
}

button#prev-btn:hover::after,
button#next-btn:hover::after,
button#submit-btn:hover::after {
  transform: translateY(-80%);
  transition: transform 0.3s;
}

#btn-go-back-button {
  background-color: orange;
  color: #00011c;
}

.progress {
  border-radius: 0px !important;
}

.q__question {
  position: relative;
}

.q__question:not(:last-child) {
  margin-bottom: 10px;
}

.question__input {
  position: absolute;
  left: -9999px;
}

.question__label {
  position: relative;
  display: block;
  line-height: 40px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  background-color: #fff;
  padding: 5px 20px 5px 50px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.question__label:hover {
  border-color: #10cb6c;
}

.question__label:before,
.question__label:after {
  position: absolute;
  content: "";
}

.question__label:before {
  top: 12px;
  left: 10px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: inset 0 0 0 1px #ced4da;
  -webkit-transition: all 0.15s ease-in-out;
  -moz-transition: all 0.15s ease-in-out;
  -o-transition: all 0.15s ease-in-out;
  transition: all 0.15s ease-in-out;
}

.question__input:checked + .question__label:before {
  background-color: #10cb6c;
  box-shadow: 0 0 0 0;
}

.question__input:checked + .question__label:after {
  top: 22px;
  left: 18px;
  width: 10px;
  height: 5px;
  border-left: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(-45deg);
}

.form-check-input:checked,
.form-check-input:focus {
  background-color: #10cb6c !important;
  outline: none !important;
  border: none !important;
}

input:focus {
  outline: none;
}

#input-container {
  display: inline-block;
  box-shadow: none !important;
  margin-top: 36px !important;
}

label.form-check-label.radio-lb {
  margin-right: 15px;
}

#q-box__buttons {
  text-align: center;
}

input[type="text"],
input[type="email"] {
  padding: 8px 14px;
}

input[type="text"]:focus,
input[type="email"]:focus {
  border: 1px solid #10cb6c;
  border-radius: 5px;
  outline: 0px !important;
  -webkit-appearance: none;
  box-shadow: none !important;
  -webkit-transition: all 0.15s ease-in-out;
  -moz-transition: all 0.15s ease-in-out;
  -o-transition: all 0.15s ease-in-out;
  transition: all 0.15s ease-in-out;
}

.form-check-input:checked[type="radio"],
.form-check-input:checked[type="radio"]:hover,
.form-check-input:checked[type="radio"]:focus,
.form-check-input:checked[type="radio"]:active {
  border: none !important;
  -webkit-outline: 0px !important;
  box-shadow: none !important;
}

.form-check-input:focus,
input[type="radio"]:hover {
  box-shadow: none;
  cursor: pointer !important;
}

#success {
  display: none;
}

#success h4 {
  color: #10cb6c;
}

.back-link {
  font-weight: 700;
  color: #10cb6c;
  text-decoration: none;
  font-size: 18px;
}

.back-link:hover {
  color: #10cb6c;
}

/* PRELOADER */

#preloader-wrapper {
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: none;
  position: fixed;
  top: 0;
  left: 0;
}

#preloader {
  /* background-image: url('../img/preloader.png'); */
  width: 120px;
  height: 119px;
  border-top-color: #fff;
  border-radius: 100%;
  display: block;
  position: relative;
  top: 50%;
  left: 50%;
  margin: -75px 0 0 -75px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
  z-index: 1001;
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

#preloader-wrapper .preloader-section {
  width: 51%;
  height: 100%;
  position: fixed;
  top: 0;
  background: #f7f9ff;
  z-index: 1000;
}

#preloader-wrapper .preloader-section.section-left {
  left: 0;
}

#preloader-wrapper .preloader-section.section-right {
  right: 0;
}

.loaded #preloader-wrapper .preloader-section.section-left {
  transform: translateX(-100%);
  transition: all 0.7s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.loaded #preloader-wrapper .preloader-section.section-right {
  transform: translateX(100%);
  transition: all 0.7s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.loaded #preloader {
  opacity: 0;
  transition: all 0.3s ease-out;
}

.loaded #preloader-wrapper {
  visibility: hidden;
  transform: translateY(-100%);
  transition: all 0.3s 1s ease-out;
}

/* MEDIA QUERIES */

@media (min-width: 990px) and (max-width: 1199px) {
  #title-container {
    padding: 80px 28px 28px 28px;
  }

  #steps-container {
    width: 85%;
  }
}

@media (max-width: 991px) {
  #title-container {
    padding: 30px;
    min-height: inherit;
  }
}

@media (max-width: 767px) {
  #qbox-container {
    padding: 30px;
  }

  #steps-container {
    width: 100%;
    min-height: 400px;
  }

  #title-container {
    padding-top: 50px;
  }
}

@media (max-width: 560px) {
  #qbox-container {
    padding: 40px;
  }

  #title-container {
    padding-top: 45px;
  }
}

.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}

.table {
  margin-top: 20px;
}

#section-2 {
  display: block;
}

.alert-info {
  display: none;
}

#release-vesting-button {
  margin-left: 10px;
  padding: 5px;
  border: 1px solid orange;
  border-radius: 5px;
  background-color: orange;
  color: #00011c;
}

#release-vesting-button:hover {
  border: 1px solid #10cb6c;
  background-color: #10cb6c;
  color: whitesmoke;
}

#connect-no-wallet {
  color: #10cb6c;
  border: 1px solid #10cb6c;
}
#connect-no-wallet:hover {
  background-color: #10cb6c;
  color: whitesmoke;
  border: 1px solid #10cb6c;
}
</style>
