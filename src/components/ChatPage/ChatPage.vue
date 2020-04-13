<template>
    <div id="chat" :class="{ limitedWidth: isLimitedWidth }">
        <div class="firstLine">
            <!-- Основной блок -->
            <chat-main id="chatMain" v-if="isConnected" />
            <!-- Боковой блок -->
            <chat-aside id="chatAside" :class="{minimize: !isShowSidebar}" v-if="isConnected" />
        </div>
        <div class="secondLine">
            <!-- форма отправки сообщения -->
            <send-message-form id="sendingForm" v-if="isConnected" />
            <!-- Менюшка навигации -->
            <chat-nav-menu id="chatNavMenu" />
        </div>
        <!-- Подвал -->
        <chat-footer id="chatFooter" />

        <!-- Модальное окно -->
        <component v-if="isShowModal" :is="modalComponent" />
    </div>
</template>

<script>
const MAX_ITERATIONS = 4;

import { mapGetters, mapActions, mapMutations } from 'vuex';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

// компоненты
import sendMessageForm from './SendMessageForm.vue';
import chatAside from './ChatAsideView.vue';
import chatNavMenu from './ChatNavMenu.vue';
import chatFooter from './ChatFooterView.vue';
import chatMain from './ChatMainView.vue';
import userSettingsComponent from './ChatUserSettings.vue';
// константы
import {API_URL, CHAT_COMMANDS, ROUTING} from '../../constants.js';

