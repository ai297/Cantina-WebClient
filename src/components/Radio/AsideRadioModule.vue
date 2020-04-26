<template>
    <aside-base caption="Радио (название)">
        <div>
            <div id="radio-image" :class="{playing: isPlaying, dancer: dancer}">
                <video v-if="dancer" src="../../assets/dancer.mp4" ref="dancer" loop />
            </div>
            <div id="radio-module" :class="{playing: isPlaying, dancer: dancer}">
                <svg version="1.1" viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <radialGradient id="playButtonOnGradient">
                            <stop offset="0%" />
                            <stop offset="100%" />
                        </radialGradient>
                        <radialGradient id="playButtonHoverGradient">
                            <stop offset="0%" />
                            <stop offset="100%" />
                        </radialGradient>
                        <radialGradient id="playButtonOffGradient">
                            <stop offset="0%" />
                            <stop offset="100%" />
                        </radialGradient>
                        <linearGradient id="volumeGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" />
                            <stop offset="100%" />
                        </linearGradient>
                    </defs>
                    <path fill="red" d="m48 30-12 13h-19l-16 16v42l16 16h19l12 13h204l12-13h19l16-16v-42l-16-16h-19l-12-13z" class="back" />
                    <path d="m49 35-13 13v64l13 13h201l13-13v-64l-13-13z" class="borders" />
                    <path d="m52 38-12 12v61l12 12h195l12-12v-61l-12-12z" class="blue-back" />
                    <path d="m18 47-13 13v39l13 13h264l13-13v-39l-13-13z" class="borders" />
                    
                    <rect x="21" y="52" width="258" height="56" rx="1.7e-15" class="volume" />
                    <rect x="21" y="52" width="258" :height="56 - volume * 56 / 100" rx="1.7e-15" class="back" />
                    
                    <path d="m21 52-12 12v33l12 12h258l12-12v-33l-12-12h-251zm28 2.4h202c0.97 2.8 1.8 5.7 2.4 8.6h-207c0.66-2.9 1.5-5.8 2.5-8.6zm-2.8
                    10h207c0.63 3.1 1.1 6.2 1.3 9.4h-210c0.26-3.2 0.71-6.3 1.3-9.4zm-1.5 11h210c0.094 1.6 0.15 3.1 0.15 4.7-5e-3 1.6-0.062 3.1-0.16
                    4.7h-210c-0.094-1.6-0.15-3.1-0.15-4.7 0.0053-1.6 0.062-3.1 0.16-4.7zm0.1 11h210c-0.26 3.2-0.71 6.3-1.3 9.4h-207c-0.63-3.1-1.1-6.2-1.3-9.4zm1.7
                    11h207c-0.66 2.9-1.5 5.8-2.5 8.6h-202c-0.97-2.8-1.8-5.7-2.4-8.6z" class="back" />
                    <ellipse cx="150" cy="80" rx="80" ry="80" class="back" />
                    <path d="m107 80a43 43 0 0 0 43 43 43 43 0 0 0 43-43 43 43 0 0 0-43-43 43 43 0 0 0-43 43zm3.8 0a39 39 0 0 1 12-28l3.6 3.6a34 34 0 0 1 24-10 34
                    34 0 0 1 24 10l3.6-3.6a39 39 0 0 1 12 28 39 39 0 0 1-12 28l-3.6-3.6a34 34 0 0 1-24 10 34 34 0 0 1-24-10l-3.6 3.6a39 39 0 0 1-12-28z" class="circle-border" />
                    <path d="m80 80a70 70 0 0 0 9.4 35l3.7-2.2a66 66 0 0 0 57 33 66 66 0 0 0 57-33l3.7 2.2a70 70 0 0 0 9.4-35 70 70 0 0 0-9.4-35l-3.7 2.2a66 66 0
                    0 0-57-33 66 66 0 0 0-57 33l-3.7-2.2a70 70 0 0 0-9.4 35zm8.2 0a62 62 0 0 1 62-62 62 62 0 0 1 62 62 62 62 0 0 1-62 62 62 62 0 0 1-62-62z" class="circle-border" />

                    <path d="m135 135a57 57 90 0 0 0.76 0.18l2.4-8.9a48 48 0 0 1-0.76-0.18 48 48 0 0 1-0.74-0.24l-2.4 8.9a57 57 90 0 0 0.74 0.24zm14 1.9a57 57 90 0 0 1.6 0.036l3.7e-4
                    -9.3a48 48 0 0 1-1.6-0.028zm-27-7.3 4.6-8a48 48 0 0 1-1.4-0.77l-4.6 8a57 57 90 0 0 1.4 0.76zm-12-8.9 6.5-6.5a48 48 0 0 1-1.1-1.1l-6.5 6.5a57 57 90 0 0 1.1 1.1zm54
                    14a57 57 90 0 0 1.5-0.4l-2.4-8.9a48 48 0 0 1-1.5 0.4zm14-5.4a57 57 90 0 0 1.3-0.83l-4.6-8a48 48 0 0 1-1.3 0.82zm-77-21 8-4.6a48 48 0 0 1-0.82-1.3l-8 4.6a57 57 90
                    0 0 0.83 1.3zm-5.9-14 8.9-2.4a48 48 0 0 1-0.4-1.5l-8.9 2.4a57 57 90 0 0 0.4 1.5zm95 25a57 57 90 0 0 1.1-1.1l-6.5-6.5a48 48 0 0 1-1.1 1.1zm-97-40 9.3 3.9e-4a48 48
                    0 0 1 0.028-1.6l-9.3 1.3e-4a57 57 90 0 0-0.036 1.6zm106 28a57 57 90 0 0 0.76-1.4l-8-4.6a48 48 0 0 1-0.77 1.4zm5.9-14a57 57 90 0 0 0.24-0.74 57 57 90 0 0
                    0.18-0.76l-8.9-2.4a48 48 0 0 1-0.18 0.76 48 48 0 0 1-0.24 0.74zm-101-27a48 48 0 0 1 0.18-0.76 48 48 0 0 1 0.24-0.74l-8.9-2.4a57 57 90 0 0-0.24 0.74 57 57 90 0
                    0-0.18 0.76zm4.6-12a48 48 0 0 1 0.77-1.4l-8-4.6a57 57 90 0 0-0.76 1.4zm90 24 9.3-1.1e-4a57 57 90 0 0 0.036-1.6l-9.3-3.7e-4a48 48 0 0 1-0.028 1.6zm-1.4-12 8.9-2.4a57
                    57 90 0 0-0.4-1.5l-8.9 2.4a48 48 0 0 1 0.4 1.5zm-81-22a48 48 0 0 1 1.1-1.1l-6.5-6.5a57 57 90 0 0-1.1 1.1zm9.8-7.7a48 48 0 0 1 1.3-0.82l-4.6-8a57 57 90 0 0-1.3
                    0.83zm66 18 8-4.6a57 57 90 0 0-0.83-1.3l-8 4.6a48 48 0 0 1 0.82 1.3zm-7.5-10 6.5-6.5a57 57 90 0 0-1.1-1.1l-6.5 6.5a48 48 0 0 1 1.1 1.1zm-47-13a48 48 0 0 1
                    1.5-0.4l-2.4-8.9a57 57 90 0 0-1.5 0.4zm38 4.9 4.6-8a57 57 90 0 0-1.4-0.76l-4.6 8a48 48 0 0 1 1.4 0.77zm-25-6.8a48 48 0 0 1 1.6 0.028l-1.2e-4 -9.2a57 57 90 0
                    0-1.6-0.036zm14 1.8 2.4-8.9a57 57 90 0 0-0.74-0.24 57 57 90 0 0-0.76-0.18l-2.4 8.9a48 48 0 0 1 0.76 0.18 48 48 0 0 1 0.74 0.24z" class="rotor1" />                
                    <path d="m150 5.5c-21 0-40 8.6-53 22l1.1 1.1c13-14 32-22 52-22 20 0 38 7.9 51 21l1.1-1.1c-13-13-32-21-52-21zm72 55-1.5 0.4c1.7 6.1 2.5 13 2.5 19 0 6.6-0.89
                    13-2.5 19l1.5 0.4c1.7-6.2 2.6-13 2.6-20s-0.91-13-2.6-20zm-144 0.53c-1.6 6.1-2.5 12-2.5 19 0 13 3.5 26 9.7 37l1.3-0.78c-6.1-11-9.5-23-9.5-36 0-6.4 0.84-13
                    2.4-19zm123 71c-13 13-31 21-51 21-14 0-26-3.7-37-10l-0.78 1.3c11 6.6 24 10 38 10 20 0 39-8.1 52-21z" class="rotor2" />

                    <g class="play-button" @click="startPlay">
                        <ellipse cx="150" cy="80" rx="30" ry="30" />
                        <path v-show="isPlaying" d="m142 68h17c1.8 0 3.3 1.5 3.3 3.3v17c0 1.8-1.5 3.3-3.3 3.3h-17c-1.8 0-3.3-1.5-3.3-3.3v-17c0-1.8 1.5-3.3 3.3-3.3z" />
                        <path v-show="!isPlaying" d="m166 80c0 3-23 16-26 15-2.6-1.5-2.6-28 0-30 2.6-1.5 26 12 26 15z" />
                    </g>
                    <g id="radio-volume-minus" class="volume-buttons" @click="changeVolume(volume - 20)">
                        <path d="m23 55-10 10v30l10 10h22c-2.7-8.1-4.1-17-4.1-25 0.021-8.5 1.4-17 4.1-25z" class="back" />
                        <path d="m21 81v-2h12v2z"/>
                    </g>
                    <g id="radio-volume-plus" class="volume-buttons" @click="changeVolume(volume + 20)">
                        <path d="m256 55c2.7 8.1 4.1 17 4.1 25-0.021 8.5-1.4 17-4.1 25h22l10-10v-30l-10-10z" class="back" />
                        <path d="m273 86v-4.8h-4.8v-2h4.8v-4.8h2v4.8h4.8v2h-4.8v4.8z"/>
                    </g>
                    <g class="extBottomButtons">
                        <path d="m34 128 16 16h40l1.6 1.6h-66l-18-18z" class="lefttButton" />
                        <path d="m266 128-16 16h-40l-1.6 1.6h66l18-18z" class="rightButton" @click="showDancer" />
                    </g>
                </svg>
            </div>
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
    data: function() {
        return {
            dancer: false,
        }
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
        startPlay: function() {
            this.play();
            if(this.dancer){
                if(this.isPlaying) {
                    this.$refs['dancer'].play();
                } else this.$refs['dancer'].pause();
            }
        },
        showDancer: function() {
            this.dancer = !this.dancer;
            if(this.dancer && this.isPlaying) {
                setTimeout(() => this.$refs['dancer'].play(), 200);
            }
        }
    },
    mounted: function() {
        let node = document.getElementById("chat");
        this.create(node);
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";
    #radio-image {
        position: relative;
        display: block;
        z-index: -1;
        overflow: hidden;
        width: 75%;
        height: 0vw;
        min-height: 0rem;
        max-height: 15rem;
        border: @base-padding solid @body-background-color;
        border-radius: 100% ~"/" 60%;
        opacity: 1;
        transition: all .7s;
        background: linear-gradient(to top, mix(@blue, rgba(0,0,0,0), 70%), rgba(0,0,0,0) 50%, rgba(0,0,0,0));
        margin: 0 auto;

        &.dancer {
            height: 16vw;
            min-height: 13rem;
            &.playing video {
                opacity: .65;
            }
        }

        video {
            width: 100%;
            opacity: 0;
            transition: all 1.5s;
        }

    }

    #radio-module {
        margin-top: 0;
        position: relative;
        z-index: 1;
        display: inline-block;
        width: 95%;
        transition: all .5s;
        &.dancer {
            margin-top: -22%;
        }
        svg {
            display: block;
            width: 100%;
            .borders {
                fill: mix(@blue, @body-background-color, 70%);
                stroke: @body-background-color;
                stroke-width: 1.5px;
            }
            .circle-border {
                fill: @grey;
                opacity: .5;
                transition: all .7s;
            }
            .back {
                fill: @body-background-color;
            }
            .blue-back {
                fill: @dark-blue;
            }
            .volume {
                fill: url(#volumeGradient);
            }
            .play-button {
                cursor: pointer;
                opacity: .7;
                transition: opacity .5s;
                ellipse {
                    fill: url(#playButtonOffGradient);
                }
                path {
                    fill: @gold;
                    stroke: none;
                    opacity: .5;
                    transition: opacity .5s;
                }
                &:hover {
                    opacity: 1;
                    path {
                        fill: @green;
                        opacity: .9;
                    }
                    ellipse {
                        fill: url(#playButtonHoverGradient);
                    }
                }
            }
            .rotor1 {
                fill: @blue;
                opacity: .5;
                transform-origin: 50% 50%;
                transition: all 1s;
            }
            .rotor2 {
                fill: @blue;
                opacity: .5;
                transform-origin: 50% 50%;
                transition: all 1s;
            }
            .volume-buttons {
                cursor: pointer;
                path {
                    fill: @blue;
                }
                .back {
                    fill: @blue;
                    opacity: .5;
                    transition: all .7s;
                }
                &:hover {
                    path {
                        fill: @body-background-color;
                    }
                    .back {
                        fill: @blue;
                        opacity: 1;
                    }
                }
            }

            .extBottomButtons {
                fill: @grey;
                path {
                    cursor: pointer;
                    opacity: .5;
                    transition: all .7s;
                    &:hover {
                        opacity: 1;
                    }
                }
                .lefttButton {
                    display: none;
                }
            }


            #playButtonOnGradient {
                stop:first-child {
                    stop-color: @red;
                }
                stop:last-child {
                    stop-color: @body-background-color;
                }
            }
            #playButtonHoverGradient {
                stop:first-child {
                    stop-color: @green;
                }
                stop:last-child {
                    stop-color: @body-background-color;
                }
            }
            #playButtonOffGradient {
                stop:first-child {
                    stop-color: @gold;
                }
                stop:last-child {
                    stop-color: @body-background-color;
                }
            }
            #volumeGradient {
                stop:first-child {
                    stop-color: @green;
                    stop-opacity: 1;
                }
                stop:last-child {
                    stop-color: @body-background-color;
                    stop-opacity: .2;
                }
            }
        }
        &.playing {
            svg {
                .circle-border {
                    fill: @blue;
                    opacity: 1;
                }
                .borders {
                    fill: @blue;
                }
                .play-button:not(:hover) {
                    ellipse {
                        fill: url(#playButtonOnGradient);
                    }
                    path {
                        fill: @red;
                    }
                }
                .rotor1 {
                    opacity: 1;
                    animation: rotation-speed1 60s linear infinite;
                    fill: @dark-gold;
                }
                .rotor2 {
                    opacity: 1;
                    animation: rotation-speed1 30s linear infinite reverse;
                    fill: @dark-gold;
                }
                .extBottomButtons {
                    fill: @red;
                }
            }
        }

    }
    @keyframes rotation-speed1 {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>