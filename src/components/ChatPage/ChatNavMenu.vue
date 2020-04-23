<template>
    <ul class="chatNavMenu">
        <li v-if="isAdmin"><a @click.prevent="showConsole">Cmd</a></li>
        <li><a @click.prevent="showSettings">Профиль</a></li>
        <li><a @click.prevent="exit" class="exitLink">Выход</a></li>
    </ul>
</template>

<script>
import {mapActions} from 'vuex';
import {ROLES, CHAT_COMMANDS} from '../../constants.js';

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
        isAdmin: function(){
            return this.$store.getters['auth/role'] == ROLES.ADMIN;
        },
    },
    methods: {
        ...mapActions({
            runCommand: 'commands/run',
        }),
        showConsole: function() {
            if(this.isAdmin) {
                this.$store.commit('chat/showInteractive', adminConsole);
            }
        },
        showSettings: function() {
            this.runCommand({commandName: CHAT_COMMANDS.ACTION_SHOW_SETTINGS});
        },
        exit: function() {
            this.runCommand({commandName: CHAT_COMMANDS.ACTION_EXIT});
        },
    },
}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";

    ul.chatNavMenu {
        display: block;
        text-align: center;
        padding: @base-padding;
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
            &:hover {
                color: @gold;
                text-decoration: underline;
            }
            &:focus {
                outline: none;
                color: @blue;
            }
            &.exitLink {
                color: @red;
                font-weight: bold;
                &:hover {
                    color: @gold;
                }
            }
        }
    }
</style>