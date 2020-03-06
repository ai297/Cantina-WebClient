<template functional>
    <div id="loaderView" >
        <div>
            <img src="/icons/loading.svg" alt="loading..." width="48" height="48" /><br />
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: "LoaderView",
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
        & > div {
            display: inline-block;
            font-family: @label-font;
            color: @system-font-color;
            text-align: center;
            img {
                margin: 10px;
            }
        }
    }
</style>