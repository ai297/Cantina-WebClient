<template>
    <div class="nav-menu">
        <div class="nav-menu__menu" :class="{showed: show}">
            <ul>
                <li v-if="isDeveloper"><router-link :to="{name: 'cmd'}">cmd</router-link></li>
                <li><router-link :to="{name: 'intro'}">Космос</router-link></li>
                <li><router-link :to="{name: 'archive'}">Архив</router-link></li>
                <li><router-link :to="{name: 'chat'}">{{isConnected ? `Кантина${(unreadMessages > 0) ? '('+unreadMessages+')': ''}` : 'Войти в Кантину'}}</router-link></li>
                <template v-if="isConnected">
                    <!--<li><a @click.prevent="exit">Выйти из Кантины</a></li>-->
                    <li><a @click.prevent="changeStatus">{{(currentUser.status==2 || currentUser.status==3)? 'Вернуться' : 'Отойти'}}</a></li>
                </template>
                <li v-if="isAuth"><a @click.prevent="logOut" title="Разлогиниться">Выход</a></li>
            </ul>
        </div>
        <volume-button id="menu-button" @focus="show = true" @blur="hideMenu">☰</volume-button>
    </div>
</template>

<script>
import {mapActions, mapMutations, mapGetters} from 'vuex';
import {ROLES, CHAT_COMMANDS, STATUS} from '../../constants.js';

export default {
    name: "NavMenu",
    data: function() {
        return {
            show: false,
        }
    },
    computed: {
        ...mapGetters({
            isAuth: 'auth/isAuth',
            isConnected: 'connection/isConnected',
            currentUser: 'users/currentUser',
            unreadMessages: 'messages/unreadMessages',
        }),
        isDeveloper: function(){
            return this.$store.getters['auth/role'] == ROLES.DEVELOPER;
        },
    },
    methods: {
        ...mapMutations({
            showModal: 'showModal',
            showInteractive: 'chat/showInteractive',
            registerCommand: 'commands/registerCommand',
            deleteCommand: 'commands/deleteCommand',
        }),
        ...mapActions({
            runCommand: 'commands/run',
            sendToServer: 'connection/send',
        }),
        hideMenu: function() {
            setTimeout(() => {
                this.show = false;
            }, 50);
        },
        exit: function() {
            this.runCommand({commandName: CHAT_COMMANDS.ACTION_EXIT});
        },
        enter: function() {
            this.runCommand({commandName: CHAT_COMMANDS.ACTION_ENTER});
        },
        logOut: function() {
            this.runCommand({commandName: CHAT_COMMANDS.ACTION_LOGOUT});
        },
        changeStatus: function() {
            if(this.currentUser.status == STATUS.NOT_AVAILABLE || this.currentUser.status == STATUS.NOT_ACTIVE) this.sendToServer({command: CHAT_COMMANDS.SET_STATUS, data: STATUS.ONLINE});
            else if(this.currentUser.status == STATUS.ONLINE) this.sendToServer({command: CHAT_COMMANDS.SET_STATUS, data: STATUS.NOT_AVAILABLE});
        },
    },
}
</script>

<style lang="less">
    @import "../../less/vars.less";

    div.nav-menu {
        display: flex;
        flex-direction: row;
        padding: .8em 0;
        line-height: @base-fontsize;
        margin-bottom: .5em;
        position: relative;
        justify-content: center;

        .nav-menu__menu {
            display: flex;
            flex-direction: column;
            position: relative;
            align-items: center;
            justify-content: flex-end;
            ul {
                display: block;
                text-align: center;
                & > li {
                    display: inline-block;
                    &::before, &:last-child::after {
                        content: '•';
                        color: @blue;
                    }
                }
                li > a {
                    font-family: @main-font;
                    display: inline-block;
                    text-decoration: none;
                    color: @base-font-color;
                    font-weight: normal;
                    &::before {
                        content: '[';
                        opacity: 0;
                        margin: 0 @base-padding / 2;
                    }
                    &::after {
                        content: ']';
                        margin: 0 @base-padding / 2;
                        opacity: 0;
                    }
                    &:hover {
                        color: @gold;
                        text-decoration: none;
                        &::before, &::after {
                            opacity: 1;
                            color: @blue;
                        }
                    }
                    &:focus, &.router-link-active {
                        outline: none;
                        color: @blue;
                        &::before, &::after {
                            opacity: 1;
                            color: @blue;
                        }
                    }
                }
            }
        }
        #menu-button {
            display: none;
        }
    }

    @media screen and (max-width: 699px) {
        div.nav-menu {
            padding: @base-padding 0;
            width: 100%;
            .nav-menu__menu {
                display: none;
                position: absolute;
                bottom: 100%;
                left: 0;
                width: 100%;
                ul {
                    width: 90%;
                    background-color: @dark-grey;
                    margin-bottom: .5em;
                    & > li {
                        display: block;
                        padding: .5em;
                        border: @base-border-width solid @content-bgcolor;
                        &::before, &::after {
                            content: '';
                            display: none;
                        }
                    }
                }
                &.showed {
                    display: flex;
                }
            }
            #menu-button {
                display: inline-block;
            }
        }
    }
</style>