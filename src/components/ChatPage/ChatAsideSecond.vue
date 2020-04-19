<template>
    <div class="asideSecond">
        <smiles-panel id="smile-panel" v-if="isShowSmiles" />
        <div v-show="isShowSmiles"><flat-button @click="showSmilesSettings">Настроить смайлики</flat-button></div>
        <div id="currentOnlineTime">
            Вы в Кантине: <span>{{onlineTime}}</span> мин.
        </div>
        <div id="serverTime">
            {{formattedCurrentTime}}
        </div>
    </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import {MOUNTHS, CHAT_COMMANDS} from "../../constants.js";
import smilesPanel from './ChatSmilesPanel.vue';

export default {
    name: "ChatAsideSecond",
    components: {
        smilesPanel,
    },
    data: function() {
        return {
            enterTime: Date.now(),
            currentTime: Date.now()
        }
    },
    computed: {
        ...mapGetters({
            usersInOnline: 'users/usersInOinline',
            currentUserId: 'auth/userId',
            isShowSmiles: 'chat/showSmiles',
        }),
        onlineTime: function() {
            return Math.round((new Date(this.currentTime) - this.enterTime) / 60000);
        },
        formattedCurrentTime: function() {
            let dt = new Date(this.currentTime);
            let hours = dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours();
            let minutes = dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes();
            let day = dt.getDate();
            let mounth = MOUNTHS[dt.getMonth()];
            let year = dt.getFullYear();
            return `${day} ${mounth} ${year}г. ${hours}:${minutes}`;
        }
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
        currentUserEnterTime: function() {
            for(let i in this.usersInOnline){
                if(this.usersInOnline[i].id == this.currentUserId) return new Date(this.usersInOnline[i].enterTime)
            }
            return new Date(Date.now());
        },
        showSmilesSettings: function() {
            this.runCommand({commandName: CHAT_COMMANDS.ACTION_SHOW_SMILES});
            this.runCommand({commandName: CHAT_COMMANDS.ACTION_SHOW_SMILES_SETTINGS});
        },
    },
    mounted: function() {
        this.enterTime = this.currentUserEnterTime();
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
        #serverTime {
            color: @blue;
        }
    }
    @media screen and (max-height: 599px), screen and (max-width: 699px) {
        div.asideSecond #currentOnlineTime, div.asideSecond #serverTime {
            display: none;
        }
    }
</style>