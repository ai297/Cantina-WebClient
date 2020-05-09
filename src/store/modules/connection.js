import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import {API_URL, CHAT_COMMANDS} from '../../constants.js';

export default {
    namespaced: true,
    state: {
        connection: undefined,
        connected: false,
        connectionOnClose: undefined,
        actions: {
            [CHAT_COMMANDS.USER_ENTER]: [],
            [CHAT_COMMANDS.USER_EXIT]: [],
            [CHAT_COMMANDS.RECEIVE_MESSAGE]: [],
            [CHAT_COMMANDS.MESSAGES_LOADED]: [],
            [CHAT_COMMANDS.RUN_CONNAND]: [],
        }
    },
    getters: {
        isConnected: state => state.connected,
    },
    mutations: {
        init_connection: (state, tokenFactory) => {
            state.connected = false;
            // TODO: отключить логи LogLevel.None
            const hubConnection = new HubConnectionBuilder()
                .withUrl(API_URL.ROOT + API_URL.HUB, { accessTokenFactory: (typeof(tokenFactory) === 'function') ? tokenFactory : () => '' })
                .configureLogging(LogLevel.Information)
                .build();
            
            hubConnection.serverTimeoutInMilliseconds = 2 * 60000;          // время таймаута (минут * 60000)
            hubConnection.onclose(() => {
                if(typeof(state.connectionOnClose) === 'function' && state.connected == true) state.connectionOnClose();
                state.connected = false;
            });

            for(let type in state.actions) {                              // Регистрируем обработчики команд от сервера
                hubConnection.on(type, (data) => {
                    for(let action of state.actions[type]) action(data);
                });
            }
            state.connection = hubConnection;
        },

        register_action: (state, {type, action}) => {
            if(typeof(action) === 'function'
            && state.actions.hasOwnProperty(type)
            && state.actions[type].indexOf(action) < 0) state.actions[type].push(action);
        },

        remove_action: (state, action) => {
            for(let type in state.actions) {
                let index = state.actions[type].indexOf(action);
                if(index != -1) {
                    state.actions[type].splice(index, 1);
                    return;
                }
            }
        },

        onCloseConnection: (state, hook) => {
            if(typeof(hook) === 'function') state.connectionOnClose = hook;
        },

        connected: state => state.connected = true,
        disconnected: state => state.connected = false,
    },
    actions: {
        // запуск соединения с хабом
        connect: ({state, commit, rootState}) => {
            return new Promise((resolve, reject) => {
                if(state.connection === undefined) commit('init_connection', () => rootState.auth.token);
                if(!state.connected) state.connection.start().then(() => {
                    commit('connected');
                    resolve();
                })
                .catch(reject);
                else resolve();
            });
        },

        disconnect: ({state, commit}) => {
            return new Promise((resolve, reject) => {
                if(state.connected) {
                    state.connection.send(CHAT_COMMANDS.CHAT_DISCONNECT)
                    .then(() => {
                        commit('disconnected');
                        state.connection.stop().then(resolve);
                    });
                } else reject();
            });
        },

        // invoke - ждёт ответа от сервера
        // send - просто отправляет сообщение, не ожидая ответа
        invoke: ({state}, {command, data}) => {
            return new Promise((resolve, reject) => {
                if(state.сonnected == false || command === undefined) reject();
                else if(data !== undefined) state.connection.invoke(command, data).then(resolve).catch(resolve);
                else state.connection.invoke(command).then(resolve).catch(reject);
            });
        },
        send: ({state}, {command, data}) => {
            return new Promise((resolve, reject) => {
                if(state.сonnected == false || command === undefined) reject();
                else if(data !== undefined) state.connection.send(command, data).then(resolve).catch(resolve);
                else state.connection.send(command).then(resolve).catch(reject);
            });
        }
    }
}