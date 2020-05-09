<template>
    <div class="chatSettingsPanel" :style="{'flex-direction': (reverseDirection && !isMinWidth()) ? 'row-reverse' : 'row'}">
        <volume-button v-if="$route.name=='chat'" @click="switchScrollMode()" :active="autoScroll" title="Авто прокрутка к новым сообщениям"><cantina-icons iconName="scroll" /></volume-button>
        <volume-button @click="changeWidth" :active="!isLimitedChatWidth" title="Растянуть на весь экран (для экранов FullHD и больше)"><cantina-icons iconName="maximize" /></volume-button>
        <volume-button @click="changeAsideBlockMode" :active="!isShowSidebar" title="Скрывать боковую панель (будет показываться при наведении курсора в правую часть экрана)"><cantina-icons iconName="aside" /></volume-button>
        <volume-button @click="switchTimeMode" :active="isShowTime" title="Показывать время сообщений"><cantina-icons iconName="time" /></volume-button>
        <volume-button @click="switchSoundNoticeMode" :active="soundNotice" title="Звуковое уведомление о сообщениях"><cantina-icons iconName="sound" /></volume-button>
        <volume-button @click="switchDirection" :active="reverseDirection" title="Переместить боковую панель влево"><cantina-icons iconName="direction" /></volume-button>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';

export default {
    name: "ChatSettings",
    computed: {
        ...mapGetters({
            isMinWidth: 'isMinWidth',

            isLimitedChatWidth: "chat/isLimitedChatWidth",
            isShowSidebar: "chat/isShowSidebar",
            reverseDirection: "chat/isReversedDirection",
            autoScroll: "chat/autoScroll",

            isShowTime: "messages/showTime",
            soundNotice: "messages/soundNotice",
        })
    },
    methods: {
        ...mapMutations({
            changeWidth: "chat/changeWidth",
            changeAsideBlockMode: "chat/switchAsideMode",
            switchDirection: "chat/switchDirection",
            switchScrollMode: "chat/switchScrollMode",

            switchTimeMode: "messages/switchTimeMode",
            switchSoundNoticeMode: "messages/switchSoundNoticeMode",
        }),
    }
}
</script>

<style lang="less">
    @import "../../../less/vars.less";
    .chatSettingsPanel {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: @base-padding;
        overflow: hidden;
    }
    @media screen and (max-width: 699px) {
        .chatSettingsPanel {
            display: none;
        }
    }
</style>