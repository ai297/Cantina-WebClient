<template>
    <div id="chat" :class="{ limitedWidth: isLimitedWidth }">
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
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

// компоненты
import sendMessageForm from './SendMessageForm.vue';
import chatAside from './ChatAsideView.vue';
import chatNavMenu from './ChatNavMenu.vue';
import chatFooter from './ChatFooterView.vue';
import chatMain from './ChatMainView.vue';
// константы
import {API_URL, CHAT_COMMANDS, ROUTING} from '../../constants.js';

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
            accessToken: 'auth/token',
            hubConnection: 'connection/connection',
            isConnected: 'connection/isConnected'
        }),
    },
    methods: {
        ...mapActions({
            connectToHub: 'connection/connect',
            closeConnection: 'connection/disconnect',
            loadOnlineUsers: 'users/loadOnlineUsers',
            runCommand: 'commands/run',
        }),
        ...mapMutations({
            showLoader: 'showLoader',
            hideLoader: 'hideLoader',
            setConnection: 'connection/setConnection',
            registerAction: 'connection/registerAction',
            removeAction: 'connection/removeAction',
            addUser: 'users/addUserToOnlineList',
            removeUser: 'users/removeUserFromOnlineList',
            registerCommand: 'commands/registerCommand',
            deleteCommand: 'commands/deleteCommand',
        }),
        changeConnectionState: function(isConnected) {
            if(!isConnected) alert('Потеряна связь с сервером');
        },
        createConnection: function() {
            const hubConnection = new HubConnectionBuilder()
                .withUrl(API_URL.ROOT + API_URL.HUB, { accessTokenFactory: () => this.accessToken })
                .configureLogging(LogLevel.Information)
                .build();
            hubConnection.serverTimeoutInMilliseconds = 20 * 60000;       // время таймаута (минут) 
            hubConnection.keepAliveIntervalInMilliseconds = 10 * 60000;   // время жизни соединения
            return hubConnection;
        },
        startLoadingUsers: function() {
            this.showLoader('Получение списка онлайна...');
            setTimeout(async () => {
                let isLoadUsers = await this.loadOnlineUsers();
                if(isLoadUsers) this.hideLoader();
                else this.startLoadingUsers();
            }, 200);
        },
    },
    mounted: async function() {
        this.showLoader('Подключение к серверу');
        // команда выхода из чата
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_EXIT, command: () => {
            this.$router.push(ROUTING.OUT_PAGE);
        }});
        // добавление и удаление юзера из списка онлайн
        // this.registerCommand({commandName: CHAT_COMMANDS.USER_ENTER, command: (data) => this.addUser(data)});
        // this.registerCommand({commandName: CHAT_COMMANDS.USER_EXIT, command: (id) => this.removeUser(id)});

        if(this.hubConnection === undefined) {
            // создаём подключение
            this.setConnection(this.createConnection());
            // регистрируем команды
            this.registerAction({ name: CHAT_COMMANDS.RECEIVE_MESSAGE, command: (data) => 
            this.runCommand({commandName: CHAT_COMMANDS.ACTION_ADD_MESSAGE, payload: data}) });                         // вывод сообщения
            this.registerAction({ name: CHAT_COMMANDS.USER_ENTER, command: (data) => this.addUser(data) });             // добавление юзера в список онлайна
            this.registerAction({ name: CHAT_COMMANDS.USER_EXIT, command: (id) => this.removeUser(id) });               // удаление юзера из списка онлайн
        }
        // подключаемся к серверу
        await this.connectToHub();
        this.hideLoader();
        this.$watch('isConnected', this.changeConnectionState);
        this.startLoadingUsers();
    },
    beforeDestroy: function() {
        this.closeConnection();
        this.deleteCommand(CHAT_COMMANDS.ACTION_EXIT);
        // this.deleteCommand(CHAT_COMMANDS.USER_ENTER);
        // this.deleteCommand(CHAT_COMMANDS.USER_EXIT);
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