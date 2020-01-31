<template>
    <div class="sndMForm">
        <div id="nameBlock"><p>darkWind:</p></div>
        <div id="messageField">
            <message-field />
            <span>текст</span>
        </div>
        <div id="extendButtons"></div>
    </div>
</template>

<script>
import messageField from '../fields/MessageField.vue';

export default {
    name: "SendMessageForm",
    components: {
        messageField
    },
}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";


    div.sndMForm {
        display: grid;
        width: 100%;
        margin-top: @base-padding;
        grid-template-columns: minmax(130px, auto) minmax(400px, 1fr) minmax(130px, auto);
        background: @content-background-color;

        #nameBlock {
            grid-column: 1;
            color: @gold;
            display: flex;
            vertical-align: middle;
            p {
                width: 100%;
                text-align: right;
                font-size: @base-fontsize;
                font-family: @headers-font;
                color: @gold;
                line-height: @message-input-height;
                white-space: nowrap;
                overflow: hidden;
            }
        }
        #messageField {
            grid-column: 2;
        }
        #extendButtons {
            grid-column: 3;
        }
    }
</style>