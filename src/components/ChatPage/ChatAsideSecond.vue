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
import {MOUNTHS} from "../../constants.js";
export default {
    name: "ChatAsideSecond",

    data: function() {
        return {
            enterTime: Date.now(),
            currentTime: Date.now()
        }
    },
    computed: {
        ...mapGetters({
            usersInOnline: 'users/usersInOinline',
            currentUserId: 'auth/userId',
        }),
        onlineTime: function() {
            return Math.round((new Date(this.currentTime) - this.enterTime) / 60000);
        },
        formattedCurrentTime: function() {
            let dt = new Date(this.currentTime);
            let hours = dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours();
            let minutes = dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes();
            let day = dt.getDate();
            let mounth = MOUNTHS[dt.getMonth()];
            let year = dt.getFullYear();
            return `${day} ${mounth} ${year}г. ${hours}:${minutes}`;
        }
    },
    methods: {
        updateCurrentTime: function() {
            this.currentTime = Date.now();
            setTimeout(this.updateCurrentTime, 1000);
        },
        currentUserEnterTime: function() {
            for(let i in this.usersInOnline){
                if(this.usersInOnline[i].id == this.currentUserId) return new Date(this.usersInOnline[i].enterTime)
            }
            return new Date(Date.now());
        },
    },
    mounted: function() {
        this.enterTime = this.currentUserEnterTime();
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