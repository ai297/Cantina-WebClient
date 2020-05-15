<script>
import {mapGetters, mapMutations} from 'vuex';

export default {
    name: "SpaceAudioVizualizer",
    data: function() {
        return {
            bufferLength: 0,
            dataArray: null,
            isActive: false,

            cWidth: 0,
            cHeight: 0,
            ctx: null,

        }
    },
    computed: {
        ...mapGetters({
            isPlaying: 'radio/isPlaying',
            analyser: 'radio/analyser',
        })
    },
    methods: {
        ...mapMutations({
            setFFTSize: 'radio/analyser_fft',
        }),
        connectSource: function() {
            if(this.analyser === null) return false;
            else {
                this.setFFTSize(1024);
                this.bufferLength = this.analyser.frequencyBinCount;
                this.dataArray = new Uint8Array(this.bufferLength);
                return true;
            }
        },
        renderFrame: function() {
            if(this.isPlaying && this.isActive) requestAnimationFrame(this.renderFrame);
            this.analyser.getByteTimeDomainData(this.dataArray);           // получаем данные о форме аудио-волны
            
            this.ctx.clearRect(0,0,this.cWidth, this.cHeight);              // очищаем canvas
            
            let step = this.cWidth / this.bufferLength;
            let x = 0, y= 0, val = 0;
            
            var gradient = this.ctx.createLinearGradient(0,0, this.cWidth,0);

            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(.5, '#75ADFF');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');

            // рисуем "волну"
            this.ctx.beginPath();

            for(let i = 0; i < this.bufferLength; i++) {
                val = this.dataArray[i] / 255;
                x = i * step;
                y = val * this.cHeight;
                if(i != 0) this.ctx.lineTo(x, y);
                else this.ctx.moveTo(x, y);
            }
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
    },
    watch: {
        isPlaying: function(val) {
            if(val && this.connectSource()) {
                this.renderFrame();
            }
        }
    },
    mounted: function() {
        let cRect = this.$refs['vizualizer'].getBoundingClientRect();
        this.cWidth = Math.floor(cRect.width);
        this.cHeight = Math.floor(cRect.height);
        this.$refs['vizualizer'].width = this.cWidth;
        this.$refs['vizualizer'].height = this.cHeight;
        this.ctx = this.$refs['vizualizer'].getContext("2d");
    },
    activated: function() {
        this.isActive = true;
        if(this.isPlaying && this.connectSource()) {
            this.renderFrame();
        }
    },
    deactivated: function() {
        this.isActive = false;
    },
    render: function(createElement) {
        return createElement("div", { staticClass: "space-vizualizer" }, [
            createElement("canvas", { ref: "vizualizer", })
        ]);
    }
}
</script>
<style lang="less">
    @import "../../../less/vars.less";
    .space-vizualizer {
        display: block;
        position: relative;
        z-index: -1;
        pointer-events: none;

        &::before {
            display: block;
            content: "";
            width: 100%;
            padding-top: 25%;
        }
        & > canvas {
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }
    }
</style>