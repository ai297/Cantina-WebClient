<script>
import store from '../../store/store.js';
import animatedLogo from '../ui/AnimatedLogo.vue';

export default {
    name: "ChatAside",
    functional: true,
    render: function(createElement, ctx) {
        let isShowSidebar = store.getters['chat/isShowSidebar'];
        let isreverseDirection = store.getters['chat/isReversedDirection'];
        return createElement("div", {class: Object.assign({'main-aside': true}, ctx.data.class)}, [
            createElement("div", {class: {'main-aside__logo-section': true}}, [
                createElement(animatedLogo, {class: {'logo': true}})
            ]),
            createElement("div", {class: {'main-aside__top-section': true}}, ctx.slots().default),
            createElement("div", {class: {'main-aside__bottom-section': true}}, ctx.slots().bottom),
            createElement("div", {class: {'main-aside__hover-block': true, 'reverse': isreverseDirection}, style: {'display': isShowSidebar ? 'none' : 'block'}}, ["-"]),
        ]);
    },
}
</script>

<style lang="less">
    @import "../../less/vars.less";

    div.main-aside {
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        width: auto;
        min-width: 0;

        .main-aside__logo-section {
            flex-grow: 0;
            padding-top: @header2-size;
            width: 96%;
            margin-bottom: 1em;
            .logo {
                min-width: 0;
                display: inline-block;
            }
        }
        .main-aside__top-section {
            flex-grow: 1;
            min-height: 6.5rem;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            width: 96%;
        }
        .main-aside__bottom-section {
            flex-grow: 0;
            flex-shrink: 0;
            flex-basis: auto;
            max-height: 50%;
            overflow: hidden;
            display: flex;
            text-align: center;
            white-space: nowrap;
            flex-direction: column;
            font-size: @label-fontsize;
            padding-bottom: 1em;
            width: 96%;
        }
        .main-aside__hover-block {
            position: absolute;
            top: 0;
            width: 10vw;
            height: 100%;
            opacity: 0;
            transition: all .5s;
            &:not(.reverse) {
                left: -10vw;
            }
            &.reverse {
                right: -10vw;
            }
        }
    }

    @media screen and (max-height: 599px), screen and (max-width: 699px) {
        .main-aside {
            padding-top: 1rem;
            align-items: center;

            .main-aside__logo-section {
                display: none;
            }
        }
    }
</style>