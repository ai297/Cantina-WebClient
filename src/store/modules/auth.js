import {HTTP} from '../../http-common.js';
import {API_URL, ROLES, CLAIMS} from '../../constants.js';

export default {
    namespaced: true,
    state: {
        token: sessionStorage.getItem('auth-token') || '',
        auth: {
            isAuth: false,
            type: '',
            text: '',
        },
        currentUserName: '',
    },
    getters: {
        isAuth: state => state.auth.isAuth,
        token: (state, getters) => {
            if(state.token != '' && getters.tokenExpire > Date.now()) return state.token;
            else return false;
        },
        tokenInfo: state => {
            return JSON.parse(atob(state.token.split('.',3)[1]));
        },
        tokenExpire: (state, getters) => {
            if(state.token != '') return getters.tokenInfo.exp * 1000;
            else return 0;
        },
        role: (state, getters) => {
            if(!getters.token) return ROLES.USER;
            else {
                let role = getters.tokenInfo[CLAIMS.ROLE];
                return role ? role : ROLES.USER;
            }
        },
        userName: (state) => {
            if(state.currentUserName == '') return 'Unathorized';
            else return state.currentUserName;
        },
        userId: (state, getters) => {
            if(!getters.token) return -1;
            else return getters.tokenInfo[CLAIMS.ID] * 1;
        },
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
        updateUserName: (state, name) => state.currentUserName = name,
    },
    actions: {
        auth: (context, data) => {
            return HTTP({
                method: data.method,
                url: API_URL.LOGIN,
                data: data.payload,
                headers: {
                    "Authorization": context.getters.token ? "Bearer " + context.getters.token : '',
                }
            })
            .then(response => {
                let res = response.data;
                if(res.success) {
                    context.commit("setToken", res.token);
                    context.commit("updateUserName", res.userName);
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
            });
        },
        login: async (context, payload) => {
            await context.dispatch('auth', {method: 'post', payload: payload});
        },
        relogin: async context => {
            await context.dispatch('auth', {method: 'get', payload: {}});
        }
    }

}