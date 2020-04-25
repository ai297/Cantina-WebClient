<template>
    <ul ref="usersList" class="popUpUsersList">
        <li v-for="(user, index) in list" :key="index" :class="{selected: (index == selected)}"><message-to-user-link :nickname="user" /></li>
    </ul>
</template>
<script>
import messageToUserLink from '../Messages/ChatMessageUserLink.vue';
export default {
    name: "PopUpUsersList",
    components: {
        messageToUserLink
    },
    props: {
        list: {
            type: Array
        },
        top: {
            type: Number,
            default: 0,
        },
        left: {
            type: Number,
            default: 0
        },
        selected: {
            type: Number,
            default: 0
        }
    },
    watch: {
        top: function() {
            const docHeight = document.documentElement.clientHeight;
            this.$refs['usersList'].style.bottom = (docHeight - this.top + 1) + 'px';
        },
        left: function() {
            this.$refs['usersList'].style.left = this.left + 'px';
        }
    },
    mounted: function() {
        const docHeight = document.documentElement.clientHeight;
        this.$refs['usersList'].style.bottom = (docHeight - this.top + 1) + 'px';
        
        const docWidth = document.documentElement.clientWidth;
        const rect = this.$refs['usersList'].getBoundingClientRect();

        this.$refs['usersList'].style.left = (this.left + rect.width < docWidth)? this.left + 'px' : (docWidth - rect.width) + 'px';
    }
}
</script>

<style lang="less">
    @import "../../../less/vars.less";

    ul.popUpUsersList {
        display: inline-block;
        width: auto;
        max-width: 12rem;
        max-height: 8rem;
        overflow: hidden;
        overflow-y: scroll;
        background-color: @dark-grey;
        border-radius: .5rem;
        pointer-events: visible;
        position: absolute;

        li {
            list-style: none;
            margin: @base-padding;
            display: block;
            white-space: nowrap;

            &.selected {
                &::before {
                    content: '»';
                    padding-right: @base-padding;
                    color: @system-font-color;
                    font-family: @label-font;
                }
                a:not(:hover) {
                    color: @green;
                }
            }
            a {
                &:hover {
                    color: @blue;
                    text-decoration: none;
                }
            }
        }
    }
</style>