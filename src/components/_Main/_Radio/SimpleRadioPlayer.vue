<template>
    <div class="simple-radio">
        <div></div>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';

export default {
    name: "SimpleRadioPlayer",
    props: {
        element: null,
    },
    computed: {
        ...mapGetters({
            audio: 'radio/audio',
            volume: 'radio/volume',
            isPlaying: 'radio/isPlaying',
            duration: 'radio/duration'
        })
    },
    methods: {
        ...mapMutations({
            create: 'radio/createElement',
            delete: 'radio/deleteElement',
            play: 'radio/playPause',
            changeVolume: 'radio/changeVolume',
        }),
        // startPlay: function() {
        //     this.play();
        //     if(this.dancer){
        //         if(this.isPlaying) {
        //             this.$refs['dancer'].play();
        //         } else this.$refs['dancer'].pause();
        //     }
        // },
    },
    mounted: function() {
        this.create(this.$parent.$el);
    }
}
</script>

<style lang="less">
    @import "../../../less/vars.less";
    .simple-radio {
        .simple-radio__play-button {
            font-size: 1.5em;
            border-radius: 1em;
        }
    }
</style>