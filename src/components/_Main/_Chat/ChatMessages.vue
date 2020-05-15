<template>
    <div class="chat-main">

        <div class="chat-main__messages" @mouseup="selectInputField" :class="{manualScrolling: !autoScroll}" @scroll="scrollMessages" ref="messages">
            <chat-message v-for="(item, index) in messagesQueue" :key="'message-'+index" :message="item" :showDate="isShowDate(index)" />
            <p v-if="messagesCount == 0">Нет сообщений</p>
        </div>

        <send-form class="send-form" />
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import {CHAT_COMMANDS} from '../../../constants.js';
import chatMessage from '../Components/Messages/Message.vue';
import sendForm from './SendMessageForm/SendMessageForm.vue';

export default {
    name: "ChatMessages",
    components: {
        chatMessage,
        sendForm,
    },
    data: function() {
        return {
            scrollSpeed: 1,
            scrollTimer: null,
            scrollTop: 0,
        }
    },
    computed: {
        ...mapGetters({
            messagesQueue: 'messages/getMessages',
            messagesCount: 'messages/count',
            autoScroll: "chat/autoScroll",
            isWindowFocused: 'isWindowFocused',
        })
    },
    methods: {
        ...mapActions({
            runCommand: 'commands/run',
        }),
        ...mapMutations({
            switchScrollMode: 'chat/switchScrollMode',
        }),
        isShowDate: function(index) {
            let currentDate = new Date(this.messagesQueue[index].dateTime).getDate();
            if(this.messagesQueue[index - 1] === undefined) return new Date().getDate() != currentDate;
            else {
                let lastDate =  new Date(this.messagesQueue[index - 1].dateTime).getDate();
                return currentDate > lastDate || (currentDate == 0 && lastDate > 0);
            }
        },

        scrollToLastMessage: function() {
            if(this.$refs['messages'].scrollTop + this.scrollSpeed < this.$refs['messages'].scrollHeight - this.$refs['messages'].clientHeight) {
                this.$refs['messages'].scrollTop += this.scrollSpeed;
                this.scrollSpeed += 5;
                this.scrollTimer = setTimeout(this.scrollToLastMessage, 10);
            }
            else {
                this.$refs['messages'].scrollTop = this.$refs['messages'].scrollHeight - this.$refs['messages'].clientHeight;
                this.scrollSpeed = 1;
            }
        },

        scrollMessages: function() {
            if(this.$refs['messages'].scrollTop >= (this.$refs['messages'].scrollHeight - this.$refs['messages'].clientHeight - 10) && !this.autoScroll) this.switchScrollMode(true);
            else if(this.$refs['messages'].scrollTop < this.scrollTop && this.autoScroll) this.switchScrollMode(false);
            this.scrollTop = this.$refs['messages'].scrollTop;
        },

        selectInputField: function() {
            this.runCommand({commandName: CHAT_COMMANDS.ACTION_FOCUS_INPUT_FIELD});
        },
    },
    watch: {
        autoScroll: function(val) {
            if(val) this.scrollToLastMessage();
        },
    },
    updated: function() {
        if(this.autoScroll) this.scrollToLastMessage();
    },
    // deactivated: function() {
    //     this.switchScrollMode(false);
    // },
    activated: function() {
        if(this.autoScroll) this.scrollToLastMessage();
    }
}
</script>

<style lang="less">
    @import "../../../less/vars.less";

    div.chat-main {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        margin: @base-padding;
        transition: all .5s;
        position: relative;
        // #interactive {
        //     flex-basis: auto;
        //     flex-grow: 0;
        //     flex-shrink: 0;
        //     display: block;
        //     min-height: 0rem;
        //     max-height: 60%;
        //     overflow: hidden;
        // }
        
        .chat-main__messages {
            flex-grow: 1;
            flex-shrink: 1;
            max-width: 100%;

            display: block;
            border: @base-border-width solid mix(@blue, @body-background-color, 70%);
            background-color: mix(@content-bgcolor, rgba(0,0,0,0), 70%);
            border-radius: @base-padding;
            padding: .5rem;
            padding-left: .5rem + @base-padding;
            overflow-y: scroll;
            //box-shadow: inset 0 0 .8rem 0 mix(@blue, rgba(0,0,0,0), 20%);

            &.manualScrolling::-webkit-scrollbar-thumb {
                background-color: @dark-gold;
            }
            p {
                text-align: center;
            }
        }
        .send-form {
            flex-grow: 0;
            flex-shrink: 0;
            flex-basis: auto;
        }
    }

</style>