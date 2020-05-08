<template functional>
    <div class="footer" :id="props.id">
        <p>the Cantina chat v.0.2 (alpha), 2020г.</p>
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

    div.footer {
        text-align: center;
        font-family: @label-font;
        font-size: @small-fontsize;
        p {
            display: inline-block;
            padding: 0 2em;
            background: linear-gradient(to bottom, mix(@dark-grey, @grey, 70%), @body-background-color);
            color: mix(@dark-grey, @grey, 50%);
            border-radius: 0 0 2em 2em ~"/" 0 0 100% 100%;
            text-shadow: @body-background-color 0 -1px 2px;
        }
    }
</style>