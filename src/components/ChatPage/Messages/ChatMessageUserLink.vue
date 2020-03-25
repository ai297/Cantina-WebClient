<template>
    <a @click.prevent="messageTo"><slot>{{nickname}}</slot></a>
</template>

<script>
import { MESSAGE_TYPES, CHAT_COMMANDS } from '../../../constants.js'

export default {
    name: "MessageToUserLink",
    props: {
        nickname: {
            type: String,
            default: '',
        },
        messageType: {
            type: String,
            default: MESSAGE_TYPES.Base.name,
        },
    },
    methods: {
        messageTo: function() {
            this.$store.dispatch('commands/run', {commandName: CHAT_COMMANDS.ACTION_ADD_NAME_TO_MESSAGE, payload: {userName: this.nickname, messageType: this.messageType}});
        }
    }
}
</script>