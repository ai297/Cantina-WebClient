import {HTTP} from '../../http-common';
import {API_URL} from '../../constants.js';

export default {
    namespaced: true,
    state: {
        onlineUsers: [],
    },
    getters: {
        usersInOinline: state => state.onlineUsers,
    },
    mutations: {
        // мутация добавляет нового юзера в список онлайна
        addUserToOnlineList: (state, userData) => {
            for(let i in state.onlineUsers) {
                if(state.onlineUsers[i].id == userData.id)  {
                    state.onlineUsers[i].splice(i, 1, userData);
                    return;
                }
            }
            state.onlineUsers.push(userData);
        },
        clearUserList: state => state.onlineUsers = [],
    },
    actions: {
        loadOnlineUsers: context => {
            context.commit('clearUserList');
            return HTTP.get(API_URL.ONLINE_USERS)
                .then(response => {
                    for(let key in response.data) context.commit('addUserToOnlineList', response.data[key]);
                });
        }
    }
}