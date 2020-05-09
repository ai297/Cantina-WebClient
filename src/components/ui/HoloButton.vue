
<script>
export default {
    name: 'HoloButton',
    functional: true,
    render: function(createElement, ctx) {
        return createElement("button", Object.assign(ctx.data, { class: Object.assign({'holo-button': true }, ctx.data.class !== undefined ? ctx.data.class : {}) }), [
            createElement("div", ctx.children)
        ])
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";
    .holo-button {
        padding: @base-padding @base-padding*2;
        border: 2px solid @blue;
        border-radius: .5em ~"/" 1em;
        color: @gold;
        transition: all .5s;
        background: radial-gradient(mix(@blue, rgba(0,0,0,0), 30%), rgba(0,0,0,0.3));
        &:hover {
            color: @light-blue;
            background: radial-gradient(mix(@blue, rgba(0,0,0,0), 50%), rgba(0,0,0,0.3));
            border-color: @gold;
        }
    }
</style>