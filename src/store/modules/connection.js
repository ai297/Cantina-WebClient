import { HubConnectionState } from '@microsoft/signalr';
export default {
    namespaced: true,
    state: {
        hubConnection: undefined,
    },
    getters: {
        connection: state => state.hubConnection,
        isConnected: state => () => {
            if(state.hubConnection !== undefined) return state.hubConnection.state === HubConnectionState.Connected;
            else return false;
        },
    },
    mutations: {
        // создаём экземпляр signalR
        setConnection: (state, connection) => {
            if(state.hubConnection === undefined) state.hubConnection = connection;
        },
        registerAction: (state, action) => {
            if(state.hubConnection !== undefined) state.hubConnection.on(action.name, action.command);
        },
        removeAction: (state, action) => {
            if(state.hubConnection !== undefined) state.hubConnection.off(action.name, action.command);
        },
    },
    actions: {
        connect: ({state, rootGetters}) => {
            if(!rootGetters['auth/isAuth']) return;
            if(state.hubConnection !== undefined && !state.hubConnection.connectionStarted) return state.hubConnection.start();
            else return false;
        },
        disconnect: ({state, getters}) => {
            if(getters.isConnected) state.hubConnection.stop();
        },
        // invoke - ждёт ответа от сервера
        // send - просто отправляет сообщение, не ожидая ответа
        invoke: ({state, getters}, payload) => {
            if(payload === undefined || !payload.command || !getters.isConnected) return false;
            if(!payload.data) return state.hubConnection.invoke(payload.command);
            else return state.hubConnection.invoke(payload.command, payload.data);
        },
        send: ({state, getters}, payload) => {
            if(payload === undefined || !payload.command || !getters.isConnected) return false;
            if(!payload.data) state.hubConnection.send(payload.command);
            else state.hubConnection.send(payload.command, payload.data);
            return true;
        }
    }
}