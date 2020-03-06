<template>
    <div class="asideMainMenu">
        <volume-button @click="showOnlineList" :class="{actv: isUsersOnlineList}"><cantina-icons iconName="people" /> Онлайн</volume-button>
        <volume-button @click="showEnotherBlock" :class="{actv: isEnotherBlock}">Другой блок</volume-button>
    </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import usersOnlineList from './UserList/ChatUsersOnlineList.vue';
import enotherBlock from './EnotherBlock.vue';

export default {
    name: "ChatAsideMainMenu",
    computed: {
        ...mapGetters({
            asideBlock: 'chat/getCurrentAsideComponent',
        }),
        isUsersOnlineList: function() {
            return this.asideBlock.name == usersOnlineList.name;
        },
        isEnotherBlock: function() {
            return this.asideBlock.name == enotherBlock.name;
        },
    },
    methods: {
        ...mapMutations({
            changeAsideBlock: 'chat/changeAsideBlock',
        }),
        showOnlineList: function() {
            this.changeAsideBlock(usersOnlineList);
        },
        showEnotherBlock: function() {
            this.changeAsideBlock(enotherBlock);
        }
    },
}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";
    div.asideMainMenu {
        text-align: center;
        padding-top: round(@base-fontsize / 2);
    }
</style>