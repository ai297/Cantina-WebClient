<template>
    <div class="asideSecond">
        <div id="currentOnlineTime">
            Вы в Кантине: <span>{{onlineTime}}</span> мин.
        </div>
        <div id="serverTime">
            {{formattedCurrentTime}}
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
    name: "ChatAsideSecond",

    data: function() {
        return {
            currentTime: Date.now()
        }
    },
    computed: {
        ...mapGetters({
            usersInOnline: 'users/usersInOinline',
            currentUserId: 'auth/userId',
        }),
        currentUserEnterTime: function() {
            for(let i in this.usersInOnline){
                if(this.usersInOnline[i].id == this.currentUserId) return new Date(this.usersInOnline[i].enterTime)
            }
            return new Date(Date.now());
        },
        onlineTime: function() {
            return Math.round((new Date(this.currentTime) - this.currentUserEnterTime) / 60000);
        },
        formattedCurrentTime: function() {
            let dt = new Date(this.currentTime);
            let hours = dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours();
            let minutes = dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes();
            let day = dt.getDate();
            let mounth = dt.getMonth() < 9 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1;
            let year = dt.getFullYear();
            return `${day}.${mounth}.${year}г. ${hours}:${minutes}`;
        }
    },
    methods: {
        updateCurrentTime: function() {
            this.currentTime = Date.now();
            setTimeout(this.updateCurrentTime, 1000);
        }
    },
    mounted: function() {
        this.updateCurrentTime();
    },
}
</script>

<style lang="less" scoped>
@import "../../less/vars.less";

    div.asideSecond {
        text-align: center;

        #currentOnlineTime {
            
            span {
                font-weight: bold;
                color: @dark-gold;
            }
        }
        #serverTime {
            font-size: @label-fontsize;
            color: @blue;
        }
    }
</style>