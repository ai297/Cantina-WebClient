<template>
    <div class="chatOnlineUsers">
        <h3>Сейчас в чате <span>1</span> чел.</h3>
    </div>
</template>

<script>
export default {
    name: "ChatOnlineUsers",

}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";

    div.chatOnlineUsers {
        width: 100%;
        height: @header2-size;
        line-height: @header2-size;
        white-space: nowrap;
        background-color: @dark-grey;
        h3 {
            white-space: nowrap;
            font-size: @base-fontsize;
            line-height: @header2-size;
            text-align: center;
            span {
                color: @blue;
            }
        }
    }
</style>