export default {
    name: "ChatPage",
    components: {
        sendMessageForm,
        chatAside,
        chatNavMenu,
        chatFooter,
        chatMain,
    },
    data: function() {
        return {
            connectionIterations: 0,
            loadingOnlineUsersIterations: 0,
        }
    },
    computed: {
        ...mapGetters({
            isShowSidebar: 'chat/isShowSidebar',
            isLimitedWidth: 'chat/isLimitedChatWidth',
            accessToken: 'auth/token',
            hubConnection: 'connection/connection',
            isConnected: 'connection/isConnected',
            modalComponent: 'chat/modalComponent',
            isShowModal: 'chat/showModal',
            userId: 'auth/userId',
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
            showText: 'showText',
            hideLoader: 'hideLoader',
            setConnection: 'connection/setConnection',
            registerAction: 'connection/registerAction',
            removeAction: 'connection/removeAction',
            addUser: 'users/addUserToOnlineList',
            removeUser: 'users/removeUserFromOnlineList',
            registerCommand: 'commands/registerCommand',
            deleteCommand: 'commands/deleteCommand',
            showModal: 'chat/showModal',
            hideModal: 'chat/hideModal',
            updateCurrentUserName: 'auth/updateUserName',
        }),
        createConnection: function() {
            const hubConnection = new HubConnectionBuilder()
                .withUrl(API_URL.ROOT + API_URL.HUB, { accessTokenFactory: () => this.accessToken })
                .configureLogging(LogLevel.Information)
                .build();
            hubConnection.serverTimeoutInMilliseconds = 1 * 60000;       // время таймаута (минут) 
            //hubConnection.keepAliveIntervalInMilliseconds = 10 * 60000;   // время жизни соединения

            // Обработка дисконнекта от сервера - повторное авто-подключение
            hubConnection.onclose( (err) => {
                if(err != undefined) {
                    this.showText('Соединение разорвано... Сейчас попытаемся восстановить');
                    this.connectionIterations = 0;
                    setTimeout(async () => {
                        this.hideLoader();
                        let reconnected = await this.startConnection();
                        if(!reconnected) { 
                            this.showText('Сервер недоступен');
                            setTimeout(() => {
                                this.hideLoader();
                                this.runCommand({commandName: CHAT_COMMANDS.ACTION_EXIT});
                            }, 2000);
                        }
                    }, 2000);
                }
            });
            return hubConnection;
        },
        // метод пытается подключиться к хабу
        startConnection: async function() {
            this.showLoader(`Подключение к серверу (${this.connectionIterations + 1})`);
            // если подключение не существует - создаём новое
            if(this.hubConnection === undefined) {
                this.setConnection(this.createConnection());
                // регистрируем команды
                this.registerAction({ name: CHAT_COMMANDS.RECEIVE_MESSAGE, command: (data) =>                       // вывод сообщения
                    this.runCommand({commandName: CHAT_COMMANDS.ACTION_ADD_MESSAGE, payload: data})
                });
                this.registerAction({ name: CHAT_COMMANDS.USER_ENTER, command: (data) => this.addUser(data) });     // добавление юзера в список онлайна
                this.registerAction({ name: CHAT_COMMANDS.USER_EXIT, command: (id) => this.removeUser(id) });       // удаление юзера из списка онлайн
                // обновление данных текущего юзера
                this.registerAction({ name: CHAT_COMMANDS.USER_ENTER, command: (data) => {
                    if(data.userId === this.userId) this.updateCurrentUserName(data.name);
                } });
            }

            // подключаемся к серверу
            let connectResult = false;
            try {
                await this.connectToHub();
                connectResult = true;
            } catch {
                if(this.connectionIterations < MAX_ITERATIONS) {
                    this.connectionIterations++;
                    connectResult = await this.startConnection();
                }
            }
            this.hideLoader();
            return connectResult;
        },
        // Метод пытается загрузить список юзеров онлайн
        startLoadingUsers: function() {
            this.showLoader('Получение списка онлайна...');
            setTimeout(async () => {
                let isLoadUsers = await this.loadOnlineUsers();
                if(isLoadUsers > 0) this.hideLoader();
                else {
                    this.loadingOnlineUsersIterations++;
                    if(this.loadingOnlineUsersIterations < MAX_ITERATIONS) this.startLoadingUsers();
                    else {
                        this.showText('Не удалось подключиться к серверу... Попробуйте обновить страницу.');
                        setTimeout(() => {
                            this.hideLoader();
                            this.runCommand({commandName: CHAT_COMMANDS.ACTION_EXIT});
                        }, 2000);
                    }
                }
            }, 600);
        },
    },
    mounted: async function() {
        
        // команда выхода из чата
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_EXIT, command: async () => {
            await this.$store.dispatch('connection/send', { command: CHAT_COMMANDS.ACTION_EXIT });
            this.$router.push(ROUTING.OUT_PAGE);
        }});
        // команда отображает настройки профиля
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_SHOW_SETTINGS, command: () => this.showModal(userSettingsComponent)});
        // команда закрывает любое всплывающее окно (настройки/профиль/etc)
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_CLOSE_MODAL, command: this.hideModal});
        // добавление и удаление юзера из списка онлайн
        // this.registerCommand({commandName: CHAT_COMMANDS.USER_ENTER, command: (data) => this.addUser(data)});
        // this.registerCommand({commandName: CHAT_COMMANDS.USER_EXIT, command: (id) => this.removeUser(id)});

        
        let connectedResult = await this.startConnection();
        if(connectedResult) {
            this.loadingOnlineUsersIterations = 0;
            this.startLoadingUsers();
        } else {
            this.showText('Не удалось подключиться к серверу...');
            setTimeout(() => {
                this.hideLoader();
                this.runCommand({commandName: CHAT_COMMANDS.ACTION_EXIT});
            }, 5000);
        }
    },
    beforeDestroy: function() {
        this.closeConnection();
        this.deleteCommand(CHAT_COMMANDS.ACTION_EXIT);
        this.deleteCommand(CHAT_COMMANDS.ACTION_SHOW_SETTINGS);
        // this.deleteCommand(CHAT_COMMANDS.USER_ENTER);
        // this.deleteCommand(CHAT_COMMANDS.USER_EXIT);
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";
    @double-border: @base-border-width*2;

    #chat {
        display: flex;
        flex-direction: column;
        justify-content: space-between;;
        width: calc(100% - 50px);
        max-width: 100%;
        height: calc(100vh - @double-border);
        overflow: hidden;
        padding: 0 10px;
        padding-bottom: 0;
        cursor: default;
        transition: max-width .5s;
        &.limitedWidth {
            max-width: 85rem;
        }

        .firstLine {
            flex-grow: 1;
            flex-shrink: 1;
            flex-basis: 0;
            display: flex;
            flex-direction: row;
            height: 10rem;

            #chatMain {
                flex-grow: 1;
                min-width: 25rem;;
            }
            #chatAside {
                flex-grow: 0;
                width: 22vw;
                min-width: 16.5rem;
                max-width: 20rem;
                transition: all .5s;
                &.minimize {
                    min-width: 0rem;
                    width: 0vw;
                }
            }
        }
        .secondLine {
            flex-grow: 0;
            flex-shrink: 0;
            flex-basis: content;
        }
        #chatFooter {
            flex-grow: 0;
            flex-shrink: 1;
            flex-basis: content;
        }
        
    }
</style>