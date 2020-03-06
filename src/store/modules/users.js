//import {HTTP} from '../../http-common';

export default {
    namespaced: true,
    state: {
        currentUser: {
            id: 1,
            name: "Ветер",
            role: "user",
        },
        onlineUsers: [
            {id: 2, name: "Mace Windu", role: "admin"},
            {id: 3, name: "Синий Катерпиллер", role: "guest"},
            {id: 1, name: "Ветер", role: "user"},
            {id: 4, name: "Ветер Дурак", role: "user"},
        ],
    },
    getters: {
        getCurrentUserName: (state) => {
            return state.currentUser.name;
        },
        getCurrentUserId: (state) => {
            return state.currentUser.id;
        },
        getUsersInOinline: (state) => {
            return state.onlineUsers;
        },
        getCountUsersInOnline: (state) => {
            return state.onlineUsers.length;
        }
    },
    mutations: {
        // мутация добавляет нового юзера в список онлайна
        addUserToOnlineList: (state, userData) => {
            function User(userData) {
                this.id = userData.id;
                this.name = userData.name;
                this.role = userData.role;
            }
            state.onlineUsers.push( new User(userData));
        },
    },
    actions: {
        
    }
}