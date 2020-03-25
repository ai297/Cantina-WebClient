<template>
    <div class="message-in-list" :class="messageTypeClass">
        <span class="timespan">{{message.dateTime | timeFilter}}</span>
        <span class="nickname"><message-to-user-link :nickname="message.authorName" :messageType="linkMessageType" /></span>
        <message-text class="message-text" :message="message" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { MESSAGE_TYPES } from '../../../constants.js';
import messageToUserLink from './ChatMessageUserLink.vue';
import messageText from './ChatMessageText.vue';

export default {
    name: "ChatMessage",
    components: {
        messageToUserLink,
        messageText,
    },
    props: {
        message: Object,
    },
    computed: {
        ...mapGetters({
            currentUserId: 'auth/userId',
        }),
        isPersonal: function() {
            // если поле "получатель" - массив, то ищем в массиве id текущего юзера
            if(Array.isArray(this.message.recipients)) {
                return this.message.recipients.includes(this.currentUserId);
            }
            // если не массив, но поле задано, то просто сравниваем его с id текущего юзера
            else if(this.message.recipients == this.currentUserId) return true;
            return false;
        },
        messageType: function() {
            if(this.message.hasOwnProperty('type') && MESSAGE_TYPES.hasOwnProperty(this.message.type)) {
                return MESSAGE_TYPES[this.message.type].name;
            } else return MESSAGE_TYPES.Base.name;
        },
        linkMessageType: function() {
            if(this.messageType == MESSAGE_TYPES.Privat.name ||
            this.messageType == MESSAGE_TYPES.Base.name) return this.messageType;
            else return MESSAGE_TYPES.Base.name;
        },
        messageTypeClass: function() {
            let msgClass = this.messageType + '-message';
            if(this.isPersonal) msgClass += ' personal';
            return msgClass;
        }
    },
    filters: {
        timeFilter: function(value) {
            if(!value) return "--:--";
            var msgDate = new Date(value);
            var msgHours = msgDate.getHours() < 10 ? "0" + msgDate.getHours() : msgDate.getHours();
            var msgMinutes = msgDate.getMinutes() < 10 ? "0" + msgDate.getMinutes() : msgDate.getMinutes();
            return msgHours + ":" + msgMinutes;
        },
    }
}
</script>

<style lang="less">
    @import "../../../less/vars.less";

    div.message-in-list {
        width: 100%;
        overflow: hidden;
        margin-top: @base-padding;
        word-break: break-word;
        a {
            color: inherit;
            text-decoration: none;
            &:hover {
                text-decoration: underline;
            }
        }
        span {
            margin-right: @base-padding;
        }
        .timespan {
            font-family: @label-font;
            color: @system-font-color;
            font-size: @label-fontsize;
        }
        .nickname {
            color: @dark-gold;
        }
        .message-text {
            a {
                font-style: italic;
            }
        }
        &::before {
            display: none;
            width: .8rem;
            height: 1rem;
            margin-right: .2rem;
            font-family: @label-font;
            color: @system-font-color;
            font-size: @label-fontsize;
            text-align: right;
        }
        &.personal {
            &::before {
                content: '»' !important;
                display: inline-block;
                font-family: Tahoma, sans-serif;
            }
        }
        &.Base-message {
            .timespan {
                display: none;
            }
            .nickname a::after {
                content: ':';
                display: inline;
            }
        }
        &.Privat-message {
            .timespan {
                display: none;
            }
            .nickname a::after {
                content: ' (лично):';
                display: inline;
            }
            &::before {
                content: '•';
                display: inline-block;
            }
        }
        &.ThirdPerson-message {
            .nickname, .message-text {
                font-style: italic;
            }
        }
        &.System-message {
            .message-text {
                color: @system-font-color;
                font-size: @label-fontsize;
                font-weight: bold;
            }
            .nickname {
                display: none;
            }
        }
    }
</style>