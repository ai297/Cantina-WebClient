<template>
    <div id="mainPage">
        <router-link to="/chat">Войти в чат</router-link>
        <chat-footer class="footer" />
    </div>
</template>

<script>
import chatFooter from '../ChatPage/ChatFooterView.vue';

export default {
    name: "MainPage",
    components: {
        chatFooter,
    },
    data: function(){
        return {
        }
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";
    #mainPage {
        width: 100%;
        min-height: 100vh;
        padding: 0 20px;
        .footer {
            display: block;
            text-align: center;
            width: 100%;
            padding: 25px 0;
        }
    }
</style>