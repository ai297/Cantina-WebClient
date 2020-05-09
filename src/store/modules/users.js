import axios from 'axios';
import { API_URL } from '../../constants';

export default {
    namespaced: true,
    state: {
        onlineUsers: [],
        currentUser: {
            userId: -1,
            name: null,
            enterTime: null,
            status: 1,
        }
    },
    getters: {
        usersInOinline: state => state.onlineUsers,
        currentUser: state => state.currentUser,
    },
    mutations: {
        // мутация добавляет нового юзера в список онлайна
        addUserToOnlineList: (state, userData) => {
            // обновление данных текущего юзера
            if(userData.userId == state.currentUser.userId) {
                state.currentUser = userData;              
            }
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
        setCurrentUserId: (state, id) => state.currentUser.userId = id,
        updateCurrentUser: (state, user) => state.currentUser = user,
    },
    actions: {
        loadOnlineUsers: ({commit, state}) => {
            commit('clearUserList');
            return new Promise((resolve, reject) => {
                axios.get(API_URL.ONLINE_USERS)
                .then(response => {
                    for(let userData of response.data) commit('addUserToOnlineList', userData);
                    resolve(state.onlineUsers.length > 0);
                })
                .catch(reject);
            });
        }
    }
}