import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/store';

import middlewarePipeline from './middlewrePipeline.js';
import autorization from './middleware/autorization.js';
import onlyGuests from './middleware/guestOnly.js';

Vue.use(VueRouter); // подключаем плагин маршрутизации

// Базовые компоненты приложения (вьюшки), представляющие отдельные "страницы"
const loginPage = () => import('../components/LoginPage.vue');          // форма входа
const registerPage = () => import('../components/RegisterPage.vue');    // форма регистрации
const mainPage = () => import('../components/MainPage.vue');            // стартовая страница
const chatPage = () => import('../components/ChatPage/ChatPage.vue');   // основная страница чата

// Настройка маршрутов  //
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { 
      name: 'register',         // страница регистрации
      path: '/register',
      component: registerPage,
      meta: {
        middlware: [
          onlyGuests
        ]
      }
    },
    {
      name: 'login',            // страница логина
      path: '/login',
      component: loginPage,
      meta: {
        middlware: [
          onlyGuests
        ]
      }
    },
    {
      name: 'main',             // стартовая страница
      path: '/main',
      component: mainPage,
      alias: '/',
      meta: {
        middlware: [
          autorization  // middlware, проверяющий наличие авторизации. если её не будет - запрос будет перенаправлен на страницу логина
        ]
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