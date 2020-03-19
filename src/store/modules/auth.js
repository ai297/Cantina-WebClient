import {HTTP} from '../../http-common.js';
import {API_URL, ROLES} from '../../constants.js';

export default {
    namespaced: true,
    state: {
        token: sessionStorage.getItem('auth-token') || '',
        auth: {
            isAuth: false,
            type: '',
            text: '',
        },
        currentUser: {},
    },
    getters: {
        isAuth: state => state.auth.isAuth,
        token: (state, getters) => {
            if(state.token != '' && getters.tokenExpire > Date.now()) return state.token;
            else return false;
        },
        tokenExpire: state => {
            if(state.token != '') return JSON.parse(atob(state.token.split('.',3)[1])).exp * 1000;
            else return 0;
        },
        role: (state, getters) => {
            if(!getters.token) return ROLES.USER;
            else {
                let role = JSON.parse(atob(state.token.split('.',3)[1]))[ROLES.property];
                return role ? role : ROLES.USER;
            }
        },
        currentUserInfo: state => state.currentUser,
    },
    mutations: {
        setToken: (state, token) => {
            state.token = token;
            sessionStorage.setItem('auth-token', token);
            HTTP.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        },
        removeToken: state => {
            state.token = '';
            sessionStorage.removeItem('auth-token');
            delete HTTP.defaults.headers.common['Authorization'];
        },
        authResult: (state, payload) => {
            state.auth = payload;
        },
        updateCurrentUser: (state, userData) => state.currentUser = userData,
    },
    actions: {
        auth: (context, data) => {
            let token = context.getters.token ? "Bearer " + context.getters.token : '';
            return HTTP({
                method: data.method,
                url: API_URL.login,
                data: data.payload,
                headers: {
                    "Authorization": token
                }
            })
            .then(response => {
                let res = response.data;
                if(res.success) {
                    context.commit("setToken", res.token);
                    context.commit("authResult", {isAuth: true});
                }
                else {
                    if(res.type == "activation") context.commit("authResult", {isAuth: false, type: "activation"});
                    else context.commit("authResult", {isAuth: false, type: 'error', text: 'Что-то сломалось'});
                    context.commit("removeToken");
                }
            })
            .catch(error => {
                let errorMessage = '';
                if(error.response !== undefined) {
                    switch(error.response.status){
                        case 403:
                            errorMessage = "Доступ запрещён";
                            break;
                        default:
                            errorMessage = error.response.data;
                    }
                } else errorMessage = 'Не удалось подключиться к серверу';
                context.commit("authResult", {isAuth: false, type: 'error', text: errorMessage});
                context.commit("removeToken");
            })
            .finally(() => {
                context.dispatch("loadUserInfo");
            });
        },
        login: async (context, payload) => {
            await context.dispatch('auth', {method: 'post', payload: payload});
        },
        relogin: async context => {
            await context.dispatch('auth', {method: 'get', payload: {}});
        },
        serverIsAvalible: () => {
            return HTTP.get(API_URL.ping);
        },
        loadUserInfo: context => {
            if(!context.getters.isAuth) return;
            // обновляем информацию о юзере
            HTTP.get(API_URL.userinfo).then( response => {
                context.commit('updateCurrentUser', response.data);
            });
        }
    }

}