<template>
    <div class="chatMain">
        <div id="interactive">
        </div>
        <div id="messages">
            Сообщения тут
        </div>
    </div>
</template>

<script>
export default {
    name: "chatMain"
}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";

    div.chatMain {
            display: grid;
            grid-template-rows: auto minmax(38%, 1fr);
            overflow: hidden;
            padding: @base-padding;
            background-color: @body-background-color;

            #interactive {
                display: block;
                overflow: hidden;
                padding: 3px;
            }

            #messages {
                display: block;
                overflow-y: scroll;
                padding: 15px;
                border: 1px solid mix(@base-font-color, @body-background-color, 30%);
            }
    }

</style>