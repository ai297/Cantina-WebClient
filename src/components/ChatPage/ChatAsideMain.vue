<template>
    <div id="asideMain">
        <online-users />
    </div>
</template>

<script>
import onlineUsers from './ChatOnlineUsers.vue';

export default {
    name: "ChatAsideMain",
    components: {
        onlineUsers
    }
}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";

    div#asideMain {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>