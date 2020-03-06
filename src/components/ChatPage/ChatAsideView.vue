<template>
    <div class="chatAside">
        <div id="chatLogo">
            <animated-logo class="logo" />
        </div>
        <transition name="aside-main" mode="out-in" :duration="{ enter: 800, leave: 500 }">
            <component :is="asideBlock" class="asideBlockComponent" />
        </transition>
        <aside-main-menu id="asideMenu" />
        <aside-second id="asideFooter" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import asideSecond from './ChatAsideSecond.vue';
import asideMainMenu from './ChatAsideMainMenu.vue';
import animatedLogo from '../ui/AnimatedLogo.vue';

export default {
    name: "ChatAside",
    components: {
        asideSecond,
        asideMainMenu,
        animatedLogo,
    },
    computed: {
        ...mapGetters({
            asideBlock: 'chat/getCurrentAsideComponent',
        }),
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";

    .chatAside {
        display: grid;
        grid-template-rows: auto auto 1fr auto;
        overflow: hidden;
        #chatLogo {
            padding-top: @header2-size;
            padding-bottom: @base-padding;
            text-align: center;
            grid-row: 1;
            .logo {
                width: 90%;
                display: inline-block;
            }
        }
        .asideBlockComponent {
            grid-row: 2;
        }
        #asideMenu {
            grid-row: 3;
        }
        #asideFooter {
            grid-row: 4;
        }
    }

    .aside-main-enter-active {
        #asideBlockCaption {
            animation: emerging .5s forwards;
        }
        #asideContentContainer > *:first-child {
            animation: topEmerging .8s forwards;
        }
    }
    .aside-main-leave-active  {
        #asideBlockCaption {
            animation: emerging .5s reverse forwards;
        }
        #asideContentContainer > *:first-child {
            animation: topEmerging .5s reverse forwards;
        }
    }

    @keyframes emerging {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    @keyframes topEmerging {
        from {
            margin-top: -100%;
        }
        to {
            margin-top: 0%;
        }
    }
</style>