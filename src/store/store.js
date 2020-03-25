import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth.js';
import chat from './modules/chat.js';
import connection from './modules/connection.js';
import messages from './modules/messages.js';
import users from './modules/users.js';
import commands from './modules/commands.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loader: {
            show: false,
            text: '',
        }
    },
    getters: {
        isLoading: state => {
            return state.loader.show;
        },
        loaderText: state => {
            return state.loader.text;
        }
    },
    mutations: {
        showLoader: (state, message) => {
            state.loader.text = message;
            state.loader.show = true;
        },
        hideLoader: state => {
            state.loader.show = false;
        }
    },
    modules: {
        auth,
        chat,
        connection,
        messages,
        users,
        commands,
    },
})