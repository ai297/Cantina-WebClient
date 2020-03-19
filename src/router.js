import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store/store.js';
import {MAIN_PAGE} from './constants.js';

Vue.use(VueRouter); // подключаем плагин маршрутизации

// Базовые компоненты приложения (вьюшки), представляющие отдельные "страницы"
import loginPage from './components/LoginPage/LoginPage.vue';        // страница входа
import welcomeView from './components/LoginPage/WelcomeView.vue';    // приветствие на страницк входа
import loginForm from './components/LoginPage/LoginForm.vue';        // форма входа
import registerForm from './components/LoginPage/RegisterForm.vue';  // форма регистрации
import confirmForm from './components/LoginPage/ConfirmForm.vue';    // подтверждение регистрации
import mainPage from './components/MainPage/MainPage.vue';           // начальная страница
import chatPage from './components/ChatPage/ChatPage.vue';           // основная страница чата

// Настройка маршрутов  //
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '',
      component: loginPage,
      children: [
        {
          path: '/',
          name: 'welcome',
          alias: 'welcome',
          component: welcomeView,
        },
        {
          path: 'login',
          name: 'login',
          component: loginForm,
          meta: {
            onlyGuests: true,
          },
        },
        {
          path: 'register',
          name: 'register',
          component: registerForm,
          meta: {
            onlyGuests: true,
          },
        },
        {
          path: 'activation',
          name: 'activation',
          component: confirmForm,
          meta: {
            onlyGuests: true,
          },
        }
      ],
    },
    {
      name: 'main',             // стартовая страница
      path: '/main',
      component: mainPage,
      meta: {
        requiresAuth: true,
      }
    },
    {
      name: 'chat',             // основная страница чата
      path: '/chat',
      component: chatPage,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

// показываем загрузчик
router.beforeEach((to, from, next) => {
  store.commit('showLoader', 'Соединение...');
  // если переход на закрытую страницу - сперва проверяем доступность сервера
  if(to.matched.some(record => record.meta.requiresAuth)) store.dispatch('auth/serverIsAvalible')
  .then(() => {
    next();
  })
  .catch(() => {
    store.commit('hideLoader');
    alert("Не удалось соединиться с сервером...");
    next(false);
  });
  // иначе просто переходим
  else next();
});
router.afterEach(() => {
  store.commit('hideLoader');
})


// обрабатываем мета-теги маршрутов
router.beforeEach((to, from, next) => {
  for(let routeId in to.matched) {
    
    let meta = to.matched[routeId].meta;
    
    // если требуется авторизация, но её нет
    if(!!meta.requiresAuth && !store.getters['auth/isAuth']) {
      
      // если есть не просроченный токен - пробуем обновить авторизацию
      if(store.getters['auth/token']) {
        store.dispatch('auth/relogin').finally(() => {
          // если успешно обновили - го некст
          if(store.getters['auth/isAuth']) next();
          // иначе на страницу логина
          else next({
            name: 'login',
            replace: true
          });
        });
      }
      // иначе отправляем на страницу логина
      else {
        next({
          name: 'login',
          replace: true
        });
      }
    }

    // если страница только для не авторизованных юзеров - отправляем авторизованных на главную страницу
    else if(!!meta.onlyGuests && store.getters['auth/isAuth']) {
      next({
        path: MAIN_PAGE,
        replace: true
      });
    }
    
    // если тегов не найдено - просто идём дальше
    else next();
  }
});

export default router