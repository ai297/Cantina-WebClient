<template>
    <aside-base :caption="'Сейчас в чате <span>' + countUsersInOnline + '</span> чел.'">
            <div id="usersOnlineList">
                <user-in-list v-for="user in usersInOnline" :key="user.id" :user="user" :isCurrentUser="isItCurrentUser(user.id)" />
            </div>
    </aside-base>
</template>

<script>
import { mapGetters } from 'vuex';
import userInList from './ChatUserInList.vue';
import asideBase from '../ChatAsideBase.vue';

export default {
    name: "UsersOnlineList",
    components: {
        userInList,
        asideBase,
    },
    methods: {
        isItCurrentUser: function(id) {
            return this.currentUserId == id;
        }
    },
    computed: {
        ...mapGetters({
            usersInOnline: 'users/getUsersInOinline',
            countUsersInOnline: 'users/getCountUsersInOnline',
            currentUserId: 'users/getCurrentUserId',
        }),
    }
}
</script>

<style lang="less">
    @import "../../../less/vars.less";
    
    #usersOnlineList {
        margin: 0 @base-padding;
        padding: @base-padding;
        padding-top: 0;
        text-align: left;
        background-color: @body-background-color;
    }
</style>