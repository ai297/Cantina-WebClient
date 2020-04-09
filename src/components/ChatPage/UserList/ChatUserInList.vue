<template>
    <div class="userInOnlineList" :class="[isCurrentUser ? 'currentUser' : ' ']">
        <div class="avatarSection">
            <magic-circle />
            <div class="avatarWrapper" @click="showProfile" :title="`Смотреть профиль ${user.name}`">
                <div><img src="../../../assets/user.gif" :alt="user.name" width="100%" height="100%" /></div>
            </div>
            <!--<div class="onlineStatus">▲</div>-->
            <!--<div class="gender">♂</div>-->
        </div>
        <div class="userName">
            <message-to-user-link :nickname="user.name" title="Написать сообщение" />
        </div>
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
    @userAvatarInOnlineList-size: 2.5rem;

    div.userInOnlineList {
        display: flex;
        align-items: center;
        justify-content: left;
        margin: @base-padding;
        //overflow: hidden;
        .avatarSection {
            width: 3.2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 20;
            color: @grey;
            position: relative;
            flex-shrink: 0;
            //background-color: @body-background-color;
            .avatarWrapper {
                width: 1.8rem;
                height: 1.8rem;
                position: relative;
                border: @ui-border-width+@base-border-width solid currentColor;
                border-radius: 1rem;
                margin-left: 1px;
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
            .magic-circle {
                width: 100%;
                position: absolute;
            }
            .onlineStatus {
                    position: absolute;
                    left: -.45rem;
                    background-color: @body-background-color;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: .8rem;
                    height: .8rem;
                    border: @ui-border-width solid @blue;
                    border-radius: .5rem;
                    overflow: hidden;
                    font-size: .5rem;
                    color: @green;
            }
            .gender {
                position: absolute;
                width: .8rem;
                height: .8rem;
                overflow: hidden;
                text-align: center;
                border-radius: .5rem;
                font-size: .8rem;
                line-height: .7rem;
                background-color: @blue;
                color: black;
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
            width: 0rem;
            height: 1.5rem;
            overflow: hidden;
            padding: 0;
            z-index: 5;
            background: @dark-grey;
            text-align: center;
            transition: all .2s ease;
            font-size: @label-fontsize;
            line-height: 1.5rem;
            border-left: .2rem solid @grey;
            border-radius: 0 .75rem .75rem 0;
            &::before {
                content: '\00A0\00A0\00A0';
            }

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
                border-color: @blue;
                &::before {
                    display: none;
                }
            }
            .avatarSection {
                color: @blue;
            }
        }
    }
</style>