<template functional>
    <div class="asideBlock">
        <div id="asideCaptionContainer">
            <div id="asideBlockCaption"><h3 v-html="props.caption"></h3></div>
        </div>
        <div id="asideBlockTopBorder"><kotor-border turned /></div>
            <div id="asideContentContainer">
                <slot />
            </div>
        <div id="asideBlockBottomBorder"><kotor-border /></div>
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
        display: grid;
        width: 100%;
        height: auto;
        overflow: hidden;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto minmax(auto, 1fr);
        #asideCaptionContainer, #asideContentContainer,
        #asideBlockTopBorder, #asideBlockBottomBorder {
            text-align: center;
            width: 100%; 
        }
        #asideCaptionContainer {
            grid-row: 1;
            grid-column: 1;
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
        #asideBlockTopBorder, #asideBlockBottomBorder {
            grid-column: 1;
            svg {
                width: 96%;
                color: @asideBlock-border-color;
            }
        }
        #asideBlockTopBorder {
            grid-row: 2;
        }
        #asideBlockBottomBorder {
            grid-row: 4;
        }
        #asideContentContainer {
            grid-row: 3;
            grid-column: 1;
            overflow-x: hidden;
            overflow-y: auto;
            height: 100%;
        }
    }
</style>