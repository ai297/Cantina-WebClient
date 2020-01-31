<template>
    <div>
        <slot /><br>
        <img src="/icons/loading.svg" alt="loading..." width="48" height="48" /><br />
        <span>Подключение...</span>
    </div>
</template>

<script>
export default {
    name: "connectingView"
}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";

    div {
        display: inline-block;
        font: @system-message-font;
        color: @grey;
        span {
            color: @gold;
        }
        img {
            margin: 10px;
        }
    }
</style>