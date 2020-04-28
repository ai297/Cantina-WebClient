<template>
    <div id="chat"
    :class="{ limitedWidth: isLimitedWidth, isDataNotLoaded: !isDataLoaded, hideSideBar: ((!isShowSidebar && !isMinWidth() )|| !isDataLoaded) }"
    @mousedown="swipeChecker" @mouseup="swipeChecker"
    @touchstart="swipeChecker" @touchend="swipeChecker">
        <div class="firstLine" :style="{'flex-direction': (reverseDirection && !isMinWidth()) ? 'row-reverse' : 'row'}" ref="panels">
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
import sendMessageForm from './SendMessageForm/SendMessageForm.vue';
import chatAside from './ChatAsideView.vue';
import chatNavMenu from './ChatNavMenu.vue';
import chatMain from './ChatMainView.vue';
import chatFooter from '../FooterView.vue';
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
            pointer: {
                x: 0,
                y: 0,
            },
            scrollSpeed: 1,
            swipeTimer: null
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
            reverseDirection: 'chat/isReversedDirection',
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
            changeAsideBlockMode: 'chat/changeAsideBlockMode',
            setCurrentUserId: 'users/setCurrentUserId',
        }),
        isMinWidth: function() {
            return window.innerWidth < 700;
        },
        // Определяем событие свайпа
        swipeChecker: function(e) {
            // нажатие мыши
            let dX = 0;
            let dY = 0;
            if(e.type == "mousedown") {
                this.pointer.x = e.screenX;
                this.pointer.y = e.screenY;
                return;
            }
            // касание тачскрина
            else if(e.type == "touchstart") {
                this.pointer.x = e.changedTouches[0].screenX;
                this.pointer.y = e.changedTouches[0].screenY;
                return;
            }
            // отпускание мыши
            else if(e.type == "mouseup") {
                dX = e.screenX - this.pointer.x;
                dY = e.screenY - this.pointer.y;
            }
            // отпускание тачскрина
            else if(e.type == "touchend") {
                dX = e.changedTouches[0].screenX - this.pointer.x;
                dY = e.changedTouches[0].screenY - this.pointer.y;
            }
            // определяем свайп
            let isHorizontal = Math.abs(dX) > Math.abs(dY);
            let checkDistance = false;
            if(isHorizontal) checkDistance = window.innerWidth / 5 <= Math.abs(dX);
            else checkDistance = window.innerHeight / 5 <= Math.abs(dY);
            if(isHorizontal && dX > 0 && checkDistance) {
                // свайп вправо
                this.swipePanels("right");
            } else if(isHorizontal && dX < 0 && checkDistance) {
                // свайп влево
                this.swipePanels("left");
            } else if(dY > 0 && checkDistance) {
                // свайп вниз
            } else if(dY < 0 && checkDistance) {
                // свайп вверх
            }
        },
        // смена панелей свайпом
        swipePanels: function(direction) {
            if(direction == "left" && this.$refs['panels'].scrollLeft + this.scrollSpeed < this.$refs['panels'].scrollWidth - this.$refs['panels'].clientWidth) {
                this.$refs['panels'].scrollLeft += this.scrollSpeed;
                this.scrollSpeed++;
                this.swipeTimer = setTimeout(() => this.swipePanels("left"), 10);
            }
            else if(direction == "left") {
                this.scrollSpeed = 1;
                this.$refs['panels'].scrollLeft = this.$refs['panels'].scrollWidth - this.$refs['panels'].clientWidth;
            }
            else if(direction == "right" && this.$refs['panels'].scrollLeft - this.scrollSpeed > 0) {
                this.$refs['panels'].scrollLeft -= this.scrollSpeed;
                this.scrollSpeed++;
                this.swipeTimer = setTimeout(() => this.swipePanels("right"), 10);
            } else if(direction == "right") {
                this.scrollSpeed = 1;
                this.$refs['panels'].scrollLeft = 0;
            }
        },

        createConnection: function() {
            // TODO: отключить логи
            const hubConnection = new HubConnectionBuilder()
                .withUrl(API_URL.ROOT + API_URL.HUB, { accessTokenFactory: () => this.accessToken })
                .configureLogging(LogLevel.Information)
                .build();
            hubConnection.serverTimeoutInMilliseconds = 2 * 60000;       // время таймаута (минут * 60000)
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
                setTimeout(() => this.runCommand({commandName: CHAT_COMMANDS.ACTION_SCROLL_TO_LAST_MESSAGE}), 500);
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
        this.setCurrentUserId(this.userId);
        // команда выхода из чата
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_EXIT, command: () => {
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
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_SWIPE_PANELS, command: this.swipePanels});

        
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
    beforeDestroy: async function() {
        await this.$store.dispatch('connection/send', { command: CHAT_COMMANDS.ACTION_EXIT });
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
            height: 10rem;
            overflow: hidden;
            justify-content: flex-start;
            box-sizing: border-box;

            #chatMain {
                flex-grow: 1;
                flex-shrink: 1;
                width: 5rem;
            }
            #chatAside {
                flex-grow: 0;
                flex-shrink: 0;
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
                &:hover {
                    width: 22vw;
                    min-width: 16.5rem;
                }
            }
        }       
    }

    @media screen and (max-width: 699px) {
        #chat {
            width: 100%;
            
            .firstLine {
                #chatMain {
                    flex-shrink: 0;
                    padding: 0;
                    margin: 0;
                    flex-basis: 100%;
                    border: 0;
                }
                #chatAside {
                    flex-basis: 100%;
                    flex-shrink: 0;
                    max-width: unset;
                }
            }
            #chatFooter {
                display: none;
            }
            .secondLine {
                margin-bottom: 1.5rem;
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