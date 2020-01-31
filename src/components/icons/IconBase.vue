<template>
    <svg version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <g fill="currentColor">
            <component :is="icons[iconName]" />
        </g>
    </svg>
</template>

<script>
import iconSmile from './IconSmile.vue';
import iconLogout from './IconLogout.vue';
import iconChat from './IconChat.vue';

export default {
    name: "IconBase",
    components: {
        iconSmile,
        iconLogout,
        iconChat,
    },
    data: function() {
        return {
            icons: {
                "smile": iconSmile,
                "logOut": iconLogout,
                "chat": iconChat,
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