import { HubConnectionState } from '@microsoft/signalr';
export default {
    namespaced: true,
    state: {
        hubConnection: undefined,
        dataLoaded: false,
    },
    getters: {
        connection: state => state.hubConnection,
        isConnected: state => {
            if(state.hubConnection !== undefined) return state.hubConnection.state === HubConnectionState.Connected;
            else return false;
        },
        isDataLoaded: state => state.dataLoaded,
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
        clearConnection: state => {
            state.hubConnection = undefined;
        },
        setDataLoaded: (state, isLoaded = true) => {
            state.dataLoaded = isLoaded;
        },
    },
    actions: {
        // запуск соединения с хабом
        connect: ({state, rootGetters}) => {
            // если не авторизован - ничего не  делаем
            if(!rootGetters['auth/isAuth']) return;
            // если хабконнекшн создан и соединение ещё не установлено - возвращаем промис, стартующий соединение
            if(state.hubConnection !== undefined && !state.hubConnection.connectionStarted) return state.hubConnection.start();
            // иначе возвращаем промис, разрешающийся ошибкой
            else return new Promise(function(resolve, reject) {
                reject(false)
            });
        },
        disconnect: ({getters, commit}) => {
            // очищаем хук закрытия соединения
            //getters.connection.closedCallbacks = [];
            if(getters.isConnected) getters.connection.stop()
            .finally(() => {
                commit('clearConnection');
            });
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