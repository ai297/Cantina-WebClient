import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/store';

import middlewarePipeline from './middlewrePipeline.js';
//import autorization from './middleware/autorization.js';
import onlyGuests from './middleware/guestOnly.js';

Vue.use(VueRouter); // подключаем плагин маршрутизации

// Базовые компоненты приложения (вьюшки), представляющие отдельные "страницы"
import loginPage from '../components/LoginPage/LoginPage.vue';        // страница входа
import welcomeView from '../components/LoginPage/WelcomeView.vue';    // приветствие на страницк входа
import loginForm from '../components/LoginPage/LoginForm.vue';        // форма входа
import registerForm from '../components/LoginPage/RegisterForm.vue';  // форма регистрации
import confirmForm from '../components/LoginPage/ConfirmForm.vue';    // подтверждение регистрации
import mainPage from '../components/MainPage/MainPage.vue';           // начальная страница
import chatPage from '../components/ChatPage/ChatPage.vue';           // основная страница чата

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
            middlware: [
              onlyGuests
            ]
          },
        },
        {
          path: 'register',
          name: 'register',
          component: registerForm,
          meta: {
            middlware: [
              onlyGuests
            ]
          },
        },
        {
          path: 'activation',
          name: 'activation',
          component: confirmForm,
          meta: {
            middlware: [
              onlyGuests
            ]
          },
        }
      ],
    },
    {
      name: 'main',             // стартовая страница
      path: '/main',
      component: mainPage,
      meta: {
        // middlware: [
        //   autorization  // middlware, проверяющий наличие авторизации. если её не будет - запрос будет перенаправлен на страницу логина
        // ]
      }
    },
    {
      name: 'chat',             // основная страница чата
      path: '/chat',
      component: chatPage,
      meta: {
        // middlware: [
        //   autorization
        // ]
      }
    }
  ]
});

// добавляем middleware к маршрутизации.
router.beforeEach((to, from, next) => {
  if(!to.meta.middlware) return next();
  else {
    const middleware = to.meta.middlware;
    const context = {
      to,
      from,
      next,
      store
    };
    return middleware[0]({
      ...context,
      nextMiddleware: middlewarePipeline(context, middleware, 1)
      });
  }
});

export default router