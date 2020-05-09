<template>
    <aside-section :caption="'Онлайн <span>' + countUsers + '</span> чел.'">
        <div id="usersOnlineList">
            <user-in-list v-for="user in usersInOnline" :key="user.userId" :user="user" :isCurrentUser="isItCurrentUser(user.userId)" />
        </div>
    </aside-section>
</template>

<script>
import { mapGetters } from 'vuex';
import userInList from './UserInList.vue';
import asideSection from '../../Components/BaseAsideSection.vue';

export default {
    name: "UsersOnlineList",
    components: {
        userInList,
        asideSection,
    },
    methods: {
        isItCurrentUser: function(id) {
            return this.currentUser.userId == id;
        }
    },
    computed: {
        ...mapGetters({
            usersInOnline: 'users/usersInOinline',
            currentUser: 'users/currentUser',
        }),
        countUsers: function() {
            return Object.keys(this.usersInOnline).length;
        },
    },
}
</script>

<style lang="less">
    @import "../../../../less/vars.less";
    
    #usersOnlineList {
        padding-top: 0;
        text-align: left;
        // /background-color: @body-background-color;
    }
</style>