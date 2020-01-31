<template>
    <div class="volumeButton"><button :id="id" @click="clickMethod">
        <slot />
    </button></div>
</template>

<script>
export default {
    name: "volumeButton",
    props: {
        id: String,
        click: Function
    },
    methods: {
        clickMethod: function(){
            this.$emit('click');
        }
    }
}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";
    
    div.volumeButton {
        display: inline-block;
        border-radius: @system-fontsize;
        background: linear-gradient(to bottom, @grey, mix(grey,@btn-base-bgcolor, 50%));
        padding: 2px;
        text-align: center;
        font-family: @button-font;
        font-weight: bold;
        font-size: @system-fontsize;
        color: @blue;
        margin: 3px 5px;
        

        button {
            background: radial-gradient(mix(@blue, @btn-base-bgcolor, 30%), @btn-base-bgcolor);
            border: solid 2px @btn-base-bgcolor;
            border-radius: inherit;
            padding: 2px 10px;
            font-family: inherit;
            font-weight: inherit;
            font-size: inherit;
            color: inherit;
            cursor: pointer;
            text-shadow: 1px 2px 2px @btn-base-bgcolor;
            transition: .3s;
            svg {
                color: @gold;
            }

            &:before, &:after {
                content: '';
                display: block;
                width: 100%;
                height: 1px;
                overflow: hidden;
            }
            &:before {
                display: none;
            }
            &:focus {
                outline: none;
            }
        }
        &:hover {
            background: linear-gradient(to bottom, @blue, mix(@blue, @btn-base-bgcolor, 50%));
            color: @gold;
            button {
                background: radial-gradient(mix(@red, @btn-base-bgcolor, 50%), @btn-base-bgcolor);
                svg {
                    color: white;
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
        }

        &.actv {
            background: linear-gradient(to bottom, @blue, mix(@blue, @btn-base-bgcolor, 50%));
            color: @gold;
            button {
                background: radial-gradient(mix(@red, @btn-base-bgcolor, 50%), @btn-base-bgcolor);
            }
        }
    }
</style>