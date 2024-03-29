import {createApp} from 'vue'
// import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import VueClipboard from 'vue-clipboard2'
import App from './App.vue'
import store from './store'
import Moralis from './plugins/moralis'

// const { createApp } = Vue;

// Vue.use(BootstrapVue)
// Vue.use(BootstrapVueIcons)

// import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


createApp(App)
    .provide('$moralis', Moralis)
    .use(store)
    .use(VueClipboard)
    // .use(BootstrapVue)
    // .use(BootstrapVueIcons)
    .mount('#app') 


