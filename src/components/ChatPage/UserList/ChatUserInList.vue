<template>
    <div class="userInOnlineList" :class="[isCurrentUser ? 'currentUser' : ' ']">
        <div class="avatarSection">
            <magic-circle />
            <div class="avatarWrapper" @click="showProfile" :title="`Смотреть профиль ${user.name}`">
                <div><img src="../../../assets/user.gif" :alt="user.name" width="100%" height="100%" /></div>
            </div>
        </div>
        <div class="userName"><message-to-user-link :nickname="user.name" title="Написать сообщение" /></div>
        <div class="userMenu"><message-to-user-link :nickname="user.name" :messageType="privatMessageType" title="Личное сообщение">ЛС</message-to-user-link></div>
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
            privatMessageType: MESSAGE_TYPES.Privat,
        }
    },
    methods: {
        showProfile: function() {
            // TODO: команда открывает профиль юзере
        }
    }
}
</script>

<style lang="less">
    @import "../../../less/vars.less";

    div.userInOnlineList {
        display: flex;
        align-items: center;
        justify-content: left;
        margin: @base-padding;
        //overflow: hidden;
        .avatarSection {
            width: 3rem;
            height: 1.6rem + @base-padding;
            display: block;
            z-index: 20;
            color: @grey;
            position: relative;
            flex-shrink: 0;
            //background-color: @body-background-color;
            .magic-circle {
                width: 100%;
                height: 1.6rem;
                position: absolute;
                top: @base-padding/2;
            }
            .avatarWrapper {
                width: 1.6rem;
                height: 1.6rem;
                position: relative;
                margin: auto;
                border: @ui-border-width+@base-border-width solid currentColor;
                border-radius: 1rem;
                background: radial-gradient(@dark-red, @body-background-color);
                color: inherit;
                cursor: pointer;
                &:hover {
                    border-color:@gold;
                }
                & > div {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                    border: @base-border-width solid black;
                    border-radius: inherit;
                    overflow: hidden;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
        .userName {
            height: 1.5rem;
            padding-left: 1rem;
            margin-left: -.5rem;
            z-index: 10;
            overflow: hidden;
            background-color: @body-background-color;
            flex-grow: 1;
            margin-right: @base-padding;
            a {
                color: inherit;
                font-size: @input-fontsize;
                &:hover {
                    color: @red;
                }
            }
        }
        .userMenu {
            width: 2rem;
            height: 1.5rem;
            overflow: hidden;
            padding: 0;
            z-index: 5;
            text-align: center;
            transition: all .2s ease;
            font-size: @label-fontsize;
            line-height: 1.5rem;
            border: none;
            border-radius: .75rem;
            // &::before {
            //     content: '❯\00A0\00A0\00A0';
            //     color: @blue;
            // }

            a {
                font-family: @label-font;
                font-weight: bold;
                text-decoration: none;
                color: @gold;
                &:hover {
                    color: @green;
                }
            }
        }
        &.currentUser {
            .userMenu {
                display: none;
            }
            .avatarSection {
                color: @dark-red;
            }
        }
        &:hover {
            .userName {
                color: @blue;
            }
            .userMenu {
                width: 2.5rem;
                padding: 0 @base-padding*2;
                background: @dark-grey;
                // &::before {
                //     display: none;
                // }
            }
            .avatarSection {
                color: @blue;
            }
        }
    }
</style>