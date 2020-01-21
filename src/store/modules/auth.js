import {HTTP} from '../../http-common';

export default {
    namespaced: true,
    state: {
        token: {
            accessToken: '',
            accessExpires: 0
        },
        err: {
            status: 0,
            message: ''
        },
        refreshTimer: null
    },
    getters: {
        // геттер состояния авторизации
        isAuth: (state) => {
            if(state.token.accessToken && state.token.accessExpires &&
                state.token.accessExpires > Date.now()) return true;
            else return false;
        },

        canRefresh: () => {
            if(localStorage.getItem('ref') !== null &&
            localStorage.getItem('exp') !== null &&
            localStorage.getItem('exp') > Date.now()) return true;
            else {
                localStorage.removeItem('exp');
                localStorage.removeItem('ref');
                return false;
            }
        }
    },
    mutations: {
        setTokens: (state, response) => {
            if(typeof response.data.accessToken != 'undefined' && typeof response.data.refreshToken != 'undefined') {
                // если токены получены
                var tokens = response.data;
                var accessExpires = new Date(tokens.accessExpires).getTime();      // срок действия токена по локальному времени
                var refreshExpires = new Date(tokens.refreshExpires).getTime();    // срок действия рефреш-токена по локальному времени
                // сохраняем access токен в стейт
                state.token = {
                    accessToken: tokens.accessToken,
                    accessExpires: accessExpires
                };
                // сохраняем refresh токен в локальном хранилище браузера
                localStorage.setItem('ref', tokens.refreshToken);
                localStorage.setItem('exp', refreshExpires);
            } else {
                // если запрос удачный, но токенов нет
                state.err = {
                    status: 0,
                    message: "No data in response :-("
                };
                localStorage.removeItem('ref');
                localStorage.removeItem('exp');
            }
        },
        failReport: (state, report) => {
            if(typeof report.response != 'undefined') {
                state.err = {
                    status: report.response.status,
                    message: report.response.data.message
                };
            } else {
                state.err = {
                    status: 0,
                    message: report
                };
            }
        }
    },
    actions: {
        // запрос токена (в request поля email и password)
        login: async (context, request) => {
            var loginUrl = "api/auth/login";
            await HTTP.post(loginUrl, request)
            .then((response) => {
                context.commit('setTokens', response);  // сохраняем токены
                context.dispatch('refresh');            // запускаем автообновление
            })
            .catch((err) => {
                // если ответ отрицательный (401, 500)
                context.commit('failReport', err);
            });
        },
        // запрос нового токена при помощи refresh
        update: async (context) => {
            var refreshUrl = "api/auth/refresh";
            var ref = {
                token: localStorage.getItem('ref'),
                expires: localStorage.getItem('exp')
            };
            // проверяем наличие рефреш-токена и срок действия
            if(!ref.token || !ref.expires || ref.expires <= Date.now()) {
                context.commit('failReport', "No valid token");
                return;
            }
            // запрашиваем авторизацию
            await HTTP.get(refreshUrl, {
                // в заголовке авторизации - рефреш токен
                headers: {
                    "Authorization": "Bearer " + ref.token
                }
            }).then((response) => {
                context.commit('setTokens', response);  // сохраняем токены
                context.dispatch('refresh');            // запускаем автообновление
            })
            .catch((err) => {
                context.commit('failReport', err);
            });
        },
        // автообновление токена
        refresh: async (context) => {
            var timeout = context.state.token.accessExpires - Date.now() - 10 * 1000;   // задержка до следующего обновления токенов (на 10 сек меньше скрока действия)
            if(context.state.refreshTimer) clearTimeout(context.state.refreshTimer);    // если уже есть запущенный таймер - отменяем его
            context.state.refreshTimer = setTimeout(async function tm(ctx) {
                await ctx.dispatch('update');   // запускаем обновление токенов
            }, timeout, context);
        }
    }

}