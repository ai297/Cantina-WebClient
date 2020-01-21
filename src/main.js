import Vue from 'vue';
//import Axios from 'axios';

import Router from './router/router.js';  // <-- в этом файле настраивается маршрутизация
import Store from './store/store.js';        // <-- глобальная стейт-машина
import App from './App.vue';              // <-- родительский компонент, в него загружаются все остальные компоненты

Vue.config.productionTip = false

// глобальные компоненты
import ModalContainer from './components/ModalContainer.vue';
import EmailField from './components/fields/EmailField.vue';        // поле для ввода email с автоматической валидацией
import PasswordField from './components/fields/PasswordField.vue';  // поле для ввода пароля
import NameField from './components/fields/NameField.vue';          // поле для ввода никнейма с автоматической валидацией
Vue.component("modal-container", ModalContainer);
Vue.component("email-field", EmailField);
Vue.component("password-field", PasswordField);
Vue.component("name-field", NameField);


/////-> Поехали! (точка входа)
new Vue({
  router: Router,
  store: Store,
  render: h => h(App),
}).$mount('#app');