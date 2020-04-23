<template>
    <div class="chatAside">
        <div id="chatLogo">
            <animated-logo class="logo" />
        </div>
        <transition name="aside-main" mode="out-in" :duration="{ enter: 800, leave: 500 }">
            <component :is="asideBlock" class="asideBlockComponent" />
        </transition>
        <aside-menu id="asideMenu" />
        <aside-second id="asideFooter" />
        <div class="asideHoverBlock" v-if="!isShowSidebar" :class="{reverse: isreverseDirection}">&nbsp;</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import asideSecond from './ChatAsideSecond.vue';
import asideMenu from './ChatAsideMenu.vue';
import animatedLogo from '../ui/AnimatedLogo.vue';

export default {
    name: "ChatAside",
    components: {
        asideSecond,
        asideMenu,
        animatedLogo,
    },
    computed: {
        ...mapGetters({
            asideBlock: 'chat/getCurrentAsideComponent',
            isShowSidebar: 'chat/isShowSidebar',
            isreverseDirection: 'chat/isReversedDirection',
        }),
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";

    .chatAside {
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        #chatLogo {
            flex-grow: 0;
            padding-top: @header2-size;
            padding-bottom: @base-padding;
            text-align: center;
            .logo {
                width: 90%;
                display: inline-block;
            }
        }
        .asideBlockComponent {
            flex-grow: 0;
            min-height: 6.5rem;
        }
        #asideMenu {
            flex-grow: 1;
            flex-shrink: 0;
            flex-basis: auto;
            overflow: hidden;
        }
        #asideFooter {
            flex-grow: 0;
            flex-shrink: 0;
            flex-basis: auto;
            max-height: 50%;
            overflow: hidden;
        }
        .asideHoverBlock {
            position: absolute;
            top: 0;
            width: 10vw;
            height: 100%;
            opacity: .3;
            transition: all .5s;
            &:not(.reverse) {
                left: -10vw;
            }
            &.reverse {
                right: -10vw;
            }
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


    @media screen and (max-height: 599px), screen and (max-width: 699px) {
        #chatAside {
            padding-top: 1rem;
            align-items: center;
        }
        .chatAside #chatLogo {
            display: none;
        }
    }
</style>