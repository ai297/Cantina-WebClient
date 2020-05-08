<script>
import { MESSAGE_TYPES, CHAT_COMMANDS } from '../../../../constants.js'
import store from '../../../../store/store.js';
export default {
    name: "MessageToUserLink",
    functional: true,
    props: {
        nickname: {
            type: String,
            default: '',
        },
        messageType: {
            type: Number,
            default: MESSAGE_TYPES.Base,
        },
    },
    render: function(createElement, ctx) {
        return createElement("a", {
            on: {
                click: function() {
                    store.dispatch('commands/run', {commandName: CHAT_COMMANDS.ACTION_ADD_NAME_TO_MESSAGE, payload: {userName: ctx.props.nickname, messageType: ctx.props.messageType}});
                }
            }
        }, ctx.children ? ctx.children : [ctx.props.nickname]);
    }
}
</script>