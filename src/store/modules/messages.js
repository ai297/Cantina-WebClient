import Queue from '../../queue.js';

export default {
    namespaced: true,
    state: {
        messages: new Queue(),
        maxCount: 100,
        oldMessageLoaded: false,
        showTimeAlways: localStorage.getItem("showTimeAlways"),
        soundNotice: localStorage.getItem("soundNotice"),
        lastMessageDate: undefined,

        unreadMessages: 0,
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
        },
        oldMessageLoaded: state => state.oldMessageLoaded,
        unreadMessages: state => state.unreadMessages,
        lastMessageDate: state => state.lastMessageDate,
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
            state.oldMessageLoaded = false;
        },
        switchTimeMode: state => {
            localStorage.setItem("showTimeAlways", !(state.showTimeAlways === "true"));
            state.showTimeAlways = localStorage.getItem("showTimeAlways");
        },
        switchSoundNoticeMode: state => {
            localStorage.setItem("soundNotice", !(state.soundNotice === "true"));
            state.soundNotice = localStorage.getItem("soundNotice");
        },
        oldMessageLoaded: (state, val = true) => {
            state.oldMessageLoaded = val;
        },
        setUnreadMessages: (state, val) => {
            state.unreadMessages = val;
        }
    }
}