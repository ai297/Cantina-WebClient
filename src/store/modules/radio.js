import axios from 'axios';

export default {
    namespaced: true,
    state: {
        player: null,
        streams: {
            mp3: "https://myradio24.org/cantina"
        },
        volume: 60,
        isPlaying: false,

        analyser: {
            audioCtx: null,
            analyser: null,
        },

        infoUpdateTimer: null,
        dj: '',
        track: '',
        listeners: 0,
    },
    getters: {
        audio: state => state.player,
        volume: state => state.volume,
        isPlaying: state => state.isPlaying,
        dj: state => state.dj,
        track: state => state.track,
        listeners: state => state.listeners,
        analyser: state => state.analyser.analyser,
    },
    mutations: {
        createElement: (state) => {
            if(state.player === null) {
                state.player = new Audio();
                state.player.crossOrigin = 'anonymous';
                state.player.load();
            }
            document.body.appendChild(state.player);
            state.isPlaying = !state.player.paused;
        },
        deleteElement: state => {
            state.player.remove();
            state.player = null;
        },
        create_analyser: state => {
            if(state.analyser.audioCtx === null) {
                state.analyser.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                state.analyser.analyser = state.analyser.audioCtx.createAnalyser();
                let src = state.analyser.audioCtx.createMediaElementSource(state.player);
                src.connect(state.analyser.analyser);
                state.analyser.analyser.connect(state.analyser.audioCtx.destination);
            }
        },
        analyser_fft: (state, size) => {
            if(state.analyser.analyser !== null) state.analyser.analyser.fftSize = size;
        },
        changeVolume: (state, volume) => {
            if(volume > 100) state.volume = 100;
            else if(volume < 0) state.volume = 0;
            else state.volume = volume;
            if(state.player !== null) state.player.volume = parseFloat(state.volume / 100);
        },
        play: state => {
            state.player.volume =  parseFloat(state.volume / 100);
            state.player.setAttribute("src", state.streams.mp3);
            state.player.load();
            state.player.play();
            state.isPlaying = !state.player.paused;
        },
        stop: state => {
            state.player.pause();
            state.isPlaying = !state.player.paused;
            if(state.infoUpdateTimer !== null) clearTimeout(state.infoUpdateTimer);
            state.infoUpdateTimer = null;
        },
        updateData: (state, {dj, track, timer, online}) => {
            state.dj = dj;
            state.track = track;
            state.infoUpdateTimer = timer;
            state.listeners = online;
        }
    },
    actions: {
        playPause: ({commit, dispatch, state}) => {
            if(state.player !== null) {
                if(!state.isPlaying) {
                    commit('create_analyser');
                    commit('play');
                    dispatch('updateRadioData');
                }
                else commit('stop');
            }
        },
        updateRadioData: ({commit, dispatch}) => {
            axios.get('proxy?url=http://myradio24.com/users/cantina/status.json&t=10')
            .then((response) => {
                let timer = setTimeout(() => dispatch('updateRadioData'), 15000);
                commit('updateData', {
                    dj: response.data.djname,
                    track: response.data.song,
                    timer: timer,
                    online: response.data.listeners
                });
            });
        }
    }
}