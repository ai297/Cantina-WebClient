<script>
import {mapGetters, mapMutations} from 'vuex';

export default {
    name: "RadioVizualizer",
    props: {
        size: {
            type: Number,
            default: 32
        }
    },
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
                this.setFFTSize(this.size);
                this.bufferLength = this.analyser.frequencyBinCount;
                this.dataArray = new Uint8Array(this.bufferLength);
                return true;
            }
        },
        renderFrame: function() {
            if(this.isPlaying && this.isActive) requestAnimationFrame(this.renderFrame);
            this.analyser.getByteFrequencyData(this.dataArray);             // получаем аудиоданные по частотам
            this.ctx.clearRect(0,0,this.cWidth, this.cHeight);              // очищаем canvas
            let steps = 9;

            let barWidth = (this.cWidth / 2) / (this.bufferLength - 4);           // ширина столбца
            let x = 0, barHeight = 0, opacity = 0, val = 0, step = 0;

            // рисуем столбики визуализации
            for(let i = 1; i < this.bufferLength-3; i++) {
                val = this.dataArray[i] / 255;
                step = Math.floor(val * steps) / steps;
                barHeight = (val * (this.cHeight - 1 - this.cHeight / 4) + 1) + val * this.cHeight / 4;
                opacity = (step * 0.6 + 0.2).toFixed(2);

                this.ctx.fillStyle = `rgba(${45 + step * 145}, ${100 - 100 * step}, ${180 - 180 * step}, ${opacity})`;
                this.ctx.fillRect((this.cWidth / 2 - barWidth / 2) + x, this.cHeight + (val - 1) * this.cHeight / 4, barWidth-2, -barHeight);
                if(x !== 0) this.ctx.fillRect((this.cWidth / 2 - barWidth / 2) - x, this.cHeight + (val - 1) * this.cHeight / 4, barWidth-2, -barHeight);
                x += barWidth;
                this.ctx.clearRect(0,this.cHeight - this.cHeight / 4, this.cWidth, 2);
            }
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
        return createElement("div", { staticClass: "radio-vizualizer" }, [
            createElement("canvas", { ref: "vizualizer", })
        ]);
    }
}
</script>
<style lang="less">
    @import "../../../less/vars.less";
    .radio-vizualizer {
        display: block;
        position: relative;
        z-index: -1;
        pointer-events: none;

        &::before {
            display: block;
            content: "";
            width: 100%;
            padding-top: 30%;
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