import Queue from '../../queue.js';

export default {
    namespaced: true,
    state: {
        messages: new Queue(),
        maxCount: 100,
        showTimeAlways: localStorage.getItem("showTimeAlways"),
        soundNotice: localStorage.getItem("soundNotice"),
        lastMessageDate: undefined,
    },
    getters: {
        getMessages: state => {
            return state.messages.getAll();
        },
        count: state => {
            return state.messages.getSize();
        },
        showTime: state => {
            if(state.showTimeAlways === null) return false;
            else return state.showTimeAlways === "true";
        },
        soundNotice: state => {
            if(state.soundNotice === null) return true;
            else return state.soundNotice === "true";
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
        clearMessages: state => state.messages = new Queue(),
        switchTimeMode: state => {
            localStorage.setItem("showTimeAlways", !(state.showTimeAlways === "true"));
            state.showTimeAlways = localStorage.getItem("showTimeAlways");
        },
        switchSoundNoticeMode: state => {
            localStorage.setItem("soundNotice", !(state.soundNotice === "true"));
            state.soundNotice = localStorage.getItem("soundNotice");
        },
    },
    actions: {
        clearMessagesList: (context) => {
            context.commit('clearMessages');
        },
    }
}