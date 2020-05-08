<template>
    <div class="modal-wrapper" @mousemove="mouseMove">
        <transition name='enterForm-anim' :duration="{enter: 1500, leave: 800}" mode="out-in" appear>
            <router-view class="flyingWindow" :style="getFlyingWindowStyleString" />
        </transition>
    </div>
</template>

<script>
export default {
    name: "LoginPage",
    data: function(){
        return {
            mouseXOffset: 0,
            mouseYOffset: 0,
        }
    },
    computed: {
        getFlyingWindowStyleString: function(){
            return {
                transform: 'translate('+this.mouseXOffset+'px, '+this.mouseYOffset+'px)'
            };
        },
    },
    methods: {
        mouseMove: function(event) {
            let maxX = document.documentElement.clientWidth / 2;
            let maxY = document.documentElement.clientHeight / 2;
            let mouseX = event.clientX - maxX;
            let mouseY = event.clientY - maxY;

            this.mouseXOffset = -mouseX / 25;
            this.mouseYOffset = -mouseY / 25;
        },
    },
    mounted: function(){
        this.showLogo = true;
    },
}
</script>

<style lang="less">
    @import "../../less/vars.less";
    
    .flyingWindow {
        transition: transform .5s ease-out;
        transform-origin: 50% 50%;
        position: relative;
    }
</style>