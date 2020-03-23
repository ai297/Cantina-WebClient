export default {
    namespaced: true,
    state: {
        limitedChatWidth: true,
        currentAsideComponent: undefined,
        showSidebar: true,
        showExtendPanel: false,
        extendPanelComponent: "div",
        interactiveComponent: "div",
    },
    getters: {
        isShowSidebar: state => state.showSidebar,
        isLimitedChatWidth: state => state.limitedChatWidth,
        isShowExtendPanel: state => state.showExtendPanel,
        getCurrentAsideComponent: state => state.currentAsideComponent,
        getExtendPanelComponent: state => state.extendPanelComponent,
        interactiveComponent: state => state.interactiveComponent,
    },
    mutations: {
        changeAsideBlock: (state, component) => {
            state.currentAsideComponent = component;
        },
        showExtendPanel: (state, component) => {
            if (state.extendPanelComponent.name != component.name) {
                state.extendPanelComponent = component;
                state.showExtendPanel = true;
            } else state.showExtendPanel = !state.showExtendPanel;
        },
        showInteractive: (state, component) => {
            if(!state.interactiveComponent.name || state.interactiveComponent.name != component.name) state.interactiveComponent = component;
            else state.interactiveComponent = "div";
        }
    },
    actions: {
        
    }
}