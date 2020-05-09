<template>
    <div class="userInOnlineList" :class="{currentUser: isCurrentUser, disconnected: isDisconnected}">
        <div class="avatarSection">
            <div class="avatarWrapper" @click="showProfile">
                <div class="avatar">
                    <img src="../../../../assets/avatar.png" :alt="user.name" />
                </div>
            </div>
        </div>
        <div class="userWrapper">
            <div class="userSection">
                <div class="userStatus" :title="isDisconnected ? 'Связь потеряна': status">
                    <status-icon :status="user.status" />
                </div>
                <div class="userName">
                    <message-to-user-link :nickname="user.name" title="Написать сообщение" />
                </div>
                <div class="userMenu">
                    <message-to-user-link :nickname="user.name" :messageType="privatMessageType" title="Личное сообщение">
                        <holo-button>ЛС</holo-button>
                    </message-to-user-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {MESSAGE_TYPES, STATUS} from '../../../../constants.js';
import messageToUserLink from '../../Components/Messages/MessageUserLink.vue';
import statusIcon from './UserStatus.vue';

export default {
    name: "UserInList",
    components: {
        messageToUserLink,
        statusIcon,
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
    computed: {
        status: function() {
            return STATUS._TITLES[this.user.status];
        },
        isDisconnected: function() {
            return this.user.connections < 1;
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
    @import "../../../../less/vars.less";

    div.userInOnlineList {
        display: block;
        position: relative;
        align-items: center;
        justify-content: left;
        margin: @base-padding;
        //overflow: hidden;
        &:hover {
            .userWrapper .userSection {
                background-color: mix(@blue, rgba(0,0,0,0), 30%);
            }
            .avatarSection .avatarWrapper div.avatar {
                &::after {
                    opacity: 1;
                }
                img {
                    opacity: 1;
                }
            }
        }
        .avatarSection {
            position: absolute;
            left: 3px;
            top: 0;
            width: 3rem;
            height: 1.8rem + @base-padding;
            display: flex;
            overflow: hidden;
            z-index: 20;
            color: @blue;
            position: relative;
            align-items: center;
            justify-content: center;
            .avatarWrapper {
                width: 100%;
                height: 3rem;
                border: 4px solid @blue;
                border-radius: 25% ~"/" 50%;
                box-sizing: border-box;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                div.avatar {
                    position: relative;
                    flex-shrink: 0;
                    height: 1.8rem;
                    width: 100%;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid @light-blue;
                    img {
                        flex-shrink: 0;
                        width: 100%;
                        height: auto;
                        opacity: .8;
                        transition: all .5s;
                    }
                    &::after {
                        display: block;
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        left: 0;
                        top: 0;
                        content: '';
                        box-shadow: inset 0 0 4px 2px @light-blue;
                        background: radial-gradient(circle, rgba(0,0,0,0) 65%, @light-blue);
                        opacity: .7;
                        pointer-events: none;
                    }
                }
            }
        }
        .userWrapper {
            display: flex;
            position: absolute;
            z-index: 10;
            width: 100%;
            height: 1.8rem;
            left: 0;
            top: @base-padding/2;
            overflow: hidden;
            align-items: center;
            justify-content: center;
            .userSection {
                width: 100%;
                height: 3rem;
                box-sizing: border-box;
                border: 3px solid @light-blue;
                border-radius: .75rem ~"/" 50%;
                display: flex;
                flex-direction: row;
                align-items: center;
                overflow: hidden;
                background-color: mix(@blue, rgba(0,0,0,0), 20%);
                transition: all .5s;
                &::before {
                    display: block;
                    width: 3rem;
                    content: '';
                    margin-right: @base-padding;
                    flex-shrink: 0;
                }
                .userName {
                    display: inline-block;
                    color: @light-blue;
                    font-size: @input-fontsize;
                    flex-shrink: 1;
                    flex-grow: 1;
                    overflow: hidden;
                    a:hover {
                        color: @gold;
                    }
                }
                .userMenu {
                    flex-shrink: 0;
                    flex-grow: 0;
                    overflow: hidden;
                    padding: 0 @base-padding;
                    text-align: center;
                    transition: all .2s ease;
                    font-size: @label-fontsize;
                    line-height: 1.5rem;
                    a {
                        font-family: @label-font;
                        font-weight: bold;
                        text-decoration: none;
                        color: @gold;
                        margin: 0 @base-padding;
                        &:hover {
                            color: @light-blue;
                        }
                    }
                }
                .userStatus {
                    flex-shrink: 0;
                    flex-grow: 0;
                    width: 1em;
                    
                    svg {
                        display: inline-block;
                        width: .8em;
                        height: .8em;
                    }
                }
            }
        }
        
        &.currentUser {
            .userWrapper .userSection {
                .userMenu {
                    display: none;
                }
            }
        }

        &.disconnected {
            opacity: .6;
            .avatarSection .avatarWrapper {
                border-color: mix(@grey, @dark-grey);
                div.avatar {
                    border-color: @grey;
                }
            }
            .userWrapper .userSection {
                border-color: @grey;
                background-color: mix(@grey, rgba(0,0,0,0), 20%);
                .userName {
                    color: @grey;
                }
                .userStatus {
                    animation: blink 1.4s linear infinite;
                }
            }
        }
    }

    @keyframes blink {
        0% {
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
</style>