<script>
export default {
    name: "volumeButton",
    functional: true,
    props: {
        active: {
            type: Boolean,
            default: false
        },
        bright: {
            type: Boolean,
            default: false
        }
    },
    render: function(createElement, context){
        let button = createElement("button", {
            on: context.listeners,
        }, [createElement("div", context.children)]);
        return createElement("div", {
            class: { actv: context.props.active, bright: context.props.bright },
            staticClass: context.data.staticClass !== undefined ? 'volumeButton ' + context.data.staticClass : 'volumeButton',
            attrs: context.data.attrs,
        }, [button]);
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
            padding: @base-padding/2 @base-padding;
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
            background: linear-gradient(to bottom, @light-blue, @blue);
            color: @light-blue;
            button {
                background: radial-gradient(@dark-red, @btn-base-bgcolor);
                svg {
                    color: @gold;
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

        &.actv {
            background: linear-gradient(to bottom, @blue, mix(@blue, @body-background-color, 50%));
            color: @light-blue;
            button {
                background: radial-gradient(mix(@red, @btn-base-bgcolor, 50%), @btn-base-bgcolor);
                svg {
                    color: @gold;
                }
            }
        }

        &.bright {
            background: linear-gradient(to bottom, @gold, @dark-gold);
            color: @light-blue;
            &:hover {
                background: @gold;
                color: white;
            }
            svg {
                color: @gold;
            }
            &.actv {
                color: @gold;
            }
        }
    }
</style>