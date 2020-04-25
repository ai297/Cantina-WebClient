import Vue from 'vue';

import Router from './router.js';                   // <-- в этом файле настраивается маршрутизация
import Store from './store/store.js';               // <-- глобальная стейт-машина

// фокус окна браузера
window.onfocus = () => Store.commit('setFocusWindow', true);
window.onblur = () => Store.commit('setFocusWindow', false);

// глобальные компоненты
import App from './App.vue';                                        // <-- родительский компонент, в него загружаются все остальные компоненты
import animatedLogo from './components/ui/AnimatedLogo.vue';        // SVG логотип
import flatField from './components/ui/FlatField.vue';              // кастомное текстовое поле
import flatSelect from './components/ui/FlatSelect.vue';            // кастомный выпадающий список
import volumeButton from './components/ui/VolumeButton.vue';        // объемная кнопочка
import flatButton from './components/ui/FlatButton.vue';            // плосская кнопочка
import kotorBorder from './components/ui/KotorStyleBorder.vue';     // рамка а-ля kotor
import cantinaIcons from './components/icons/IconBase.vue';         // svg - иконки
import magicCircle from './components/ui/MagicCircle.vue';          // анимированный загрузчик
Vue.component("animated-logo", animatedLogo);
Vue.component("flat-field", flatField);
Vue.component("flat-select", flatSelect);
Vue.component("volume-button", volumeButton);
Vue.component("flat-button", flatButton);
Vue.component("kotor-border", kotorBorder);
Vue.component("cantina-icons", cantinaIcons);
Vue.component("magic-circle", magicCircle);

/////-> Поехали! (точка входа)
var vm = new Vue({
  router: Router,
  store: Store,
  render: h => h(App),
});

vm.$mount('#app');