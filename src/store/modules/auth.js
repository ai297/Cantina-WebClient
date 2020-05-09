import axios from 'axios';
import {ROLES, CLAIMS, API_URL} from '../../constants.js';

export default {
    namespaced: true,
    state: {
        token: localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token') || '',
        status: '',
    },
    getters: {
        isAuth: (state, getters) => {
            return state.token != '' && getters.tokenExpire > Date.now();
        },
        status: state => state.status,
        tokenInfo: (state) => {
            return JSON.parse(atob(state.token.split('.',3)[1]));
        },
        tokenExpire: (state, getters) => {
            if(state.token != '') return getters.tokenInfo.exp * 1000;
            else return 0;
        },
        role: (state, getters) => {
            if(!getters.isAuth) return ROLES.USER;
            else {
                let role = getters.tokenInfo[CLAIMS.ROLE];
                return role ? role : ROLES.USER;
            }
        },
        userId: (state, getters) => {
            if(!getters.isAuth) return -1;
            else {
                return getters.tokenInfo[CLAIMS.ID] * 1;
            }
        }
    },
    mutations: {
        auth_request: state => state.status = "Loading",
        auth_unconfirm: state => state.status = "Unconfirmed",
        auth_success: (state, token) => {
            state.status = "Authorized";
            state.token = token;
        },
        auth_error: state => state.status = "Error",
        logout: state => {
            state.status = "Unauthorized";
            state.token = '';
        },
    },
    actions: {
        // запрос авторизации
        login: ({commit}, request) => {
            return new Promise((resolve, reject) => {
                commit('auth_request');
                axios.post(API_URL.LOGIN, request)
                .then(response => {
                    // если аккаунт не активирован
                    if(response.data.result == "Unconfirmed") commit('auth_unconfirm');
                    // если получен токен
                    else {
                        if(request.longLife) localStorage.setItem('auth-token', response.data.result);
                        else sessionStorage.setItem('auth-token', response.data.result);
                        axios.defaults.headers.common['Authorization'] = "Bearer " + response.data.result;
                        commit('auth_success', response.data.result);
                    }
                    resolve(response);
                })
                .catch(err => {
                    commit('auth_error');
                    localStorage.removeItem('auth-token');
                    sessionStorage.removeItem('auth-token');
                    reject(err);
                });
            });
        },

        logout: ({commit}) => {
            commit('logout');
            localStorage.removeItem('auth-token');
            sessionStorage.removeItem('auth-token');
        }
    }

}