<template>
    <div class="sndMForm">
        <div id="nameBlock"><p>{{currentUserName}}:</p></div>
        <message-field id="messageField" @showSmiles="showSmiles" />
        <div id="extendButtons">
            <button @click="changeWidth"><div><cantina-icons iconName="maximize" /></div></button>
        </div>
        <div id="extendPanel" v-show="isShowExtendPanel"></div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import messageField from './MessageField.vue';

export default {
    name: "SendMessageForm",
    components: {
        messageField
    },
    computed: {
        ...mapGetters({
            currentUserName: 'auth/userName',
            isShowExtendPanel: 'chat/isShowExtendPanel',
            extendPanelComponent: 'chat/getExtendPanelComponent',
        }),
    },
    methods: {
        ...mapMutations({
            showExtend: 'chat/showExtendPanel',
            changeWidth: 'chat/changeWidth',
        }),
        showSmiles: function() {
            this.showExtend({});
        }
    },
}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";


    div.sndMForm {
        display: grid;
        width: 100%;
        margin-top: @base-padding;
        grid-template-columns: minmax(6rem, auto) minmax(400px, 1fr) minmax(6rem, auto);

        #nameBlock {
            grid-column: 1;
            color: @gold;
            display: flex;
            vertical-align: middle;
            p {
                width: 100%;
                text-align: right;
                color: @gold;
                white-space: nowrap;
                overflow: hidden;
                line-height: @input-fontsize * 1.4;
                &::after {
                    display: inline-block;
                    content: '';
                    width: @base-padding * 2;
                }
            }
        }
        #messageField {
            grid-column: 2;
        }
        #extendButtons {
            grid-column: 3;
            button {
                display: inline-block;
                line-height: @input-fontsize * 1.4;
                padding: 0;
                margin: 0 @base-padding * 2;
                svg {
                    display: inline-block;
                    vertical-align: text-bottom;
                    width: @input-fontsize;
                    height: @input-fontsize;
                }
                &:hover {
                    color: @gold;
                }
            }
        }
        #extendPanel {
            grid-column-start: 1;
            grid-column-end: 4;
            text-align: center;
        }

        .selection {
            display: inline-block;
            width: 8rem;
            text-align: left;
            background-color: @content-bgcolor;
        }
    }
</style>