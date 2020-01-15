import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';

Vue.config.productionTip = false
Vue.use(VueRouter);


// Глобальные компоненты //
import EmailField from './components/fields/EmailField.vue';
import PasswordField from './components/fields/PasswordField.vue';
import NameField from './components/fields/NameField.vue';
// Навигационные компоненты //
const LoginForm = () => import('./components/LoginForm.vue');       // форма входа
const RegisterForm = () => import('./components/RegisterForm.vue'); // форма регистрации
const MainPage = () => import('./components/MainPage.vue');         // стартовая страница

Vue.component("email-field", EmailField);
Vue.component("password-field", PasswordField);
Vue.component("name-field", NameField);

// Настройка маршрутизации //
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/register', component: RegisterForm },
    { path: '/login', component: LoginForm },
    { path: '/main', component: MainPage },
  ]
});

// Инициализируем корневой экземпляр Vue //
new Vue({
  render: h => h(App),
  router: router
}).$mount('#app');