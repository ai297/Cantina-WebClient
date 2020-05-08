<template functional>
    <div class="chat-aside__top-section-base">
        <div class="caption-wrapper">
            <slot name="caption"><h3 v-html="props.caption"></h3></slot>
        </div>
        <div class="content-border"><kotor-border turned /></div>
            <div class="content-wrapper">
                <slot />
            </div>
        <div class="content-border"><kotor-border /></div>
    </div>
</template>
<script>

export default {
    name: "BaseAsideSection",
    props: {
        caption: String
    }
}
</script>

<style lang="less">
    @import "../../../less/vars.less";

    div.chat-aside__top-section-base {
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .caption-wrapper, .content-border {
            text-align: center;
            width: 100%; 
            flex-shrink: 0;
        }
        .caption-wrapper {
            height: auto;
            display: inline-block;
            overflow: hidden;
            h3 {
                width: auto;
                white-space: nowrap;
                padding: 0 0.5em;
                margin: 0;
                span {
                    color: @blue;
                }
            }
        }
        .content-border {
            svg {
                width: 100%;
                color: @blue;
                opacity: .75;
            }
        }
        .content-wrapper {
            overflow-x: hidden;
            overflow-y: auto;
            width: 100%;
        }
    }
</style>