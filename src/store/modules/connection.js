import { HubConnectionBuilder, LogLevel, HubConnectionState } from '@microsoft/signalr';
import {API_URL} from '../../constants.js'

export default {
    namespaced: true,
    state: {
        hubConnection: undefined,
    },
    getters: {
        isConnected: state => {
            if(state.hubConnection !== undefined) return state.hubConnection.state === HubConnectionState.Connected;
            else return false;
        },
    },
    mutations: {
        // создаём экземпляр signalR
        setConnection: (state, token) => {
            state.hubConnection = new HubConnectionBuilder()
                .withUrl(API_URL.root+API_URL.hub, { accessTokenFactory: () => token})
                .configureLogging(LogLevel.Information)
                .build();
            state.hubConnection.serverTimeoutInMilliseconds = 20 * 60000;       // время таймаута 10 минут
            state.hubConnection.keepAliveIntervalInMilliseconds = 10 * 60000;   // время жизни соединения
        }
    },
    actions: {
        connect: ({state, commit, rootGetters}) => {
            if(!rootGetters['auth/isAuth']) return;
            if(!state.hubConnection) {
                commit('setConnection', rootGetters['auth/token']);
                // регистрируем метод для получения новых сообщений
                state.hubConnection.on('ReceiveMessage', function(data) {
                    commit('messages/addMessage', data, {root: true});
                    console.log(data);
                });
            } 
            if(!state.hubConnection.connectionStarted) return state.hubConnection.start();
            else return false;
        },
        disconnect: ({state, getters}) => {
            if(getters.isConnected) state.hubConnection.stop();
        },
        invoke: ({state, getters}, payload) => {
            if(payload === undefined || !payload.command) return false;
            if(!payload.data) payload.data = {};
            if(getters.isConnected) state.hubConnection.invoke(payload.command, payload.data)
        }
    }
}