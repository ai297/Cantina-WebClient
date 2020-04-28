export default {
    namespaced: true,
    state: {
        limitedChatWidth: localStorage.getItem("limitedWidth"),
        showSidebar: localStorage.getItem("showSidebar"),
        reversDirection: localStorage.getItem("reversDirection"),
        currentAsideComponent: undefined,
        interactiveComponent: "div",
        modalComponent: "div",
        showModal: false,
        showSmiles: false,
        autoScroll: true,
    },
    getters: {
        isShowSidebar: state => {
            if(state.showSidebar === null) return true;
            else return state.showSidebar === "true";
        },
        isLimitedChatWidth: (state) => {
            if(state.limitedChatWidth === null) return true;
            else return state.limitedChatWidth === "true";
        },
        isReversedDirection: (state) => {
            if(state.reversDirection === null) return false;
            else return state.reversDirection === "true";
        },
        getCurrentAsideComponent: state => state.currentAsideComponent,
        interactiveComponent: state => state.interactiveComponent,
        modalComponent: state => state.modalComponent,
        showModal: state => state.showModal,
        showSmiles: state => state.showSmiles,
        autoScroll: state => state.autoScroll,
    },
    mutations: {
        changeAsideBlock: (state, component) => {
            state.currentAsideComponent = component;
        },
        showInteractive: (state, component) => {
            if(!state.interactiveComponent.hasOwnProperty("name") || state.interactiveComponent.name != component.name) state.interactiveComponent = component;
            else state.interactiveComponent = "div";
        },
        showModal: (state, component) => {
            if(!state.modalComponent != component) {
                state.modalComponent = component;
                state.showModal = true;
            } else state.showModal = !state.showModal;
        },
        hideModal: state => state.showModal = false,
        changeWidth: (state) => {
            localStorage.setItem("limitedWidth", !(state.limitedChatWidth === "true"));
            state.limitedChatWidth = localStorage.getItem("limitedWidth");
        },
        switchAsideMode: state => {
            localStorage.setItem("showSidebar", !(state.showSidebar === "true"));
            state.showSidebar = localStorage.getItem("showSidebar");
        },
        switchDirection: state => {
            localStorage.setItem("reversDirection", !(state.reversDirection === "true"));
            state.reversDirection = localStorage.getItem("reversDirection");
        },
        showSmiles: state => state.showSmiles = !state.showSmiles,
        switchScrollMode: (state, mode = null) => {
            if(mode === null) state.autoScroll = !state.autoScroll;
            else state.autoScroll = mode;
        },
    },
}