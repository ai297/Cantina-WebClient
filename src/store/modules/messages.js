import Queue from '../../queue.js';

export default {
    namespaced: true,
    state: {
        messages: new Queue(),
        maxCount: 100,
        showTimeAlways: false,
        lastMessageDate: undefined,
    },
    getters: {
        getMessages: state => {
            return state.messages.getAll();
        },
        count: state => {
            return state.messages.getSize();
        },
        showTime: state => state.showTimeAlways,
    },
    mutations: {
        addMessage: (state, message) => {
            // если размер очереди достиг максимального - удаляем самый старый элемент
            if(state.messages.getSize() >= state.maxCount) {
                state.messages.dequeue();
            }
            // добавляем сообщение в очередь
            state.messages.enqueue(message);
        },
        clearMessages: state => {
            state.messages = new Queue();
        },
        changeShowTimeMode: state => {
            state.showTimeAlways = !state.showTimeAlways;
        },
    },
    actions: {
        clearMessagesList: (context) => {
            context.commit('clearMessages');
        },
    }
}