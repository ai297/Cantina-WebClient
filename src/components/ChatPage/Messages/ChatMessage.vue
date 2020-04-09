<template>
    <div class="message-in-list" :class="messageTypeClass">
        <span class="timespan">{{message.dateTime | timeFilter}}</span>
        <span class="nickname" :style="nameStyle"><message-to-user-link :nickname="message.authorName" :messageType="linkMessageType" /></span>
        <message-text class="message-text" :style="messageStyle" :message="message" />
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
        linkMessageType: function() {
            if(this.message.hasOwnProperty('type') && ( this.message.type === MESSAGE_TYPES.Base ||
            this.message.type === MESSAGE_TYPES.Privat)) return this.message.type;
            else return MESSAGE_TYPES.Base;
        },
        messageTypeClass: function() {
            let msgClass = '-message';
            if(this.message.hasOwnProperty('type')) {
                msgClass = MESSAGE_TYPES.TYPES[this.message.type].name + msgClass;
            } else msgClass =  MESSAGE_TYPES.Base + msgClass;
            if(this.isPersonal) msgClass += ' personal';
            return msgClass;
        },
        nameStyle: function() {
            if(this.message.hasOwnProperty("nameStyle") && this.message.nameStyle !== null) return this.message.nameStyle;
            else return "";
        },
        messageStyle: function() {
            if(this.message.hasOwnProperty("messageStyle") && this.message.messageStyle !== null) return this.message.messageStyle;
            else return "";
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
                color: @system-font-color !important;
                font-size: @label-fontsize;
                font-weight: bold;
                font-family: inherit !important;
            }
            .nickname {
                display: none;
            }
        }
    }
</style>