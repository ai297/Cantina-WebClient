<template>
    <ul class="chatNavMenu">
        <li v-if="isAdmin"><a @click.prevent="showConsole">Cmd</a></li>
        <li><a @click.prevent="showArchive">Архив</a></li>
        <li><a @click.prevent="showSettings">Профиль</a></li>
        <li><a @click.prevent="exit" class="exitLink">Выход</a></li>
        <li><a @click.prevent="changeStatus">{{(currentUser.status==2 || currentUser.status==3)? 'Вернуться' : 'Отойти'}}</a></li>
    </ul>
</template>

<script>
import {mapActions, mapMutations, mapGetters} from 'vuex';
import {ROLES, CHAT_COMMANDS, STATUS} from '../../constants.js';
import profileSettings from './ChatUserSettings.vue';
import archiveDateSelector from '../ArchivePage/ArchiveDatesPanel.vue';

const adminConsole = () => ({
  // Загружаемый компонент. Значение должно быть Promise
  component: import("../Interactive/AdminConsole.vue"),
  // Компонент загрузки, используемый пока загружается асинхронный компонент
  //loading: LoadingComponent,
  // Компонент ошибки, используемый при неудачной загрузке
  error: "div",
  // Задержка перед показом компонента загрузки. По умолчанию: 200 мс.
  //delay: 200,
  // Компонент ошибки будет отображаться, если таймаут
  // был указан и время ожидания превышено. По умолчанию: Infinity.
  timeout: 3000
});

export default {
    name: "ChatNavMenu",
    computed: {
        ...mapGetters({
            currentUser: 'users/currentUser',
        }),
        isAdmin: function(){
            return this.$store.getters['auth/role'] == ROLES.ADMIN;
        },
    },
    methods: {
        ...mapMutations({
            showInteractive: 'chat/showInteractive',
            showModal: 'showModal',
        }),
        ...mapActions({
            runCommand: 'commands/run',
            sendToServer: 'connection/send',
        }),
        showConsole: function() {
            if(this.isAdmin) {
                this.showInteractive(adminConsole);
            }
        },
        showSettings: function() {
            this.showModal(profileSettings);
        },
        exit: function() {
            this.runCommand({commandName: CHAT_COMMANDS.ACTION_EXIT});
        },
        showArchive: function() {
            this.showModal(archiveDateSelector);
        },
        changeStatus: function() {
            if(this.currentUser.status == STATUS.NOT_AVAILABLE || this.currentUser.status == STATUS.NOT_ACTIVE) this.sendToServer({command: CHAT_COMMANDS.SET_STATUS, data: STATUS.ONLINE});
            else if(this.currentUser.status == STATUS.ONLINE) this.sendToServer({command: CHAT_COMMANDS.SET_STATUS, data: STATUS.NOT_AVAILABLE});
        }
    },
}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";

    ul.chatNavMenu {
        display: block;
        text-align: center;
        padding: .8em 0;
        line-height: @base-fontsize;
        white-space: nowrap;
        list-style: disc;
        & > li {
            display: inline-block;
            &::before {
                content: '•';
                color: @blue;
            }
        }
        & > li:first-child::before {
            content: '';
        }
        li > a {
            font-family: @main-font;
            display: inline-block;
            padding: 0 @base-padding;
            text-decoration: none;
            color: @base-font-color;
            font-weight: normal;
            &:hover {
                color: @gold;
                text-decoration: underline;
            }
            &:focus {
                outline: none;
                color: @blue;
            }
            &.exitLink {
                color: @gold;
                &:hover {
                    color: @blue;
                }
            }
        }
    }
</style>