<template functional>
    <svg :class="{animated: props.animated, 'magic-circle': true}" version="1.1" viewBox="0 0 74 40" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="m37 10a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10 10 10 0 0 0-10-10zm0 5a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5z" />
        <path d="m37 5a15 15 0 0 0-15 15 15 15 0 0 0 15 15 15 15 0 0 0 15-15 15 15 0 0 0-15-15zm0 5a10 10 0 0 1 10 10 10 10 0 0 1-10 10 10 10 0 0 1-10-10 10 10 0 0 1 10-10z" />
        <path d="m37-0.5a20 20 0 0 0-20 20 20 20 0 0 0 20 20 20 20 0 0 0 20-20 20 20 0 0 0-20-20zm0 5.5a15 15 0 0 1 15 15 15 15 0 0 1-15 15 15 15 0 0 1-15-15 15 15 0 0 1 15-15z" />
        <path d="m21-0.092a26 26 0 0 0-9.5 20 26 26 0 0 0 9.4 20h10a21 21 0 0 1-15-20 21 21 0 0 1 15-20h-10zm23 0a21 21 0 0 1 15 20 21 21 0 0 1-15 20h10a26 26 0 0 0 9.4-20 26 26 0 0 0-9.5-20h-10z" />
        <path d="m11 0c-2.1 2.4-3.8 5.1-5.1 8h-3.8a37 37 0 0 0-2.1 12 37 37 0 0 0 2.1 12h3.8c1.3 2.9 3 5.6 5 8h7.5c-6.2-4.8-9.8-12-9.8-20 0.0079-7.8 3.6-15 9.8-20zm45 0c6.2 4.8 9.8 12 9.8 20-0.0098 7.8-3.6 15-9.8 20h7.4c2.1-2.4 3.8-5.1 5.1-8h3.8a37 37 0 0 0 2.1-12 37 37 0 0 0-2.1-12h-3.8c-1.3-2.9-3-5.6-5-8z" />
    </svg>
</template>

<script>
export default {
    name: "MagicCircle",
    props: {
        animated: {
            type: Boolean,
            default: false,
        }
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";
    .magic-circle {
        display: block;
        &.animated {
            path:nth-child(1) {
                opacity: 0;
                animation: stepLoader .4s steps(1) 0s infinite normal;
            }
            path:nth-child(2) {
                opacity: 0;
                animation: stepLoader .4s steps(1) .1s infinite normal;
            }
            path:nth-child(3) {
                opacity: 0;
                animation: stepLoader .4s steps(1) .2s infinite normal;
            }
            path:nth-child(4) {
                opacity: 0;
                animation: stepLoader .4s steps(1) .3s infinite normal;
            }
        }
        &:not(.animated) {
            path {
                display: none;
            }
            path:last-child {
                display: block;
            }
        }
    }

    @keyframes stepLoader {
        0% {
            opacity: .6;
        }
        25% {
            opacity: 0.1;
        }
        100% {
            opacity: 0.1;
        }
    }
</style>