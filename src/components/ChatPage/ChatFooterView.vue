<template functional>
    <div class="chatFooter" :id="props.id">
        <p>Cantina chat v.0.1.1 (pre-alpha), 2020г.</p>
    </div>
</template>

<script>
export default {
    name: "ChatFooter",
    props: {
        id: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";

    div.chatFooter {
        text-align: center;
        font-family: @label-font;
        font-size: @small-fontsize;
        color: mix(@base-font-color, @body-background-color, 50%);
    }
</style>