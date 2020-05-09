
export default {
    namespaced: true,
    state: {
        player: null,
        streams: {
            mp3: "http://136.243.156.30:1701/stream/2/"
        },
        volume: 60,
        durattion: '--.--',
        isPlaying: false,
    },
    getters: {
        audio: state => state.player,
        volume: state => state.volume,
        isPlaying: state => state.isPlaying,
        duration: state => state.durattion,
    },
    mutations: {
        createElement: (state, node) => {
            if(state.player === null) {
                state.player = new Audio();
                state.player.addEventListener("timeupdate", function() {
                    let s = parseInt(state.player.currentTime % 60);
                    s = (s < 10)? '0'+s : s;
                    let m = parseInt((state.player.currentTime / 60) % 60);
                    m = (m < 10)? '0'+m : m;
                    state.durattion = `${m}.${s}`;
                }, false);
                state.player.load();
            }
            node.appendChild(state.player);
            state.isPlaying = !state.player.paused;
        },
        deleteElement: state => {
            state.player.remove();
            state.player = null;
        },
        playPause: state => {
            if(state.player !== null) {
                if(!state.isPlaying){
                    state.player.volume =  parseFloat(state.volume / 100);
                    state.player.setAttribute("src", state.streams.mp3);
                    state.player.load();
                    state.player.play();
                    state.isPlaying = !state.player.paused;
                } else {
                    state.player.pause();
                    state.isPlaying = !state.player.paused;
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