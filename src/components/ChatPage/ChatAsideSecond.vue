<template>
    <div class="asideSecond">
        <div id="currentOnlineTime">
            Вы в Кантине: <span>55</span> мин.
        </div>
        <div id="serverTime">
            5 февраля 2020г, 22:03
        </div>
    </div>
</template>

<script>
export default {
    name: "ChatAsideSecond"
}
</script>

<style lang="less" scoped>
@import "../../less/vars.less";

    div.asideSecond {
        text-align: center;

        #currentOnlineTime {
            
            span {
                font-weight: bold;
                color: @dark-gold;
            }
        }
        #serverTime {
            font-size: @label-fontsize;
            color: @blue;
        }
    }
</style>