import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store/store.js';
//import axios from 'axios';
import {ROUTING, ROLES} from './constants.js';

Vue.use(VueRouter); // подключаем плагин маршрутизации

// Login Page
import loginPage from './components/_Login/LoginPage.vue';           // страница входа
import welcomeView from './components/_Login/WelcomeView.vue';       // приветствие на страницк входа
import loginForm from './components/_Login/LoginForm.vue';           // форма входа
import registerForm from './components/_Login/RegisterForm.vue';     // форма регистрации
import confirmForm from './components/_Login/ConfirmForm.vue';       // подтверждение регистрации

// Main Page
import mainPage from './components/_Main/MainPage.vue';              // Базовая страница чата
import mainIntro from './components/_Main/_Intro/Intro.vue';         // Страница приветствия
import mainChat from './components/_Main/_Chat/Chat.vue';            // Live - чат
import archive from './components/_Main/_Archive/Archive.vue'        // Архив сообщений

const adminConsole = () => ({
  component: import('./components/_Main/_Console.vue'),
  error: mainIntro,
  timeout: 3000
});

// Настройка маршрутов  //
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
    {
        path: '/',
        component: loginPage,
        children: [
            {
                path: '',
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
        path: '/main',            // Базовая страница чата
        component: mainPage,
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: '',
                name: 'intro',         // вступительный
                alias: 'intro',
                component: mainIntro,
            },
            {
                path: '/chat',
                name: 'chat',         // Live-чат
                component: mainChat,
            },
            {
                path: '/cmd',
                name: 'cmd',
                component: adminConsole,
                meta: {
                    developerOnly: true
                }
            },
            {
                path: '/archive/:date?/:page?',
                name: 'archive',
                component: archive,
            }
        ],
    }]
});



// показываем лоадер при переходах
router.beforeEach((to, from, next) => {
    store.commit('showLoader', '');
    next();
});



// обрабатываем мета-теги маршрутов
router.beforeEach((to, from, next) => {
    // если переход на стартовую страницу - выполняем в любом случае
    // иначе сначала проверяем доступность сервера (???)
    // и только если сервер отвечает - проверяем соответствие условиям мета-тегов
    if(to.fullPath == "/") next();
    else {
        // console.log('Проверка связи');
        // axios.get(API_URL.LIFE_CHECK)
        // .then(() => {
        //     console.log('Сервер на связи. Проверяем теги.');
            for(let route of to.matched) {
                let meta = route.meta;
                // если требуется авторизация, но её нет
                if(meta.requiresAuth === true && !store.getters['auth/isAuth']) {
                    console.log('Нужна авторизация');
                    next({
                        name: 'login',
                        replace: true
                    });
                    return;
                }
                // если страница только для не авторизованных юзеров - отправляем авторизованных на главную страницу
                else if(meta.onlyGuests === true && store.getters['auth/isAuth']) {
                    console.log('Только для гостей');
                    next({
                        path: ROUTING.OUT_PAGE,
                        replace: true
                    });
                    return;
                }
                // только для разработчика
                else if(meta.developerOnly === true && store.getters['auth/role'] !== ROLES.DEVELOPER) {
                    console.log('Только для разработчиков');
                    next({
                        name: 'intro',
                        replace: true
                    });
                    return;
                }
            }
            console.log('Всё путём');
            next();
        // })
        // .catch(() => {
        //     console.log('Сервер не отвечает');
        //     store.commit('showText', 'Сервер не отвечает');
        //     setTimeout(() => store.commit('hideLoader'), 2000);
        //     next("/");
        // });
    }
});


// прячем лоадер
router.afterEach(() => {
    store.commit('hideLoader');
});

export default router