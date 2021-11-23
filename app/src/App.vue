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
            <h3>Private Sale</h3>
            <br />
            <p>Fiil in the form to purchase our private sale tokens</p>
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
                    <!-- Modal -->
                    <div
                      class="modal fade"
                      id="thanks-modal"
                      tabindex="-1"
                      role="dialog"
                      aria-labelledby="exampleModalCenterTitle"
                      aria-hidden="true"
                    >
                      <div
                        class="modal-dialog modal-dialog-centered"
                        role="document"
                      >
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">
                              Congratulations!
                            </h5>
                            <button
                              type="button"
                              class="close"
                              data-dismiss="modal"
                              aria-label="Close"
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div class="modal-body">
                            Congratulations for purchasing RELS tokens. Kindly
                            note your tokens will be sent to you at a later date
                            which will be communicated to you soon. And the
                            token will be sent to the same BNB address you used
                            to purchase the RELS token. Have a nice day
                          </div>
                          <div class="modal-footer">
                            <button
                              type="button"
                              class="btn btn-secondary"
                              data-dismiss="modal"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h4 style="margin-bottom: 0px">Buy Rels Token</h4>
                    <div class="closing-text">
                      <p>
                        Input the amount you want to purchase, then click on the
                        "Buy RELS Token" button to continue.
                      </p>
                      <p>
                        Kindly note, your RELS token will be issued at a later
                        time, to the address used to purchase it
                      </p>
                    </div>
                    <h4>1 BNB = 6,000 RELS token</h4>
                  </div>
                  <div class="mt-1" id="section-1">
                    <div
                      class="alert alert-info"
                      id="minimum-alert"
                      role="alert"
                    >
                      The mimimum amount is 8.3 BNB ($5,000)
                    </div>
                    <div
                      class="alert alert-info"
                      id="maximum-alert"
                      role="alert"
                    >
                      The maximum amount is 16.7 BNB ($10,000)
                    </div>

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
                              value="8.3"
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
                              onkeyup="onRelsValueChange"
                              onchange="onRelsValueChange"
                              value="49800"
                              min="49800"
                              placeholder="Amount"
                            />
                            <div class="input-group-prepend">
                              <div class="input-group-text">RELS</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="q-box__buttons">
                      <button id="btn-buy-private-sale">Buy RELS Token</button>
                    </div>
                  </div>

                  <!--- Section 2-->
                  <div class="mt-1" id="section-2">
                    <div class="closing-text" style="margin-top: 0px">
                      <p>
                        Send the required amount of BNB to purchase you RELS
                        token.
                      </p>
                    </div>
                    <img class="center" src="@/assets/images/rels-ps-qr-code.png" />

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
                                value="0xf70B82b04d828106386D9AB916FAf0746E128aB7"
                                aria-describedby="inputGroupPrepend"
                              />
                              <div class="input-group-prepend">
                                <span
                                  class="input-group-text"
                                >
                                  <button
                                    id="bnb-address-copy-button"
                                    data-clipboard-text="0xf70B82b04d828106386D9AB916FAf0746E128aB7"
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
                          <td id="ammount-in-bnb">8.3 BNB (Smart Chain)</td>
                        </tr>
                        <tr>
                          <td>Time remaining</td>
                          <td>
                            <span id="time-remaining">15</span> mins remaining
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div id="q-box__buttons">
                      <button id="btn-go-back-button">Go Back</button>
                      <button
                        id="done-button"
                        data-toggle="modal"
                        data-target="#thanks-modal"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            <div class="text-moralis-gray">
              <img alt="Moralis logo" src="./assets/logo.svg" />
              <div class="mt-4">
                <div class="text-xl font-semibold">Moralis starter boilerplate</div>
                <div class="text-sm mt-1 text-moralis-green font-semibold">
                  Powered by Vue.js
                </div>
              </div>
              <div class="mt-10">
                <template v-if="isAuthenticated">
                  {{ user.get("ethAddress") }} <button @click="logout">Logout</button>
                </template>
                <template v-else>
                  <button @click="login">Connect wallet</button>
                </template>
              </div>
            </div>
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
import { onMounted, inject, computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "App",
  setup() {
    const store = useStore();
    const $moralis = inject("$moralis");

    const setUser = (payload) => store.commit("setUser", payload);

    const login = async () => {
      const user = await $moralis.Web3.authenticate();
      setUser(user);
    };

    const logout = async () => {
      await $moralis.User.logOut();
      setUser({});
    };

    const handleCurrentUser = () => {
      const user = $moralis.User.current();
      if (user) {
        setUser(user);
      }
    };

    onMounted(() => {
      handleCurrentUser();
    });

    return {
      login,
      logout,
      isAuthenticated: computed(() => Object.keys(store.state.user).length > 0),
      user: computed(() => store.state.user),
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
    font-family: 'Josefin Sans', sans-serif;
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
#btn-buy-private-sale,
#btn-go-back-button,
#done-button,
button#submit-btn {
    font-size: 17px;
    font-weight: bold;
    position: relative;
    width: 200px;
    height: 60px;
    background: #10cb6c;
    margin: 0 auto;
    /* margin-top: 40px; */
    overflow: hidden;
    z-index: 1;
    cursor: pointer;
    transition: color .3s;
    text-align: center;
    color: #fff;
    border: 0;
    -webkit-border-bottom-right-radius: 5px;
    -webkit-border-bottom-left-radius: 5px;
    -moz-border-radius-bottomright: 5px;
    -moz-border-radius-bottomleft: 5px;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
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
    transition: transform .3s;
}

button#prev-btn:hover::after,
button#next-btn:hover::after,
button#submit-btn:hover::after {
    transform: translateY(-80%);
    transition: transform .3s;
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

.question__input:checked+.question__label:before {
    background-color: #10cb6c;
    box-shadow: 0 0 0 0;
}

.question__input:checked+.question__label:after {
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

.form-check-input:checked[type=radio],
.form-check-input:checked[type=radio]:hover,
.form-check-input:checked[type=radio]:focus,
.form-check-input:checked[type=radio]:active {
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
    background: #F7F9FF;
    z-index: 1000;
}

#preloader-wrapper .preloader-section.section-left {
    left: 0
}

#preloader-wrapper .preloader-section.section-right {
    right: 0;
}

.loaded #preloader-wrapper .preloader-section.section-left {
    transform: translateX(-100%);
    transition: all 0.7s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1.000);
}

.loaded #preloader-wrapper .preloader-section.section-right {
    transform: translateX(100%);
    transition: all 0.7s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1.000);
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
</style>
