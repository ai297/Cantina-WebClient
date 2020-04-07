<template>
    <svg version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <g fill="currentColor">
            <component :is="icons[iconName]" />
        </g>
    </svg>
</template>

<script>
import iconSmile from './IconSmile.vue';
import iconChat from './IconChat.vue';
import iconGear from './IconGear.vue';
import iconPeople from './IconPeople.vue';
import iconPiramid from './IconPiramid.vue';
import iconMaximize from './IconMaximize.vue';

export default {
    name: "IconBase",
    data: function() {
        return {
            icons: {
                "smile": iconSmile,
                "chat": iconChat,
                "gear": iconGear,
                "people": iconPeople,
                "piramid": iconPiramid,
                "maximize": iconMaximize,
            }
        }
    },
    props: {
        iconName: {
            type: String,
            default: "smile"
        },
    }
}
</script>

<style lang="less" scoped>
    svg {
        display: inline-block;
        width: 1em;
        vertical-align: bottom;
    }
</style>