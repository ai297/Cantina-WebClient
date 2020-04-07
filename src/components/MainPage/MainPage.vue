<template>
    <div id="mainPage">
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
}
</script>

<style lang="less">
    @import "../../less/vars.less";
    #mainPage {
        width: 15rem;
        min-height: 100vh;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: @dark-grey;
        .footer {
            display: block;
            text-align: center;
            width: 100%;
            padding: 25px 0;
        }
    }
</style>