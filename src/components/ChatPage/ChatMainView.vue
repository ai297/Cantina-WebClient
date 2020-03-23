<template>
    <div class="chatMain">
        <component id="interactive" :is="interactiveComponent" />
        <div id="messages-list" ref="messagesList">
            <chat-message v-for="(item, index) in messagesQueue" :key="index" :message="item" />
            <p v-show="isNotMessages">Ошибка загрузки сообщений?</p>
        </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex';

import chatMessage from './Messages/ChatMessage.vue';

export default {
    name: "chatMain",
    components: {
        chatMessage,
    },
    computed: {
        ...mapGetters({
            messagesQueue: 'messages/getMessages',
            messagesCount: 'messages/count',
            interactiveComponent: 'chat/interactiveComponent'
        }),
        isNotMessages: function() {
            return this.messagesCount <= 0;
        }
    },
    updated: function() {
        this.$refs['messagesList'].scrollTop = this.$refs['messagesList'].scrollHeight - this.$refs['messagesList'].clientHeight;
    },
}
</script>

<style lang="less">
    @import "../../less/vars.less";

    div.chatMain {
        display: grid;
        grid-template-rows: auto minmax(38%, 1fr);
        overflow: hidden;
        padding: @base-padding;
        background-color: @body-background-color;
        #interactive {
            display: block;
            overflow: hidden;
        }
        #messages-list {
            display: block;
            overflow-y: scroll;
            overflow-x: hidden;
            padding: .5rem;
            border: @base-border-width solid mix(@grey, @body-background-color, 70%);
            p {
                text-align: center;
            }
        }
    }

</style>