//import {HTTP} from '../../http-common';
//import {API_URL} from '../../constants.js';

export default {
    namespaced: true,
    state: {
        onlineUsers: [],
    },
    getters: {
        usersInOinline: state => state.onlineUsers,
        countUsersInOnline: state => state.onlineUsers.length,
    },
    mutations: {
        // мутация добавляет нового юзера в список онлайна
        addUserToOnlineList: (state, userData) => {
            state.onlineUsers.push(userData);
        },
    },
    actions: {
        
    }
}