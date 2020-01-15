<template>
    <div id="modalContainer">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "ModalContaner"
}
</script>

<style lang="less" scoped>
    @import "../less/vars.less";

    div#modalContainer {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: @dark-grey;
        z-index: 100;
        overflow: auto;
        white-space: nowrap;
        text-align: center;
        &:before {
            height: 100%;
            display: inline-block;
            vertical-align: middle;
            content: '';
        }
    }
</style>

<style lang="less">
    @import "../less/vars.less";
    .modalWindow {
        display: inline-block;
        white-space: normal;
        vertical-align: middle;
        max-width: 400px;
        width: 100%;
        height: auto;
        padding: 20px;
        h2 {
            display: block;
            font-size: @header2-size;
            font-family: @headers-font;
            margin: round(@header2-size * 0.2);
            margin-bottom: round(@header2-size * 0.8);
        }
        form input {
            font-size: @input-fontsize;
        }
        form label {
            font-size: @label-fontsize;
            font-family: @headers-font;
            font-weight: bold;
        }
        form input[type="submit"],
        form input[type="button"] {
            cursor: pointer;
        }
    }
</style>