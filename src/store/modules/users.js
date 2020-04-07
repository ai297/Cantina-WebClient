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
                // перебираем всех посетителей в чате и если находим такого же - заменяем данные в списке на новые данные посетителя
                if(state.onlineUsers[i].userId == userData.userId) {
                    state.onlineUsers.splice(i, 1, userData);
                    return;
                }
            }
            state.onlineUsers.push(userData);
        },
        removeUserFromOnlineList: (state, userId) => {
            for(let i in state.onlineUsers) {
                if(state.onlineUsers[i].userId == userId) state.onlineUsers.splice(i, 1);
            }
        },
        clearUserList: state => state.onlineUsers = [],
    },
    actions: {
        loadOnlineUsers: async context => {
            context.commit('clearUserList');
            await HTTP.get(API_URL.ONLINE_USERS)
                .then(response => {
                    for(let key in response.data) context.commit('addUserToOnlineList', response.data[key]);
                });
            return context.state.onlineUsers.length;
        }
    }
}