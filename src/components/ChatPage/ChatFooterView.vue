<template>
    <div class="chatFooter">
        <p>Cantina chat v.0.1.0 (pre-alpha), 2020г.</p>
    </div>
</template>

<script>
export default {
    name: "ChatFooter"
}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";

    div.chatFooter {
        text-align: center;
        font-size: @small-fontsize;
        color: mix(@base-font-color, @body-background-color, 30%);
    }
</style>