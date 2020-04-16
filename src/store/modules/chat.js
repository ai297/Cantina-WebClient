export default {
    namespaced: true,
    state: {
        limitedChatWidth: true,
        currentAsideComponent: undefined,
        showSidebar: true,
        showExtendPanel: false,
        extendPanelComponent: "div",
        interactiveComponent: "div",
        modalComponent: "div",
        showModal: false,
    },
    getters: {
        isShowSidebar: state => state.showSidebar,
        isLimitedChatWidth: state => state.limitedChatWidth,
        isShowExtendPanel: state => state.showExtendPanel,
        getCurrentAsideComponent: state => state.currentAsideComponent,
        getExtendPanelComponent: state => state.extendPanelComponent,
        interactiveComponent: state => state.interactiveComponent,
        modalComponent: state => state.modalComponent,
        showModal: state => state.showModal,
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
            if(!state.modalComponent.hasOwnProperty("name") || state.modalComponent.name != component.name) {
                state.modalComponent = component;
                state.showModal = true;
            } else state.showModal = !state.showModal;
        },
        hideModal: state => state.showModal = false,
        changeWidth: state => state.limitedChatWidth = !state.limitedChatWidth,
        changeAsideBlockMode: state => state.showSidebar = !state.showSidebar,
    },
}