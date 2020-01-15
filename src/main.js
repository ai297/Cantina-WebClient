import Vue from 'vue'; // подключаем Vue.js
//import SignalR from '@aspnet/signalr' // подключаем SignalR

import App from './App.vue';

Vue.config.productionTip = false


new Vue({
  render: h => h(App),
}).$mount('#app');