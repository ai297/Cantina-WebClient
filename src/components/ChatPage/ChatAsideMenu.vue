<template>
    <div class="asideMenu">
        <volume-button @click="changeAsideBlock(usersOnlineList)"  :active="isCurrentComponent(usersOnlineList)" title="Показать список присутствующих"><cantina-icons iconName="people" /> Онлайн</volume-button>
        <volume-button @click="changeAsideBlock(radioModule)"  :active="isCurrentComponent(radioModule)" title="Открыть радио"><cantina-icons iconName="radio" /> Радио</volume-button>
    </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import usersOnlineList from './UserList/ChatUsersOnlineList.vue';
import radioModule from '../Radio/AsideRadioModule.vue';
//import { CHAT_COMMANDS } from '../../constants.js';

export default {
    name: "ChatAsideMenu",
    data: function() {
        return {
            usersOnlineList,
            radioModule,
        }
    },
    computed: {
        ...mapGetters({
            asideBlock: 'chat/getCurrentAsideComponent',
            isShowSmiles: 'chat/showSmiles',
        }),
    },
    methods: {
        ...mapActions({
            runCommand: 'commands/run',
        }),
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

<style lang="less">
    @import "../../less/vars.less";
    div.asideMenu {
        text-align: center;
        padding-top: round(@base-fontsize / 2);
    }
</style>