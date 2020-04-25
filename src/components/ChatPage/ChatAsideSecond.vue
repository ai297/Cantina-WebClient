<template>
    <div class="asideSecond">
        <div v-show="isShowSmiles"><flat-button @click="showSmilesSettings">Настроить смайлики</flat-button></div>
        <smiles-panel id="smile-panel" v-if="isShowSmiles" />
        <settings-panel />
        <div id="currentOnlineTime">
            Вы в Кантине: <span>{{onlineTime}}</span> мин.
        </div>
    </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import {CHAT_COMMANDS} from "../../constants.js";
import smilesPanel from './ChatSmilesPanel.vue';
import settingsPanel from './ChatSettingsPanel.vue';

export default {
    name: "ChatAsideSecond",
    components: {
        smilesPanel,
        settingsPanel,
    },
    data: function() {
        return {
            currentTime: Date.now()
        }
    },
    computed: {
        ...mapGetters({
            currentUser: 'users/currentUser',
            isShowSmiles: 'chat/showSmiles',
        }),
        enterTime: function() {
            return new Date(this.currentUser.enterTime);
        },
        onlineTime: function() {
            return Math.round((this.currentTime - this.enterTime) / 60000);
        },
    },
    methods: {
        ...mapActions({
            runCommand: 'commands/run',
        }),
        ...mapMutations({
            registerCommand: 'commands/registerCommand',
            deleteCommand: 'commands/deleteCommand',
            showSmiles: 'chat/showSmiles',
        }),
        updateCurrentTime: function() {
            this.currentTime = Date.now();
            setTimeout(this.updateCurrentTime, 1000);
        },
        showSmilesSettings: function() {
            this.showSmiles();
            this.runCommand({commandName: CHAT_COMMANDS.ACTION_SHOW_SMILES_SETTINGS});
        },
    },
    mounted: function() {
        this.updateCurrentTime();

        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_SHOW_SMILES, command: this.showSmiles});
    },
    beforeDestroy: function() {
        this.deleteCommand(CHAT_COMMANDS.ACTION_SHOW_SMILES);
    }
}
</script>

<style lang="less">
@import "../../less/vars.less";

    div.asideSecond {
        display: flex;
        text-align: center;
        white-space: nowrap;
        flex-direction: column;
        font-size: @label-fontsize;

        #smile-panel {
            display: flex;
            flex-direction: row;
            flex-grow: 1;
            flex-shrink: 1;
            overflow: hidden;
            overflow-y: scroll;
            flex-wrap: wrap;
            align-items: baseline;
            justify-content: center;
            //border: @base-border-width solid mix(@grey, @body-background-color, 70%);
        }

        #currentOnlineTime {
            
            span {
                font-weight: bold;
                color: @dark-gold;
            }
        }
    }
    @media screen and (max-height: 599px), screen and (max-width: 699px) {
        div.asideSecond #currentOnlineTime {
            display: none;
        }
    }
</style>