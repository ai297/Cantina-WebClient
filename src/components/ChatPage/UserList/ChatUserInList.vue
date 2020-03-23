<template>
    <div class="userInAsideBlock" :class="[isCurrentUser ? 'currentUser' : ' ']">
        <div class="userAvatarInAsideBlock" title="Посмотреть профиль"><div><cantina-icons iconName="piramid" /></div></div>
        <div class="userNameInAsideBlock"><message-to-user-link :nickname="user.name" title="Написать сообщение" /></div>
        <span class="pmLink"><message-to-user-link title="Написать личное сообщение" :nickname="user.name" :messageType="messageTypes.Privat.name">ЛС</message-to-user-link></span>
        <div class="userActionInAsideBlock">
            <a title="Пожаловаться"><cantina-icons iconName="claim" /></a>
            <a title="Игнорировать"><cantina-icons iconName="ignore" /></a>
        </div>
        <div class="userInfoInAsideBlock">.</div>
    </div>
</template>

<script>
import {MESSAGE_TYPES} from '../../../constants.js';
import messageToUserLink from '../Messages/ChatMessageUserLink.vue';

export default {
    name: "UserInList",
    components: {
        messageToUserLink,
    },
    props: {
        user: Object,
        isCurrentUser: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {
            messageTypes: MESSAGE_TYPES,
        }
    }
}
</script>

<style lang="less">
    @import "../../../less/vars.less";
    @userAvatarInOnlineList-size: 2.5rem;

    div.userInAsideBlock {
        display: grid;
        width: 100%;
        height: calc(@userAvatarInOnlineList-size + round(@ui-border-width * 2 + @base-border-width * 2, 1));
        margin-top: @base-padding;
        overflow: hidden;
        border-radius: round(@userAvatarInOnlineList-size / 6, 2);
        background-color: @dark-grey;
        grid-template-columns: auto 1fr auto;
        grid-template-rows: 55% 45%;
        &:hover {
            background-color: @dark-blue;
        }
        a {
            margin-right: @base-padding;
            text-decoration: none;
            font-family: @button-font;
            font-size: @label-fontsize;
            font-weight: bold;
            color: currentColor;
            &:hover, &:focus, &:active {
                color: @gold;
                text-decoration: underline;
                outline: none;
            }
        }
        .userAvatarInAsideBlock {
            grid-column: 1;
            grid-row-start: 1;
            grid-row-end: 3;
            border: @base-border-width solid @body-background-color;
            border-radius: inherit;
            background: linear-gradient(to right bottom, @blue, @dark-blue);
            cursor: pointer;
            &:hover {
                background: @blue;
            }
            div {
                display: flex;
                width: @userAvatarInOnlineList-size;
                height: @userAvatarInOnlineList-size;
                margin: @ui-border-width;
                border-radius: inherit;
                overflow: hidden;
                align-items: center;
                justify-content: center;
                svg {
                    width: 100%;
                    height: 100%;
                    color: @body-background-color;
                }
            }
        }
        .userNameInAsideBlock {
            grid-column-start: 2;
            grid-column-end: 4;
            grid-row: 1;
            padding-left: @base-padding;
            /*border-bottom: @base-border-width solid mix(@blue, @body-background-color, 50%); */
            white-space: nowrap;
            a {
                font-size: round(@userAvatarInOnlineList-size * 0.48, 2);
                font-family: @main-font;
                font-weight: normal;
                text-decoration: none;
                color: currentColor;
                &:hover {
                    color: @gold;
                }
            }
        }
        .pmLink {
            display: flex;
            grid-row: 1;
            grid-column: 3;
            padding: 0 @base-padding;
            align-items: center;
            justify-content: flex-end;
            a:not(:hover) {
                color: @blue;
            }
        }
        .userActionInAsideBlock {
            grid-column: 3;
            grid-row: 2;    
            color: @red;
            white-space: nowrap;
            svg {
                width: round(@userAvatarInOnlineList-size * 0.35, 2);
                height: round(@userAvatarInOnlineList-size * 0.35, 2);
            }
        }
        .userInfoInAsideBlock {
            grid-row: 2;
            grid-column: 2;
            padding: 0 @base-padding;
            font-size: round(@userAvatarInOnlineList-size * 0.38, 2);
            line-height: 1em;
            color: @dark-gold;
        }

        &.currentUser {
            background-color: @dark-blue;
            .userActionInAsideBlock, .pmLink {
                display: none;
            }
            .userNameInAsideBlock {
                a:not(:hover) {
                    color: @blue;
                }
            }
        }
    }
</style>