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
import iconGear from './IconGear.vue';
import iconPeople from './IconPeople.vue';
import iconIgnore from './IconIgnore.vue';
import iconClaim from './IconClaim.vue';
import iconPiramid from './IconPiramid.vue';
import iconMaximize from './IconMaximize.vue';

export default {
    name: "IconBase",
    data: function() {
        return {
            icons: {
                "smile": iconSmile,
                "logOut": iconLogout,
                "chat": iconChat,
                "gear": iconGear,
                "people": iconPeople,
                "ignore": iconIgnore,
                "claim": iconClaim,
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