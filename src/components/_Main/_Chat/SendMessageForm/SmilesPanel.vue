<template>
    <div class="smiles-panel">
        <div class="smiles-panel__smiles">
            <smile v-for="(item, index) in smiles" :key="index" @click="insertSmile(index)">{{item}}</smile>
        </div>
        <a @click.prevent="smileSettings">Настроить смайлики</a>
    </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import {CHAT_COMMANDS} from '../../../../constants.js';
import {OLD_SMILES_DEFAULT} from '../../../../old-smiles.js';
import Smile from '../../Components/Smiles/Smile.vue';
import smileSettings from '../ChatSmilesSettings.vue'

export default {
    name: "SmilesPanel",
    components: {
        Smile
    },
    props: {
        top: {
            type: Number,
            default: 0,
        },
        left: {
            type: Number,
            default: 0
        },
    },
    data: function() {
        return {
            smiles: (localStorage.getItem("favoriteSmiles") !== null) ? JSON.parse(localStorage.getItem("favoriteSmiles")) : OLD_SMILES_DEFAULT,
        }
    },
    methods: {
        ...mapActions({
            runCommand: 'commands/run',
        }),
        ...mapMutations({
            showModal: 'showModal',
            closePopUp: 'closePopUp',
        }),
        insertSmile: function(index) {
            this.runCommand({commandName: CHAT_COMMANDS.ACTION_INSERT_SMILE_TO_MESSAGE, payload: this.smiles[index]});
        },
        smileSettings: function() {
            this.showModal(smileSettings);
            this.closePopUp();
        }
    },
    mounted: function() {
        const docHeight = document.documentElement.clientHeight;
        this.$el.style.bottom = (docHeight - this.top) + 'px';
        
        const docWidth = document.documentElement.clientWidth;
        //const rect = this.$el.getBoundingClientRect();

        this.$el.style.right = docWidth - this.left + 'px';
    }
}
</script>

<style lang="less">
    @import "../../../../less/vars.less";
    .smiles-panel {
        padding: @base-padding;
        position: absolute;
        background-color: @dark-grey;
        border-radius: 1em 1em 0 1em;
        width: auto;
        height: auto;
        max-width: 20rem;
        text-align: center;
        & > a {
            color: @light-blue;
            text-decoration: none;
            font-size: @label-fontsize;
            &:hover {
                color: @gold;
                text-decoration: none;
            }
        }
        .smiles-panel__smiles {
            overflow: hidden;
            overflow-y: scroll;
            max-height: 12rem;
            img {
                display: inline-block;
                margin: @base-padding;
                vertical-align: baseline;
                cursor: pointer;
            }
        }
    }

    @media screen and (max-width: 699px) {
        .smiles-panel {
            width: 85%;
            max-width: 85%;
        }
    }
</style>