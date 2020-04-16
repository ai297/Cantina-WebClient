<template functional>
    <div class="overlayView" >
        <div class="overlayWrapper">
            <div class="header"><h3><slot name="header">{{props.header}}</slot></h3></div>
            <div class="main"><slot /></div>
            <div class="footer"><flat-button v-on="listeners">{{props.buttonText}}</flat-button></div>
        </div>
    </div>
</template>

<script>

export default {
    name: "OverlayView",
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

<style lang="less" scoped>
    @import "../../less/vars.less";
    
    .overlayView {
        display: flex;
        position: absolute;
        top: 0; left: 0;
        z-index: 100;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        overflow: hidden;
        & > .overlayWrapper {
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
                overflow-y: scroll;
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
                    padding: 0.2rem 1rem;
                }
            }
        }
    }
</style>