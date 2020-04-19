export default {
    namespaced: true,
    state: {
        limitedChatWidth: localStorage.getItem("limitedWidth"),
        currentAsideComponent: undefined,
        showSidebar: true,
        showExtendPanel: false,
        extendPanelComponent: "div",
        interactiveComponent: "div",
        modalComponent: "div",
        showModal: false,
        showSmiles: false,
    },
    getters: {
        isShowSidebar: state => state.showSidebar,
        isLimitedChatWidth: (state) => {
            if(state.limitedChatWidth === null) return true;
            else return state.limitedChatWidth === "true";
        },
        isShowExtendPanel: state => state.showExtendPanel,
        getCurrentAsideComponent: state => state.currentAsideComponent,
        getExtendPanelComponent: state => state.extendPanelComponent,
        interactiveComponent: state => state.interactiveComponent,
        modalComponent: state => state.modalComponent,
        showModal: state => state.showModal,
        showSmiles: state => state.showSmiles,
    },
    mutations: {
        changeAsideBlock: (state, component) => {
            state.currentAsideComponent = component;
        },
        showExtendPanel: (state, component) => {
            if (!state.extendPanelComponent.hasOwnProperty("name") || state.extendPanelComponent.name != component.name) {
                state.extendPanelComponent = component;
                state.showExtendPanel = true;
            } else state.showExtendPanel = !state.showExtendPanel;
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
        changeAsideBlockMode: state => state.showSidebar = !state.showSidebar,
        showSmiles: state => state.showSmiles = !state.showSmiles,
    },
}