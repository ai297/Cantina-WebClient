<template>
    <ul class="popUpUsersList">
        <li v-for="(user, index) in list()" :key="index" :class="{selected: (index == selected())}"><message-to-user-link :nickname="user" /></li>
    </ul>
</template>
<script>
import messageToUserLink from '../../Components/Messages/MessageUserLink.vue';
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
    mounted: function() {
        const docHeight = document.documentElement.clientHeight;
        this.$el.style.bottom = (docHeight - this.top + 1) + 'px';
        
        const docWidth = document.documentElement.clientWidth;
        const rect = this.$el.getBoundingClientRect();

        this.$el.style.left = (this.left + rect.width < docWidth)? this.left + 'px' : (docWidth - rect.width) + 'px';
    }
}
</script>

<style lang="less">
    @import "../../../../less/vars.less";

    ul.popUpUsersList {
        display: inline-block;
        width: auto;
        max-width: 12rem;
        max-height: 8rem;
        overflow: hidden;
        overflow-y: scroll;
        background-color: @dark-grey;
        border-radius: .5rem;
        position: absolute;

        li {
            list-style: none;
            margin: @base-padding;
            display: block;
            white-space: nowrap;
            color: @blue;

            &.selected {
                &::before {
                    content: '»';
                    padding-right: @base-padding;
                    color: @gold;
                    font-family: @label-font;
                }
                a:not(:hover) {
                    color: @light-blue;
                }
            }
            a {
                &:hover {
                    color: @gold;
                    text-decoration: none;
                }
            }
        }
    }
</style>