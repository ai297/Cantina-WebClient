import usersOnlineList from '../../components/ChatPage/UserList/ChatUsersOnlineList.vue';

export default {
    namespaced: true,
    state: {
        limitedChatWidth: true,
        currentAsideComponent: usersOnlineList,
        showSidebar: true,
        showExtendPanel: false,
        extendPanelComponent: {},
    },
    getters: {
        isShowSidebar: state => { return state.showSidebar },
        isLimitedChatWidth: state => { return state.limitedChatWidth },
        isShowExtendPanel: state => { return state.showExtendPanel },
        getCurrentAsideComponent: state => { return state.currentAsideComponent },
        getExtendPanelComponent: state => { return state.extendPanelComponent },
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
    },
    actions: {
        
    }
}