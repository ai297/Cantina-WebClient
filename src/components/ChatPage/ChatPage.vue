<template>
    <div id="chat" :class="{ limitedWidth: isLimitedWidth }">
        <p v-if="!isConnected">Потеряна связь со вселенной...</p>
        
        <!-- Основной блок //-->
        <chat-main id="chatMain" v-if="isConnected" />
        <!-- Боковой блок //-->
        <chat-aside id="chatAside" :class="{minimize: !isShowSidebar}" v-if="isConnected" />
        <!-- форма отправки сообщения //-->
        <send-message-form id="sendingForm" v-if="isConnected" />
        <!-- Менюшка навигации //-->
        <chat-nav-menu id="chatNavMenu" />
        <!-- Подвал //-->
        <chat-footer id="chatFooter" />
    </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';
import chatModule from '../../store/modules/chat.js';
import usersModule from '../../store/modules/users.js';
import messagesModule from '../../store/modules/messages.js';
import connectionModule from '../../store/modules/connection.js';
// блоки
import sendMessageForm from './SendMessageForm.vue';
import chatAside from './ChatAsideView.vue';
import chatNavMenu from './ChatNavMenu.vue';
import chatFooter from './ChatFooterView.vue';
import chatMain from './ChatMainView.vue';

export default {
    name: "ChatPage",
    components: {
        "send-message-form": sendMessageForm,
        "chat-aside": chatAside,
        "chat-nav-menu": chatNavMenu,
        "chat-footer": chatFooter,
        "chat-main": chatMain
    },
    computed: {
        ...mapGetters({
            isShowSidebar: 'chat/isShowSidebar',
            isLimitedWidth: 'chat/isLimitedChatWidth',
            isConnected: 'connection/isConnected'
        }),
    },
    methods: {
        ...mapActions({
            clearMessagesList: 'messages/clearMessagesList',
            connectToHub: 'connection/connect',
            connectionClose: 'connection/disconnect',
        }),
        changeConnectionState: function(isConnected) {
            if(!isConnected) alert('Потеряна связь с сервером');
        }
    },
    mounted: function() {
        this.$store.commit('showLoader', 'Подключение к серверу');
        this.connectToHub()
        .finally(() => {
            this.$store.commit('hideLoader');
        });
        this.$watch('isConnected', this.changeConnectionState);
    },
    beforeMount: function() {
        this.$store.registerModule('chat', chatModule);
        this.$store.registerModule('users', usersModule);
        this.$store.registerModule('messages', messagesModule);
        this.$store.registerModule('connection', connectionModule);
    },
    beforeDestroy: function() {
        //this.clearMessagesList();
        this.connectionClose();
        this.$store.unregisterModule('chat');
        this.$store.unregisterModule('users');
        this.$store.unregisterModule('messages');
        this.$store.unregisterModule('connection');
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";

    #chat {
        display: grid;
        left: 0;
        top: 0;
        width: calc(100% - 50px);
        max-width: 100%;
        height: calc(100vh - 2px);
        overflow: hidden;
        padding: 0 10px;
        padding-bottom: 0;
        cursor: default;
        grid-template-columns: 1fr auto;
        grid-template-rows: 1fr auto auto auto;
        transition: max-width .5s;
        &.limitedWidth {
            max-width: 85rem;
        }

        #chatMain {
            grid-row: 1;
            grid-column: 1;
        }
        #sendingForm {
            grid-row: 2;
            grid-column-start: 1;
            grid-column-end: 3;
        }
        #chatAside {
            grid-row: 1;
            grid-column: 2;
            width: 22vw;
            min-width: 16.5rem;
            max-width: 20rem;
            transition: all .5s;
            &.minimize {
                min-width: 0rem;
                width: 0vw;
            }
        }
        #chatNavMenu {
            grid-row: 3;
            grid-column-start: 1;
            grid-column-end: 3;
        }
        #chatFooter {
            grid-row: 4;
            grid-column-start: 1;
            grid-column-end: 3;
        }
    }
</style>