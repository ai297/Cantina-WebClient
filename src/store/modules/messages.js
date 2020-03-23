import Queue from '../../queue.js';

export default {
    namespaced: true,
    state: {
        messages: new Queue(),
        maxCount: 100,
        addNameAction: null,
    },
    getters: {
        getMessages: state => {
            return state.messages.getAll();
        },
        count: state => {
            return state.messages.getSize();
        }
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
        // регистрируем функцию вставки ника в поле ввода сообщения
        registerAddNameAction: (state, func) => {
            state.addNameAction = func;
        },
        // вызов функции вставки ника в поле ввода сообщения
        addNameToMessage: (state, data) => {
            state.addNameAction(data);
        },
    },
    actions: {
        clearMessagesList: (context) => {
            context.commit('clearMessages');
        },
    }
}