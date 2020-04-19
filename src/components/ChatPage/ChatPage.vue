<template>
    <div id="chat" :class="{ limitedWidth: isLimitedWidth, isDataNotLoaded: !isDataLoaded, hideSideBar: (!isShowSidebar || !isDataLoaded) }">
        <div class="firstLine">
            <!-- Основной блок -->
            <chat-main id="chatMain" />
            <!-- Боковой блок -->
            <chat-aside id="chatAside" />
        </div>
        <div class="secondLine">
            <!-- форма отправки сообщения -->
            <send-message-form id="sendingForm" />
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
import smileSelector from './ChatSmilesSelector.vue';
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
            modalComponent: 'chat/modalComponent',
            isShowModal: 'chat/showModal',
            userId: 'auth/userId',
            isDataLoaded: 'connection/isDataLoaded',
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
            setDataLoadedState: 'connection/setDataLoaded',
            addUser: 'users/addUserToOnlineList',
            removeUser: 'users/removeUserFromOnlineList',
            registerCommand: 'commands/registerCommand',
            deleteCommand: 'commands/deleteCommand',
            showModal: 'chat/showModal',
            hideModal: 'chat/hideModal',
            updateCurrentUserName: 'auth/updateUserName',
            changeAsideBlockMode: 'chat/changeAsideBlockMode',
        }),


        createConnection: function() {
            // TODO: отключить логи
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
        startLoadingUsers: async function() {
            // тут уведомление о загрузке юзеров?

            let isLoadUsers = await this.loadOnlineUsers();
            if(isLoadUsers > 0) {
                // действие при успешной загрузке
                this.setDataLoadedState();  // мутация устанавливает флаг успешной загрузки данных
                this.runCommand({commandName: CHAT_COMMANDS.ACTION_SCROLL_TO_LAST_MESSAGE});
            }
            else {
                this.loadingOnlineUsersIterations++;
                if(this.loadingOnlineUsersIterations < MAX_ITERATIONS) {
                    setTimeout(this.startLoadingUsers, 600);
                } else {
                    this.showText('Возникли проблемы получения данных с сервера, это какой-то баг...');
                    setTimeout(() => {
                        // выход из чата
                        this.runCommand({commandName: CHAT_COMMANDS.ACTION_EXIT});
                    }, 2000);
                }
            }
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
        // команда открывает окно настройки смайликов
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_SHOW_SMILES_SETTINGS, command: () => this.showModal(smileSelector)});
        // команда закрывает любое всплывающее окно (настройки/профиль/etc)
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_CLOSE_MODAL, command: () => {
            this.hideModal();
            this.runCommand({commandName: CHAT_COMMANDS.ACTION_FOCUS_INPUT_FIELD});
        } });
        // добавление и удаление юзера из списка онлайн
        // this.registerCommand({commandName: CHAT_COMMANDS.USER_ENTER, command: (data) => this.addUser(data)});
        // this.registerCommand({commandName: CHAT_COMMANDS.USER_EXIT, command: (id) => this.removeUser(id)});
        
        // команда показывает или скрывает боковую панель
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_CHANGE_SIDEBAR, command: this.changeAsideBlockMode});

        
        // Подключаемся к серверу
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
        this.setDataLoadedState(false);
        this.deleteCommand(CHAT_COMMANDS.ACTION_EXIT);
        this.deleteCommand(CHAT_COMMANDS.ACTION_SHOW_SETTINGS);
        this.deleteCommand(CHAT_COMMANDS.ACTION_CLOSE_MODAL);
        this.deleteCommand(CHAT_COMMANDS.ACTION_SHOW_SMILES_SETTINGS);
        this.deleteCommand(CHAT_COMMANDS.ACTION_CHANGE_SIDEBAR);
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
        justify-content: space-between;
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
            flex-basis: 0%;
            display: flex;
            flex-direction: row;
            height: 10rem;
            overflow: hidden;
            justify-content: center;

            #chatMain {
                flex-grow: 1;
                flex-shrink: 1;
                width: 5rem;
            }
            #chatAside {
                flex-grow: 0;
                width: 22vw;
                min-width: 16.5rem;
                max-width: 20rem;
                transition: all .5s;
            }
        }
        .secondLine {
            flex-grow: 0;
            flex-shrink: 0;
            height: auto;
            overflow: hidden;
            max-height: 10rem;
            transition: max-height .5s;
        }
        #chatFooter {
            flex-grow: 0;
            flex-shrink: 1;
        }

        &.isDataNotLoaded {
            .secondLine {
                max-height: 0;
            }
        } 
        &.hideSideBar {
            #chatAside {
                min-width: 0rem;
                width: 0vw;
            }
        }       
    }

    @media screen and (max-width: 699px) {
        #chat {
            width: 100%;
            
            .firstLine #chatAside {
                min-width: 0;
                width: 0;
            }
            #chatFooter {
                display: none;
            }
            .secondLine {
                margin-bottom: 1.5rem;
            }
            &.hideSideBar {
                #chatMain {
                    max-width: 0;
                    margin: 0;
                    padding: 0;
                    border: none;
                }
                #chatAside {
                    flex-grow: 1;
                    width: auto;
                    min-width: unset;
                }
            }
        }
    }
    @media screen and (max-height: 599px) {
        #chat #chatFooter {
            display: none;
        }
        #chat .secondLine {
            margin-bottom: 0;
        }
    }
</style>