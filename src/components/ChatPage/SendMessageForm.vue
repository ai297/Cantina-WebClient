<template>
    <div class="sndMForm">
        <div id="nameBlock"><p>{{currentUserName}}:</p></div>
        <div id="messageField">
            <message-field />
            <div id="extendPanel" v-show="isShowExtendPanel">тест тест тест</div>
        </div>
        <div id="extendButtons">
            <button @click="changeWidth"><div><cantina-icons iconName="maximize" /></div></button>
        </div>
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
    },
}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";


    div.sndMForm {
        display: flex;
        width: 100%;
        margin-top: @base-padding;
        align-items: flex-start;

        #nameBlock {
            color: @gold;
            display: inline-block;
            flex-grow: 0;
            flex-shrink: 0;
            max-width: 10rem;
            min-width: 8rem;
            flex-basis: auto;
            padding-right: @base-padding*2;
            p {
                width: 100%;
                text-align: right;
                color: @gold;
                white-space: nowrap;
                overflow: hidden;
                line-height: @input-fontsize * 1.4;
            }
        }
        #messageField {
            flex-grow: 1;
            flex-shrink: 1;
        }
        #extendButtons {
            flex-grow: 0;
            flex-shrink: 0;
            flex-basis: auto;
            min-width: 8rem;
            line-height: @input-fontsize * 1.4;
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
            text-align: center;
            background-color: brown;
        }

        .selection {
            display: inline-block;
            width: 8rem;
            text-align: left;
            background-color: @content-bgcolor;
        }
    }
</style>