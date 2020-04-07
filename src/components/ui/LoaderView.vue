<template functional>
    <div id="loaderView" >
        <div>
            <div v-if="props.showIcon"><magic-circle animated /></div>
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: "LoaderView",
    props: {
        showIcon: {
            type: Boolean,
            default: false,
        }
    }
}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";
    #loaderView {
        display: flex;
        position: absolute;
        top: 0; left: 0;
        z-index: 100000;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background-color: mix(@body-background-color, rgba(0,0,0,0), 85%);
        color: @gold;
        & > div {
            display: inline-block;
            font-family: @label-font;
            color: inherit;
            svg {
                width: 6rem;
                margin: 10px;
                display: inline-block;
            }
        }
        div {
            text-align: center;
        }
    }
</style>