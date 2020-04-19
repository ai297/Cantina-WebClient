<template>
    <div class="chatMain">
        <!-- плеер для звука нового сообщения -->
        <audio ref="newMessageSoundPlayer" preload>
            <source src="/sounds/newMessage.ogg" type="audio/ogg">
            <source src="/sounds/newMessage.mp3" type="audio/mpeg">
        </audio>
        <component id="interactive" :is="interactiveComponent" />
        <div id="messages-list" ref="messagesList" @mouseup="selectInputField">
            <chat-message v-for="(item, index) in messagesQueue" :key="index" :message="item" :showDate="isShowDate(index)" />
            <p v-show="isNotMessages">Нет сообщений</p>
        </div>
    </div>
</template>

<script>

import { mapGetters, mapMutations, mapActions } from 'vuex';
import {CHAT_COMMANDS} from '../../constants.js';
import chatMessage from './Messages/ChatMessage.vue';

export default {
    name: "chatMain",
    components: {
        chatMessage,
    },
    data: function() {
        return {
            scrollSpeed: 1,
            pageTitle: '',
            unreadMessages: 0,
            shortTitle: false,
            titleUpdater: undefined,
        }
    },
    computed: {
        ...mapGetters({
            isWindowFocused: 'isWindowFocused',
            messagesQueue: 'messages/getMessages',
            messagesCount: 'messages/count',
            interactiveComponent: 'chat/interactiveComponent',
            isDataLoaded: 'connection/isDataLoaded',
        }),
        isNotMessages: function() {
            return this.messagesCount <= 0;
        }
    },
    methods: {
        ...mapActions({
            runCommand: 'commands/run',
        }),
        ...mapMutations({
            addMessage: 'messages/addMessage',
            clearMessages: 'messages/clearMessages',
            registerCommand: 'commands/registerCommand',
            deleteCommand: 'commands/deleteCommand',
        }),
        isShowDate: function(index) {
            let currentDate = new Date(this.messagesQueue[index].dateTime).getDate();
            if(this.messagesQueue[index - 1] === undefined) return new Date().getDate() != currentDate;
            else {
                let lastDate =  new Date(this.messagesQueue[index - 1].dateTime).getDate();
                return currentDate > lastDate || (currentDate == 0 && lastDate > 0);
            }
        },
        selectInputField: function() {
            this.runCommand({commandName: CHAT_COMMANDS.ACTION_FOCUS_INPUT_FIELD});
        },
        scrollToLastMessage: function() {
            if(this.$refs['messagesList'].scrollTop + this.scrollSpeed < this.$refs['messagesList'].scrollHeight - this.$refs['messagesList'].clientHeight) {
                this.$refs['messagesList'].scrollTop += this.scrollSpeed;
                this.scrollSpeed += 2;
                setTimeout(this.scrollToLastMessage, 10);
            }
            else {
                this.scrollSpeed = 1;
                this.$refs['messagesList'].scrollTop = this.$refs['messagesList'].scrollHeight - this.$refs['messagesList'].clientHeight;
            }
        },
        playNewMessageSound: function() {
            if(this.isDataLoaded) this.$refs['newMessageSoundPlayer'].play();
        },
        addNewMessage: function(message) {
            this.addMessage(message);
            if(!this.isWindowFocused) this.unreadMessages++;
            this.updatePageTitle();
        },
        updatePageTitle: function() {
            if(this.unreadMessages > 0 && !this.isWindowFocused) {
                if(this.shortTitle) document.title = `(${this.unreadMessages}) ${this.pageTitle}`;
                else document.title = `(${this.unreadMessages})\n`;
                this.shortTitle = !this.shortTitle;
                clearTimeout(this.titleUpdater);
                this.titleUpdater = setTimeout(this.updatePageTitle, 150);
            }
            else document.title = this.pageTitle;
        }
    },
    watch: {
        isWindowFocused: function(val) {
            if(val) {
                this.unreadMessages = 0;
                clearTimeout(this.titleUpdater);
            }
            this.updatePageTitle();
        }
    },
    updated: function() {
        this.scrollToLastMessage();
    },
    mounted: function() {
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_ADD_MESSAGE, command: this.addNewMessage});
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_SCROLL_TO_LAST_MESSAGE, command: this.scrollToLastMessage});
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_PLAY_NEW_MESSAGE_SOUND, command: this.playNewMessageSound});
        this.pageTitle = document.title;
    },
    beforeDestroy: function() {
        this.deleteCommand(CHAT_COMMANDS.ACTION_ADD_MESSAGE);
        this.deleteCommand(CHAT_COMMANDS.ACTION_SCROLL_TO_LAST_MESSAGE);
        this.deleteCommand(CHAT_COMMANDS.ACTION_PLAY_NEW_MESSAGE_SOUND);
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
        margin: @base-padding;
        border: @base-border-width solid mix(@grey, @body-background-color, 70%);
        transition: all .5s;
        #interactive {
            flex-basis: auto;
            flex-grow: 0;
            flex-shrink: 0;
            display: block;
            min-height: 0rem;
            max-height: 60%;
            overflow: hidden;
        }
        #messages-list {
            flex-grow: 1;
            flex-shrink: 1;
            display: block;
            overflow-y: scroll;
            overflow-x: hidden;
            max-width: 100%;
            padding: .5rem;
            p {
                text-align: center;
            }
        }
    }

</style>