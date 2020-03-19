import Vue from 'vue';

import Router from './router.js';                   // <-- в этом файле настраивается маршрутизация
import Store from './store/store.js';               // <-- глобальная стейт-машина
Vue.config.productionTip = false

Store.commit('showLoader', 'Загрузка...');

// глобальные компоненты
import App from './App.vue';                                        // <-- родительский компонент, в него загружаются все остальные компоненты
import animatedLogo from './components/ui/AnimatedLogo.vue';        // SVG логотип
import flatField from './components/ui/FlatField.vue';              // плоское текстовое поле
import flatSelection from './components/ui/FlatSelection.vue';      // плоский выпадающий список
import volumeButton from './components/ui/VolumeButton.vue';        // объемная кнопочка
import flatButton from './components/ui/FlatButton.vue';            // плосская кнопочка
import kotorBorder from './components/ui/KotorStyleBorder.vue';     // рамка а-ля kotor
import cantinaIcons from './components/icons/IconBase.vue';         // svg - иконки
Vue.component("animated-logo", animatedLogo);
Vue.component("flat-field", flatField);
Vue.component("flat-selection", flatSelection);
Vue.component("volume-button", volumeButton);
Vue.component("flat-button", flatButton);
Vue.component("kotor-border", kotorBorder);
Vue.component("cantina-icons", cantinaIcons);


/////-> Поехали! (точка входа)
new Vue({
  router: Router,
  store: Store,
  render: h => h(App),
}).$mount('#app');