<template>
    <aside-base caption="Галактическое радио">
        <div id="radio-module">
            <div>{{volume}} / {{duration}}</div>
            <flat-button @click="changeVolume(volume + 5)">+</flat-button> <flat-button @click="play"> {{(isPlaying)?'■':'►'}} </flat-button> <flat-button @click="changeVolume(volume - 5)">-</flat-button>
        </div>
    </aside-base>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
import asideBase from '../ChatPage/ChatAsideBase.vue';

export default {
    name: "AsideRadio",
    components: {
        asideBase,
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
    },
    mounted: function() {
        //let node = document.getElementById("radio-module").parentNode.parentNode;
        this.create();
    },
}
</script>