<template functional>
    <div class="asideBlock">
        <div id="asideCaptionContainer">
            <div id="asideBlockCaption"><h3 v-html="props.caption"></h3></div>
        </div>
        <div class="asideBlockBorder"><kotor-border turned /></div>
            <div id="asideContentContainer">
                <slot />
            </div>
        <div class="asideBlockBorder"><kotor-border /></div>
    </div>
</template>
<script>

export default {
    name: "AsideBlockBase",
    props: {
        caption: String
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";
    @asideBlock-border-color: mix(@blue, rgba(0,0,0,0), 70%);
    @asideBlock-header-height: @header3-size;

    div.asideBlock {
        display: flex;
        flex-direction: column;
        overflow: hidden;

    #asideCaptionContainer, #asideContentContainer, .asideBlockBorder {
        text-align: center;
        width: 100%; 
    }
    #asideCaptionContainer {

        #asideBlockCaption {
            width: auto;
            max-width: 90%;
            height: auto;
            display: inline-block;
            overflow: hidden;
            h3 {
                width: auto;
                height: @asideBlock-header-height;
                white-space: nowrap;
                padding: 0 0.5em;
                margin: 0;
                    span {
                        color: @blue;
                    }
                }
            }
        }
        .asideBlockBorder {
            svg {
                width: 96%;
                color: @asideBlock-border-color;
            }
        }
        #asideContentContainer {
            overflow-x: hidden;
            overflow-y: auto;
        }
    }
</style>