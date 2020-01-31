<template>
    <div class="chatNavMenu">
        <volume-button>Архив</volume-button>
        <volume-button>Визиты</volume-button>
        <volume-button>Настройки</volume-button>
        <volume-button id="btnExit" class="bright" @click="exit">ВЫХОД<cantina-icons iconName="logOut" /></volume-button>
        <volume-button>Отойти</volume-button>
    </div>
</template>

<script>
import cantinaIcons from '../icons/IconBase.vue';

export default {
    name: "ChatNavMenu",
    components: {
        cantinaIcons
    },
    methods: {
        exit: function() {
            this.$router.push('main');
        }
    }
}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";

    div.chatNavMenu {
        text-align: center;
        padding: @base-padding;

        svg {
            display: inline-block;
            width: @base-fontsize;
            height: @base-fontsize;
            vertical-align: top;
            margin-left: @base-padding;
        }
    }
</style>