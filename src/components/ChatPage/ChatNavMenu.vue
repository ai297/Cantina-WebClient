<template>
    <div class="chatNavMenu">
        <a id="btnExit" @click.prevent="exit">Выйти</a>
    </div>
</template>

<script>
export default {
    name: "ChatNavMenu",
    methods: {
        exit: function() {
            this.$router.push('/');
        }
    }
}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";

    div.chatNavMenu {
        text-align: center;
        padding: @base-padding;
        line-height: @base-fontsize;
        white-space: nowrap;

        a {
            font-family: @main-font;
            display: inline-block;
            padding: 0 @base-padding;
            text-decoration: none;
            color: @base-font-color;
            &:hover, &:active {
                color: @gold;
                text-decoration: underline;
            }
            &:focus {
                outline: none;
                color: @blue;
            }
        }

        svg {
            display: inline-block;
            color: @blue;
            width: @base-fontsize;
            height: @base-fontsize;
            vertical-align: bottom;
            margin-left: @base-padding;
        }
    }
</style>