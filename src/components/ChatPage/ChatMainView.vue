<template>
    <div class="chatMain">
        <component id="interactive" :is="interactiveComponent" />
        <div id="messages-list" ref="messagesList">
            <chat-message v-for="(item, index) in messagesQueue" :key="index" :message="item" />
            <p v-show="isNotMessages">Нет сообщений</p>
        </div>
    </div>
</template>

<script>

import { mapGetters, mapMutations } from 'vuex';
import {CHAT_COMMANDS} from '../../constants.js';
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
    methods: {
        ...mapMutations({
            addMessage: 'messages/addMessage',
            clearMessages: 'messages/clearMessages',
            registerCommand: 'commands/registerCommand',
            deleteCommand: 'commands/deleteCommand',
        })
    },
    updated: function() {
        this.$refs['messagesList'].scrollTop = this.$refs['messagesList'].scrollHeight - this.$refs['messagesList'].clientHeight;
    },
    mounted: function() {
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_ADD_MESSAGE, command: (messageData) => this.addMessage(messageData)});
    },
    beforeDestroy: function() {
        this.deleteCommand(CHAT_COMMANDS.ACTION_ADD_MESSAGE);
        this.clearMessages();
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";

    div.chatMain {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: @base-padding;
        background-color: @body-background-color;
        #interactive {
            flex-basis: auto;
            flex-grow: 0;
            display: block;
            min-height: 0rem;
            overflow: hidden;;
        }
        #messages-list {
            flex-grow: 1;
            display: block;
            overflow-y: scroll;
            overflow-x: hidden;
            padding: .5rem;
            border: @base-border-width solid mix(@grey, @body-background-color, 70%);
            min-height: 40%;
            p {
                text-align: center;
            }
        }
    }

</style>