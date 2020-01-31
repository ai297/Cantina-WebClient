<template>
    <div id="chat" :class="{ limitedWidth: isLimWidth }">
        <modal-container id="modal"></modal-container>
        <!-- Основной блок //-->
        <chat-main id="chatMain" />
        <!-- Боковой блок //-->
        <chat-aside id="chatAside" />
        <!-- форма отправки сообщения //-->
        <send-message-form id="sendingForm" />
        <!-- Менюшка навигации //-->
        <chat-nav-menu id="chatNavMenu" />
        <!-- Подвал //-->
        <chat-footer id="chatFooter" />
    </div>
</template>

<script>
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
    data: function() {
        return {
            isLimWidth: true,
        }
    },
    created: function() {
        //this.$store.dispatch('messages/connect', this.$store.getters["auth/getToken"]);
    },
    
}
</script>

<style lang="less">
    @import "../../less/vars.less";

    ::-webkit-scrollbar {
        width: 10px;
    }
    ::-webkit-scrollbar-track {
        background: none;
    }
    ::-webkit-scrollbar-thumb {
        background-color: @grey;
        border-radius: 5px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background-color: @gold;
    }

    body {
        background-image: url("/images/milkyway.jpg");
        background-attachment: fixed;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }

    #modal {
        display: none;
    }

    div#chat {
        display: grid;
        left: 0;
        top: 0;
        width: 100%;
        height: calc(100vh - 2px);
        overflow: hidden;
        padding: 0 10px;
        padding-bottom: 0;
        cursor: default;

        grid-template-columns: 1fr auto;
        grid-template-rows: 1fr auto auto auto;
        
        &.limitedWidth {
            max-width: 1600px;
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
            width: 20vw;
            min-width: 300px;
            max-width: 400px;
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