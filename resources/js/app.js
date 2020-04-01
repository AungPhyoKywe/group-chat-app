/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

import VueChatScroll from 'vue-chat-scroll'
import Vue from 'vue'
import 'v-toaster/dist/v-toaster.css'
import Toaster from 'v-toaster'

Vue.use(VueChatScroll)
Vue.component('message-component', require('./components/message.vue').default);
Vue.use(Toaster, {timeout: 5000})


const app = new Vue({
    el: '#app',
});
