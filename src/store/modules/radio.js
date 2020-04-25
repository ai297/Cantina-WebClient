export default {
    namespaced: true,
    state: {
        player: null,
        streams: {
            mp3: "http://136.243.156.30:1701/stream/2/"
        },
        volume: 50,
        play: false,
        durattion: '--.--',
    },
    getters: {
        audio: state => state.player,
        volume: state => state.volume,
        isPlaying: state => state.play,
        duration: state => state.durattion,
    },
    mutations: {
        createElement: (state) => {
            if(state.player === null) {
                state.player = new Audio();
                state.player.setAttribute("controls", false);
                state.player.setAttribute("src", state.streams.mp3);
                state.player.addEventListener("timeupdate", function() {
                    let s = parseInt(state.player.currentTime % 60);
                    s = (s < 10)? '0'+s : s;
                    let m = parseInt((state.player.currentTime / 60) % 60);
                    m = (m < 10)? '0'+m : m;
                    state.durattion = `${m}.${s}`;
                }, false);
            }
        },
        deleteElement: state => {
            state.player.remove();
            state.player = null;
        },
        playPause: state => {
            if(state.player !== null) {
                state.play = !state.play;
                if(state.play){
                    state.player.volume =  parseFloat(state.volume / 100);
                    state.player.play();
                } else {
                    state.player.pause();
                }
            }
        },
        changeVolume: (state, volume) => {
            if(volume > 100) state.volume = 100;
            else if(volume < 0) state.volume = 0;
            else state.volume = volume;
            if(state.player !== null) state.player.volume = parseFloat(state.volume / 100);
        }
    },
}