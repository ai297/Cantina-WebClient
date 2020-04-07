<template functional>
    <button class="flatButton" v-on="listeners"><div><slot /></div></button>
</template>

<script>
export default {
    name: "FlatButton",
}
</script>

<style lang="less">
    @import "../../less/vars.less";
    .flatButton {
        background-color: inherit;
        padding: .3em 1em;
        margin: .4em;
        border: @ui-border-width solid @gold;
        border-radius: 1em;
        color: @gold;
        text-shadow: 1px 1px 2px @body-background-color;
        transition: color .5s;
        &:hover, &:focus {
            color: @blue;
            border-color: @green;
        }
    }
</style>