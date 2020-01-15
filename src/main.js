import Vue from 'vue'; // подключаем Vue.js
//import SignalR from '@aspnet/signalr' // подключаем SignalR

import App from './App.vue';
Vue.config.productionTip = false

// Глобальные компоненты //
import EmailField from './components/EmailField.vue';
import PasswordField from './components/PasswordField.vue';
import NameField from './components/NameField.vue';
const RegisterForm = () => import('./components/RegisterForm.vue'); // ленивая загрузка формы регистрации
const LoginForm = () => import('./components/LoginForm.vue');       // ленивая загрузка формы входа

Vue.component("email-field", EmailField);
Vue.component("password-field", PasswordField);
Vue.component("name-field", NameField);
Vue.component("register-form", RegisterForm);
Vue.component("login-form", LoginForm);

new Vue({
  render: h => h(App),
}).$mount('#app');