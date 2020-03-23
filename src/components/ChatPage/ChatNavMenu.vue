<template>
    <ul class="chatNavMenu">
        <li v-if="isAdmin"><a @click.prevent="showConsole">Cmd</a></li>
        <li><a @click.prevent="exit">Выйти</a></li>
    </ul>
</template>

<script>
import {ROLES, ROUTING} from '../../constants.js';

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
            let role = this.$store.getters['auth/role'];
            return role == ROLES.ADMIN;
        },
    },
    methods: {
        showConsole: function() {
            if(this.isAdmin) {
                this.$store.commit('chat/showInteractive', adminConsole);
            }
        },
        exit: function() {
            this.$router.push(ROUTING.OUT_PAGE);
        }
    }
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
            &:hover, &:active {
                color: @gold;
                text-decoration: underline;
            }
            &:focus {
                outline: none;
                color: @blue;
            }
        }
    }
</style>