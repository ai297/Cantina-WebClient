<template>
    <div class="asideMainMenu">
        <volume-button @click="changeAsideBlock(usersOnlineList)" :class="{actv: isCurrentComponent(usersOnlineList)}"><cantina-icons iconName="people" /> Онлайн</volume-button>
        <volume-button @click="changeAsideBlock(enotherBlock)" :class="{actv: isCurrentComponent(enotherBlock)}">Другой блок</volume-button>
    </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import usersOnlineList from './UserList/ChatUsersOnlineList.vue';
import enotherBlock from './EnotherBlock.vue';

export default {
    name: "ChatAsideMainMenu",
    data: function() {
        return {
            usersOnlineList,
            enotherBlock,
        }
    },
    computed: {
        ...mapGetters({
            asideBlock: 'chat/getCurrentAsideComponent',
        }),
    },
    methods: {
        ...mapMutations({
            changeAsideBlock: 'chat/changeAsideBlock',
        }),
        isCurrentComponent: function(component) {
            if(this.asideBlock !== undefined) return this.asideBlock.name == component.name;
            else return false;
        },
    },
    mounted: function(){
        this.changeAsideBlock(this.usersOnlineList);
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