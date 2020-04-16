<template>
    <div class="message-in-list" :class="messageTypeClass">
        <div class="date" v-if="showDate"><span>{{getMessageDate}}</span></div>
        <span class="time" :class="{'alwaysShow':isShowTime}">{{getMessageTime}}</span>
        <span class="personalMark" v-if="isPersonal">{{privatMarker}}</span>
        <span class="nickname" :style="nameStyle"><message-to-user-link :nickname="message.authorName" :messageType="linkMessageType" /></span>
        <message-text class="message-text" :style="messageStyle" :message="message" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { MESSAGE_TYPES, MOUNTHS, CHAT_COMMANDS } from '../../../constants.js';
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
        showDate: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {
            privatMarker: '»',
        }
    },
    computed: {
        ...mapGetters({
            currentUserId: 'auth/userId',
            isShowTime: 'messages/showTime',
            lastMessgeDate: 'messages/lastMessgeDate',
        }),
        messageDate: function() {
            return new Date(this.message.dateTime);
        },
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
        },
        getMessageTime: function() {
            let msgHours = this.messageDate.getHours() < 10 ? "0" + this.messageDate.getHours() : this.messageDate.getHours();
            let msgMinutes = this.messageDate.getMinutes() < 10 ? "0" + this.messageDate.getMinutes() : this.messageDate.getMinutes();
            return msgHours + ":" + msgMinutes;
        },
        getMessageDate: function() {
            return `${this.messageDate.getDate()} ${MOUNTHS[this.messageDate.getMonth()]} ${this.messageDate.getFullYear()}г.`;
        },
    },
    methods: {
        ...mapActions({
            runCommand: 'commands/run',
        })
    },
    mounted: function() {
        if(this.message.authorId == this.currentUserId && this.message.type == MESSAGE_TYPES.Privat) this.privatMarker = "•";
        if(this.isPersonal) this.runCommand({commandName: CHAT_COMMANDS.ACTION_PLAY_NEW_MESSAGE_SOUND});
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
        & > span {
            margin-right: @base-padding;
        }
        .time {
            font-family: @label-font;
            color: @system-font-color;
            font-size: @label-fontsize;
        }
        .date {
            text-align: center;
            margin: @base-padding 0;
            font-size: @label-fontsize;
            & > span {
                background-color: @dark-grey;
                padding: @base-padding 1em;
                border-radius: 1em;
                font-family: @label-font;
                color: @system-font-color;
            }
        }
        .personalMark {
            color: @system-font-color;
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
        &.Base-message {
            .time:not(.alwaysShow) {
                display: none;
            }
            .nickname a::after {
                content: ':';
                display: inline;
            }
        }
        &.Privat-message {
            .time:not(.alwaysShow) {
                display: none;
            }
            .nickname a::after {
                content: ' (лично):';
                display: inline;
            }
        }
        &.ThirdPerson-message {
            .nickname, .message-text {
                font-style: italic;
                font-family: @label-font !important;
                color: @dark-gold !important;
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
        &.Error-message {
            background-color: @dark-grey;
            padding-left: @base-padding;
            font-size: @label-fontsize;
            .time {
                color: inherit;
            }
            .nickname {
                color: inherit !important;
                font-family: @label-font !important;
                &::after {
                    content: ':';
                }
            }
            .message-text {
                font-style: italic;
                font-family: @label-font !important;
                color: @red !important;
            }
        }
        &.Information-message {
            background-color: @dark-grey;
            padding-left: @base-padding;
            font-size: @label-fontsize;
            .time {
                color: inherit;
            }
            .nickname {
                color: inherit !important;
                font-family: @label-font !important;
                &::after {
                    content: ':';
                }
            }
            .message-text {
                font-style: italic;
                font-family: @label-font !important;
                color: @green !important;
            }
        }
    }
</style>