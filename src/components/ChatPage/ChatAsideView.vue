<template>
    <div class="chatAside">
        <div id="chatLogo">
            <h2>— Сюда бы какой-нибудь текст —</h2>
            <img src="/icons/logo.svg" alt="Кантина" />
        </div>
        <aside-main />
        <aside-menu />
    </div>
</template>

<script>
import asideMain from './ChatAsideMain.vue';
import asideMenu from './ChatAsideMenu.vue';

export default {
    name: "ChatAside",
    components: {
        asideMain,
        asideMenu,
    }
}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";

    h2 {
        color: @gold;
        margin-bottom: @base-padding;
        font-weight: normal;
        font-size: @base-fontsize;
    }
    .chatAside {
        display: grid;
        grid-template-rows: auto 1fr auto;

        div#chatLogo {
            padding: @base-fontsize @base-padding;
            text-align: center;
        }
    }
</style>