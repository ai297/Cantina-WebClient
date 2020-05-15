<template>
    <div class="main-intro">
        <div :class="{hidden: hide}" v-if="!isPlaying">
            <p>Здесь ведётся строительство магистрали по программе развития окраинных районов галактики.</p>
            <p><small>Подробности в районном бюро планирования.<br />
            α Центавра B, HD 128621, HR 5460, GCTP 3309.00B, LHS 51
            </small></p>
        </div>
        <div class="music-signal" v-else>
            <space-signal />
        </div>
        <div class="space">
            <img src="../../../assets/starman.png" class="starman" ref="starman" v-if="hide"/>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import spaceSignal from '../_Radio/SpaceVizualizer.vue';

export default {
    name: "IntroView",
    components: {
        spaceSignal,
    },
    data: function() {
        return {
            hide: false,
        }
    },
    computed: {
        ...mapGetters({
            isPlaying: 'radio/isPlaying',
        }),
    },
    activated: function() {
        if(!this.isPlaying && !this.hide) setTimeout(() => {
            this.hide = true;
        }, 10000);
    }
}
</script>
<style lang="less">
    @import "../../../less/vars.less";
    div.main-intro {
        justify-content: center;
        align-items: center;
        position: relative;
        & > div {
            transition: all 1s;
        }
        p {
            display: block;
            color: @blue;
            text-align: center;
        }
        .music-signal {
            width: 100%;
        }
        .hidden {
            
            opacity: 0;
        }
        .space {
            position: fixed;
            display: block;
            left: 0;
            top: 0;
            height: 100%;
            width: 100%;
            z-index: -1;
            //pointer-events: none;
            .starman {
                width: 300px;
                height: 94px;
                position: absolute;
                top: 50%;
                left: 0%;
                margin-left: -350px;
                animation: starman 60s linear 10s;
                opacity: .9;
            }
        }
    }
    @keyframes starman {
        0% {
            left: 0%;
            margin-left: -350px;
            transform: rotate(-45deg) scale(.8);
        }
        100% {
            left: 100%;
            margin-left: 50px;
            transform: rotate(60deg) scale(.8);
        }
    }
</style>