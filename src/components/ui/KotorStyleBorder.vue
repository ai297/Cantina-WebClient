<template functional>
    <svg version="1.1" viewBox="0 0 300 15" xmlns="http://www.w3.org/2000/svg" :class="{turn: props.turned}" fill="currentColor">
        <path d="m63 1 3.1 1.9h-64s2 4.2 6.9 4.2h64l3.1 1.9h-25s0.75 2.2 4.8 2.2h24l4.8 2.9 6-1.7h24c2.3 0 4.3-2.6 4.3-2.6h-31l-4.6-2.7h47s3.1 2.6 6.9 2.6h26c3.7 0 6.9-2.6 6.9-2.6h47l-4.6 2.7h-31s2 2.6 4.3 2.6h24l6 1.7 4.8-2.9h24c4 0 4.8-2.2 4.8-2.2h-25l3.1-1.9h64c4.9 0 6.9-4.2 6.9-4.2h-64l3.1-1.9h-9.9l-3.2 1.9h-14l-3.8 2.4h-113l-3.8-2.4h-13l-3.2-1.9z"/>
    </svg>
</template>

<script>
export default {
    name: "ks-border",
    props: {
        turned: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="less">
    svg.turn {
        transform: scale(1,-1);
    }
</style>