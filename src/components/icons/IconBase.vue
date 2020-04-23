<script>
import iconSmile from './IconSmile.vue';
import iconChat from './IconChat.vue';
import iconGear from './IconGear.vue';
import iconPeople from './IconPeople.vue';
import iconPiramid from './IconPiramid.vue';
import iconMaximize from './IconMaximize.vue';
import iconAside from './IconAside.vue';
import iconTime from './IconTime.vue';
import iconSound from './IconSound.vue';
import iconDirection from './IconDirection.vue';
import iconScroll from './IconScroll.vue';

const icons = {
    "smile": iconSmile,
    "chat": iconChat,
    "gear": iconGear,
    "people": iconPeople,
    "piramid": iconPiramid,
    "maximize": iconMaximize,
    "aside": iconAside,
    "time": iconTime,
    "sound": iconSound,
    "direction": iconDirection,
    "scroll": iconScroll,
}

export default {
    name: "IconBase",
    functional: true,
    props: {
        iconName: {
            type: String,
            default: "smile"
        }
    },
    render: function(createElement, ctx) {
        return createElement("svg", {
            attrs: {
                class: "icon",
                version: "1.1",
                viewBox: "0 0 48 48",
                xmlns: "http://www.w3.org/2000/svg",
                ...ctx.data.attrs
            }
        }, [
            createElement("g", {attrs: { fill: "currentColor" }}, [
                createElement(icons[ctx.props.iconName])
            ])
        ])
    }
}
</script>

<style lang="less">
    svg.icon {
        display: inline-block;
        width: 1em;
        vertical-align: bottom;
    }
</style>