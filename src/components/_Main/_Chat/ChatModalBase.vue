<template functional>
    <div class="chat-modal">
        <div class="header"><h3><slot name="header">{{props.header}}</slot></h3></div>
        <div class="main"><slot /></div>
        <div class="footer"><flat-button v-on="listeners">{{props.buttonText}}</flat-button></div>
    </div>
</template>

<script>

export default {
    name: "ChatModalBase",
    props: {
        buttonText: {
            type: String,
            default: "OK"
        },
        header: {
            type: String,
            default: '\u00A0'
        },
    },

}
</script>

<style lang="less">
    @import "../../../less/vars.less";
    
    .chat-modal {
        display: flex;
        flex-direction: column;
        width: 95%;
        max-width: 40rem;
        min-width: 20rem;
        max-height: 95%;
        text-align: center;

        & > .header {
            flex-grow: 0;
            flex-shrink: 0;
            width: 100%;
            border: @base-border-width solid @blue;
            border-radius: @header3-size*2 @header3-size*2 0 0;
            background-color: @dark-blue;
            h3 {
                margin: @base-padding 0;
            }
        }
        & > .main {
            flex-grow: 1;
            flex-shrink: 1;
            margin: @base-padding;
            padding: @base-padding * 2;
            background-color: @dark-grey;
            overflow: hidden;
            display: flex;
            ::-webkit-scrollbar-thumb {
                background-color: @dark-gold;
            }
        }
        & > .footer {
            flex-grow: 0;
            flex-shrink: 0;
            width: 100%;
            border: @base-border-width solid @blue;
            border-radius: 0 0 @header3-size*2 @header3-size*2;
            background-color: @dark-blue;
            & .flatButton {
                margin: @base-padding;
                padding: @base-padding 1rem;
            }
        }
    }
</style>