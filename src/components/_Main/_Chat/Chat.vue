<template>
    <div class="main-chat"
            :class="{hideSideBar: !isShowSidebar && !isMinWidth() }"
            :style="{'flex-direction': (reverseDirection && !isMinWidth()) ? 'row-reverse' : 'row'}" >

        <chat-messages class="messages" />
        <main-aside :class="{'aside': true, 'auto-show': isAutoShow}">
            <transition name="aside-main" mode="out-in" :duration="{ enter: 800, leave: 500 }">
                <component :is="asideComponent" class="chat-aside__top-section" />
            </transition>

            <div>
                <volume-button @click="showSettings"><cantina-icons iconName="gear" /> Настройки</volume-button>
                <!-- <volume-button ><cantina-icons iconName="radio" /> Радио</volume-button> -->
            </div>
            <!-- <simple-radio :element="$parent.$el" /> -->
            <template v-slot:bottom>
                <settings-panel />
                <div class="online-time">
                    <p v-if="isConnected" title="Учитывается только время активного нахождения в чате">Вы в Кантине: <span>{{onlineTime}}</span> мин.</p>
                    <p v-else>Вы не в Кантине</p>
                </div>
            </template>
        </main-aside>
    </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';
import {CHAT_COMMANDS} from '../../../constants.js';

import chatMessages from './ChatMessages.vue';
import mainAside from '../Aside.vue';
import settingsPanel from '../Components/SettingsPanel.vue';
import userSettings from './ChatUserSettings.vue';
// import simpleRadio from '../_Radio/SimpleRadioPlayer.vue';

export default {
    name: "LiveChat",
    components: {
        chatMessages,
        mainAside,
        settingsPanel,
        // simpleRadio,
    },
    data: function() {
        return {
            isAutoShow: false,
            currentTime: Date.now(),
        }
    },
    computed: {
        ...mapGetters({
            isMinWidth: 'isMinWidth',

            reverseDirection: 'chat/isReversedDirection',
            isShowSidebar: 'chat/isShowSidebar',
            asideComponent: 'chat/currentAsideComponent',

            isConnected: 'connection/isConnected',
            currentUser: 'users/currentUser',
        }),
        enterTime: function() {
            return new Date(this.currentUser.enterTime);
        },
        onlineTime: function() {
            if(this.enterTime < (this.currentTime - 865000000)) return this.currentUser.onlineTime;
            return Math.round(this.currentUser.onlineTime + (this.currentTime - this.enterTime) / 60000);
        },
    },
    watch: {
        isShowSidebar: function(val) {
            if(val) this.isAutoShow = false;
            else setTimeout(() => this.isAutoShow = true, 1500);
        }
    },
    methods: {
        ...mapMutations({
            showModal: 'showModal',
        }),
        ...mapActions({
            runCommand: 'commands/run',
        }),
        updateCurrentTime: function() {
            this.currentTime = Date.now();
            setTimeout(this.updateCurrentTime, 1000);
        },
        showSettings: function() {
            this.showModal(userSettings);
        },
    },
    created: function() {
        this.isAutoShow = !this.isShowSidebar;
    },
    mounted: function() {
        this.updateCurrentTime();
    },
    activated: function() {
        if(!this.isConnected) {
            this.runCommand({commandName: CHAT_COMMANDS.ACTION_ENTER});
        }
        this.runCommand({commandName: CHAT_COMMANDS.ACTION_FOCUS_INPUT_FIELD});
    },
}
</script>

<style lang="less">
    @import "../../../less/vars.less";

    div.main-chat {
        justify-content: flex-start;
        align-items: stretch;

        .messages {
            flex-grow: 1;
            flex-shrink: 1;
            //width: 5rem;
            margin-top: .5em;
        }

        .aside {
            flex-grow: 0;
            flex-shrink: 0;
            width: 22vw;
            min-width: 16.5rem;
            max-width: 20rem;
            transition: all .5s;
            text-align: center;

            .chat-aside__top-section {
                flex-grow: 0;
                min-height: 6.5rem;
            }
            
            .online-time {
                span {
                    font-weight: bold;
                    color: @dark-gold;
                }
            }

            .aside-main-enter-active {
                .caption-wrapper {
                    animation: emerging .5s forwards;
                }
                .content-wrapper > *:first-child {
                    animation: topEmerging .8s forwards;
                }
            }
            .aside-main-leave-active  {
                .caption-wrapper {
                    animation: emerging .5s reverse forwards;
                }
                .content-wrapper > *:first-child {
                    animation: topEmerging .5s reverse forwards;
                }
            }

        }
        &.hideSideBar {
            .aside {
                min-width: 0rem;
                width: 0vw;
                &.auto-show:hover {
                    width: 22vw;
                    min-width: 16.5rem;
                }
            }
        }
    }

    @keyframes emerging {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    @keyframes topEmerging {
        from {
            margin-top: -100%;
        }
        to {
            margin-top: 0%;
        }
    }

    @media screen and (max-width: 699px) {
        div.main-chat {
            .messages {
                flex-shrink: 0;
                padding: 0;
                margin: 0;
                flex-basis: 100%;
                border: 0;
            }
            .aside {
                flex-basis: 100%;
                flex-shrink: 0;
                max-width: unset;
            }
        }
    }
</style>