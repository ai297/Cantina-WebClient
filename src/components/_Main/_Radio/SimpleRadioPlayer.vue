<template>
    <div class="simple-radio">
        <radio-vizualizer :size="32" />
        <div class="simple-radio__controls">
            <holo-button @click="play">{{isPlaying ? 'Выключить' : 'Радио'}}</holo-button>
        </div>
        <div>В эфире: <b>{{dj}}</b></div>
        <div>Играет: <i>{{track}}</i></div>
    </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import radioVizualizer from './RadioVisualizer.vue';

export default {
    name: "SimpleRadioPlayer",
    components: {
        radioVizualizer,
    },
    computed: {
        ...mapGetters({
            audio: 'radio/audio',
            volume: 'radio/volume',
            isPlaying: 'radio/isPlaying',
            dj: 'radio/dj',
            track: 'radio/track',
        })
    },
    methods: {
        ...mapMutations({
            create: 'radio/createElement',
            delete: 'radio/deleteElement',
            changeVolume: 'radio/changeVolume',
        }),
        ...mapActions({
            play: 'radio/playPause',
        }),
    },
    mounted: function() {
        this.create();
    },
}
</script>

<style lang="less">
    @import "../../../less/vars.less";
    .simple-radio {
        position: relative;
        margin: 1em 0;
        .simple-radio__controls {
            z-index: 1;
            padding: @base-padding;
            margin-top: -7%;
        }
    }
</style>