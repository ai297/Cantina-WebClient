<template>
    <a @click.prevent="messageTo"><slot>{{nickname}}</slot></a>
</template>

<script>
import { MESSAGE_TYPES } from '../../../constants.js'

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
            this.$store.commit('messages/addNameToMessage', {userName: this.nickname, messageType: this.messageType});
        }
    }
}
</script>