<template>
    <div class="main-page" @mousedown="swipeChecker" @mouseup="swipeChecker" @touchstart="swipeChecker" @touchend="swipeChecker" >
        <keep-alive :max="10">
            <router-view class="content" :class="{limitedWidth: isLimitedWidth}" ref="content"/>
        </keep-alive>
        <!-- Навигация по чату -->
        <chat-nav-menu class="nav-menu" />
        <!-- Подвал -->
        <chat-footer class="footer" />
        <!-- плеер для звука нового сообщения -->
        <audio ref="newMessageSoundPlayer" preload>
            <source src="/sounds/newMessage.ogg" type="audio/ogg">
            <source src="/sounds/newMessage.mp3" type="audio/mpeg">
        </audio>
    </div>
</template>

<script>

import { mapGetters, mapMutations, mapActions } from 'vuex';

// компоненты
import chatNavMenu from './NavMenu.vue';
import chatFooter from './Footer.vue';

// константы
import { CHAT_COMMANDS, ROUTING, API_URL } from '../../constants.js';

const MAX_ITERATIONS = 4;

export default {
    name: "ChatPage",
    components: {
        chatNavMenu,
        chatFooter,
    },
    data: function() {
        return {
            connectionIterations: 0,
            reConnectionTimer: null,

            pageTitle: '',
            shortTitle: false,
            titleUpdater: undefined,

            pointer: {
                x: 0,
                y: 0,
            },
            scrollSpeed: 1,
            swipeTimer: null,

            unreadMessages: 0,
        }
    },
    computed: {
        ...mapGetters({
            isWindowFocused: 'isWindowFocused',
            isLimitedWidth: 'chat/isLimitedChatWidth',
            soundNotice: 'messages/soundNotice',
            isMessageLoaded: 'messages/oldMessageLoaded',

            userId: 'auth/userId',

            isConnected: 'connection/isConnected',
        }),
    },
    watch: {
        isWindowFocused: function(val) {
            if(val) {
                this.unreadMessages = 0;
                clearTimeout(this.titleUpdater);
            }
            this.updatePageTitle();
        },
        unreadMessages: function(val) {
            this.setUnreadMessages(val);
        }
    },
    methods: {
        ...mapActions({
            runCommand: 'commands/run',
            connect: 'connection/connect',
            disconnect: 'connection/disconnect',
            loadOnlineUsers: 'users/loadOnlineUsers',
            logout: 'auth/logout',
        }),
        ...mapMutations({
            showLoader: 'showLoader',
            showText: 'showText',
            hideLoader: 'hideLoader',

            addUser: 'users/addUserToOnlineList',
            removeUser: 'users/removeUserFromOnlineList',
            setUserId: 'users/setCurrentUserId',
            clearUserList: 'users/clearUserList',

            registerCommand: 'commands/registerCommand',
            deleteCommand: 'commands/deleteCommand',

            addMessage: 'messages/addMessage',
            clearMessages: 'messages/clearMessages',
            messageLoaded: 'messages/oldMessageLoaded',
            setUnreadMessages: 'messages/setUnreadMessages',

            registerServerAction: 'connection/register_action',
            removeServerAction: 'connection/remove_action',
            setCloseConnectionHook: 'connection/onCloseConnection',
            sendToServer: 'connection/send',
        }),

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
                //alert('свайп работает');
            }
        },
        // смена панелей свайпом
        swipePanels: function(direction) {
            if(direction == "left" && this.$refs['content'].$el.scrollLeft + this.scrollSpeed < this.$refs['content'].$el.scrollWidth - this.$refs['content'].$el.clientWidth) {
                this.$refs['content'].$el.scrollLeft += this.scrollSpeed;
                this.scrollSpeed++;
                this.swipeTimer = setTimeout(() => this.swipePanels("left"), 10);
            }
            else if(direction == "left") {
                this.scrollSpeed = 1;
                this.$refs['content'].$el.scrollLeft = this.$refs['content'].$el.scrollWidth - this.$refs['content'].$el.clientWidth;
            }
            else if(direction == "right" && this.$refs['content'].$el.scrollLeft - this.scrollSpeed > 0) {
                this.$refs['content'].$el.scrollLeft -= this.scrollSpeed;
                this.scrollSpeed++;
                this.swipeTimer = setTimeout(() => this.swipePanels("right"), 10);
            } else if(direction == "right") {
                this.scrollSpeed = 1;
                this.$refs['content'].$el.scrollLeft = 0;
            }
        },

        // функция получения нового сообщения
        reciveMessage: function(message) {
            this.addMessage(message);
            if(this.isPersonal(message.recipients) && this.isMessageLoaded) {
                this.playNewMessageSound();
            }
            if(!this.isWindowFocused) this.unreadMessages++;
            this.updatePageTitle();
        },
        isPersonal: function(recipients) {
            if(Array.isArray(recipients)) {
                return recipients.includes(this.userId);
            }
            else if(recipients == this.userId) return true;
            return false;
        },

        // уведомление в заголовке страницы
        updatePageTitle: function() {
            if(this.unreadMessages > 0 && !this.isWindowFocused) {
                document.getElementById("favicon").href="/icons/favicon-d.png";
                if(this.shortTitle) document.title = `(${this.unreadMessages}) ${this.pageTitle}`;
                else document.title = `(${this.unreadMessages})\n`;
                this.shortTitle = !this.shortTitle;
                clearTimeout(this.titleUpdater);
                this.titleUpdater = setTimeout(this.updatePageTitle, 500);
            }
            else {
                document.getElementById("favicon").href="/icons/favicon.png";
                document.title = this.pageTitle;
            }
        },

        // звук сообщения
        playNewMessageSound: function() {
            if(this.soundNotice) this.$refs['newMessageSoundPlayer'].play();
        },

        connectToServer: function() {
            if(!this.isConnected) {
                this.showLoader('Подключение'+'.'.repeat(this.connectionIterations));
                this.connect()
                .then(() => {
                    this.connectionIterations = 0;
                    clearTimeout(this.reConnectionTimer);
                })
                .catch(() => {
                    this.connectionIterations++;
                    if(this.connectionIterations < MAX_ITERATIONS) setTimeout(this.connectToServer, 500 * Math.ceil(this.connectionIterations / 2));
                    else {
                        this.showText("Не удалось подключиться к серверу");
                        setTimeout(() => {
                            this.$router.push(ROUTING.OUT_PAGE);
                        }, 3000);
                    }
                });
            }
        },

        loadData: function() {
            this.showLoader("Загрузка посетителей...");
            this.messageLoaded();
            this.runCommand({commandName: CHAT_COMMANDS.ACTION_FOCUS_INPUT_FIELD});
            this.loadOnlineUsers().then(result => {
                if(result) this.hideLoader();
                else {
                    this.showText("Что-то пошло не так. Попробуйте обновить страницу.");
                }
            })
            .catch(() => {
                this.showText("Ошибка загрузки. Попробуйте обновить страницу.");
            });
        },

        onConnectionClose: function() {
            this.clearMessages();
            this.clearUserList();
            this.showText("Соединение разорвано");
            setTimeout(() => {
                //this.$router.push(ROUTING.OUT_PAGE);
                this.runCommand({commandName: CHAT_COMMANDS.ACTION_LOGOUT});
            }, 3000);
        },

    },
    created: function() {
        this.showLoader('Проверка соединения...');
        
        // устанавливаем Id текущего юзера
        this.setUserId(this.userId);

        // регистрируем методы, вызываемые хабом
        this.setCloseConnectionHook(this.onConnectionClose);                                                    // метод для реагирования на разрыв соединения
        this.registerServerAction({type: CHAT_COMMANDS.RECEIVE_MESSAGE, action: this.reciveMessage});           // получение сообщения от сервера
        this.registerServerAction({type: CHAT_COMMANDS.MESSAGES_LOADED, action: this.loadData});                // хук, срабатывает когда все старые сообщения загружены
        this.registerServerAction({type: CHAT_COMMANDS.USER_ENTER, action: (data) => {                          // добавить юзера в список онлайна
            if(this.isMessageLoaded) this.addUser(data);
        }});
        this.registerServerAction({type: CHAT_COMMANDS.USER_EXIT, action: (data) => {                           // удалить юзера из списка онлайна
            if(this.isMessageLoaded) this.removeUser(data);
        }});
        
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_EXIT, command: () => {                          // команда выхода из чата
            this.disconnect().then(() => {
                this.clearMessages();
                this.clearUserList();
                this.$router.push(ROUTING.OUT_PAGE);
            });
        }});
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_LOGOUT, command: () => {                         // команда разлогиниться
            if(this.isConnected) this.disconnect().then(() => {
                this.clearMessages();
                this.clearUserList();
                this.logout();
                this.$router.push("/");
            });
            else {
                this.clearMessages();
                this.clearUserList();
                this.logout();
                this.$router.push("/");
            }
        }});
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_ENTER, command: this.connectToServer});
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_ADD_MESSAGE, command: this.reciveMessage});     // Команда добавления нового сообщения

        // проверяем, был ли юзер в списке онлайна на сервере и если был - возобновляем подключение
        if(!this.isConnected) this.$http.get(API_URL.USERINFO)
        .then( () => {
            this.connectToServer();
        })
        .catch( error => {
            //console.log(error.response);
            if(error.response !== undefined) {
                if(error.response.status === 400) this.hideLoader();
                else this.showText("Что-то сломалось. Попробуйте обновить страницу.");
            } else {
                this.showText("Не удалось подключиться к серверу");
                setTimeout(() => {
                    this.$router.push({name: 'welcome'}).catch(() => {});
                }, 3000);
            }
        });
        else this.hideLoader();
    },
    mounted: function() {
        this.$refs['newMessageSoundPlayer'].volume = 0.7;
        this.pageTitle = document.title;
    },
    beforeDestroy: function() {
        this.removeServerAction(this.reciveMessage);
        this.removeServerAction(this.messageLoaded);
        this.removeServerAction(this.addUser);
        this.removeServerAction(this.removeUser);

        // await this.$store.dispatch('connection/send', { command: CHAT_COMMANDS.ACTION_EXIT });
        // this.closeConnection();
        this.deleteCommand(CHAT_COMMANDS.ACTION_ENTER);
        this.deleteCommand(CHAT_COMMANDS.ACTION_ADD_MESSAGE);
        this.deleteCommand(CHAT_COMMANDS.ACTION_EXIT);
        // this.messageLoaded(false);
        this.clearMessages();
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";

    .main-page {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        padding: 0 10px;
        padding-bottom: 0;
        cursor: default;
        position: relative;
        .content {
            flex-grow: 1;
            flex-shrink: 1;
            box-sizing: border-box;
            
            display: flex;
            flex-direction: row;
            overflow: hidden;
            max-width: 100%;
            width: 100%;
            transition: max-width .5s;
            
            &.limitedWidth {
                max-width: 85rem;
            }
        }
        .nav-menu {
            flex-grow: 0;
            flex-shrink: 0;
        }
        .footer {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
        }
    }

    @media screen and (max-height: 599px) {
        #main .footer {
            display: none;
        }
    }
</style>