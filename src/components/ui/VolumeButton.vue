<template>
    <div class="volumeButton"><button @click="clickMethod">
        <div><slot /></div>
    </button></div>
</template>

<script>
export default {
    name: "volumeButton",
    methods: {
        clickMethod: function(){
            this.$emit('click');
        }
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";
    
    div.volumeButton {
        display: inline-block;
        background: linear-gradient(to bottom, @grey, mix(grey,@btn-base-bgcolor, 50%));
        padding: @ui-border-width * 2;
        text-align: center;
        color: @blue;
        font-size: 1em;
        //font-weight: bold;
        margin: @base-padding / 2 @base-padding;
        box-shadow: 0 1px 3px @btn-base-bgcolor;
        border-radius: @label-fontsize;

        button {
            background: radial-gradient(mix(@blue, @btn-base-bgcolor, 30%), @btn-base-bgcolor);
            border: solid 2px @btn-base-bgcolor;
            border-radius: inherit;
            padding: @base-padding / 2 @base-padding * 2;
            font-weight: inherit;
            font-size: inherit;
            color: inherit;
            text-shadow: 1px 2px 2px @btn-base-bgcolor;
            transition: .3s;
            svg {
                color: @grey;
                display: inline-block;
                width: @label-fontsize * 1.1;
                vertical-align: bottom;
            }
        }
        &:hover {
            background: linear-gradient(to bottom, @blue, mix(@blue, @btn-base-bgcolor, 50%));
            color: @gold;
            button {
                background: radial-gradient(mix(@red, @btn-base-bgcolor, 50%), @btn-base-bgcolor);
                svg {
                    color: inherit;
                }
            }
        }
        &:active {
            button {
                text-shadow: 0 0 2px @btn-base-bgcolor;
                &:before {
                    display: block;
                }
                &:after {
                    display: none;
                }
            }
        }


        &.bright {
            background: linear-gradient(to bottom, @gold, @dark-gold);
            &:hover {
                background: @gold;
                color: white;
            }
            svg {
                color: @gold;
            }
        }

        &.actv {
            background: linear-gradient(to bottom, @blue, mix(@blue, @btn-base-bgcolor, 50%));
            color: @gold;
            button {
                background: radial-gradient(mix(@red, @btn-base-bgcolor, 50%), @btn-base-bgcolor);
                svg {
                    color: @blue;
                }
            }
        }
    }
</style>