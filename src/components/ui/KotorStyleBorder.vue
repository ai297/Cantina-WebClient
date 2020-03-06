<template functional>
    <svg version="1.1" viewBox="0 0 300 15" xmlns="http://www.w3.org/2000/svg" :class="{turn: props.turned}" fill="currentColor">
        <path d="m2 2s2 4.5 6.9 4.5h121s3.1 2.8 6.9 2.8h26c3.7 0 6.9-2.8 6.9-2.8h121c4.9 0 6.9-4.5 6.9-4.5h-88l-3.8 2.6h-113l-3.8-2.6z"/>
        <path d="m63 0 13 8.5h-25s0.75 2.4 4.8 2.4h24l4.8 3.1 6-1.8h24c2.3 0 4.3-2.8 4.3-2.8h-31l-15-9.4z" />
        <path d="m237 0-13 8.5h25s-0.75 2.4-4.8 2.4h-24l-4.8 3.1-6-1.8h-24c-2.3 0-4.3-2.8-4.3-2.8h31l15-9.4z" />
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

<style lang="less" scoped>
    .turn {
        transform: scale(1,-1);
    }
</style>