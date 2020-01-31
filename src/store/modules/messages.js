import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

export default {
    namespaced: true,
    state: {
        hubConnection: Object,
        // массив всех полученных сообщений
        messages: [],
    },
    getters: {

    },
    mutations: {
        startConnection: (state, token) => {
            state.hubConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:5000/hub/main', { accessTokenFactory: () => token})
                .configureLogging(LogLevel.Information)
                .build();
            state.hubConnection.serverTimeoutInMilliseconds = 20 * 60000;       // время таймаута 10 минут
            state.hubConnection.keepAliveIntervalInMilliseconds = 10 * 60000;   // время жизни соединения
            state.hubConnection.start();
        }
    },
    actions: {
        connect: (context, token) => {
            context.commit('startConnection', token);
        }
    }
}