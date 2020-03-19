<template>
    <div class="flat-selection" :tabindex="tabindex" @blur="isOpen = false" @click.prevent="showOptions" @keypress.enter="showOptions" ref="fs">
        <div class="arrow-icon"><svg version="1.1" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" :class="{'open-up': openUp}">
            <path d="m9 8c-0.28 0.47-7.7 0.47-8 0-0.28-0.47 3.4-6.7 4-6.7 0.56 0 4.3 6.2 4 6.7z" fill="currentColor" />
        </svg></div>
        <div class="selected">{{value}}</div>
        <div class="selection-items" :class="{'open-up': openUp}" v-show="isOpen">
            <div class="selection-item" v-for="(option, index) of options" :key="index" @click="select(index)" v-html="option"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "FlatSelection",
    props: {
        tabindex: {
            type: Number,
            required: false,
            default: 0
        },
        options: {
            type: Array,
            required: true,
        },
        placeholder: {
            type: String,
            default: '',
        },
        selected: {
            type: Number,
            default: -1,
        }
    },
    model: {
        prop: 'selected',
        event: 'select'
    },
    data: function(){
        return  {
            selectedIndex: -1,
            isOpen: false,
            openUp: false,
        }
    },
    computed: {
        value: function() {
            if(this.selectedIndex >= 0) return this.options[this.selectedIndex];
            else if(this.placeholder != '') return this.placeholder;
            else return this.options[0];
        }
    },
    watch: {
        selected: function(val) {
            this.select(val);
        }
    },
    methods: {
        select: function(index){
            this.selectedIndex = index;
            this.$emit('select', index);
        },
        showOptions: function() {
            this.openUp = window.innerHeight * 2 / 3 < this.$refs.fs.getBoundingClientRect().top;
            this.isOpen = !this.isOpen;
        },
    }
}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";

    .flat-selection {
        display: block;
        position: relative;
        max-width: 100%;
        margin: .4em;
        padding-right: 1em;
        font-size: @input-fontsize;
        font-family: @button-font;
        background: none;
        border: @ui-border-width solid @gold;
        border-radius: .4em;
        box-sizing: border-box;
        transition: all .5s;
        cursor: default;
        &:focus {
            outline: none;
            color: @gold;
            border-color: @blue;
            background-color: @dark-grey;
            .arrow-icon {
                color: @blue;
                svg:not(.open-up) {
                    transform: rotate(180deg);
                }
                svg.open-up {
                    transform: rotate(0deg);
                }
            }
        }
        .selected {
            padding: @base-padding;
            font-family: inherit;
            font-size: inherit;
            color: inherit;
            white-space: nowrap;
        }
        .arrow-icon {
            display: block;
            position: absolute;
            top: 0;
            right: 0;
            font-size: inherit;
            line-height: 1em;
            width: 1em;
            height: 1em;
            padding: @base-padding;
            cursor: pointer;
            color: @gold;
            svg {
                width: .6em;
                height: .6em;
                transform: rotate(90deg);
                transition: all .5s;
            }
        }
        .selection-items {
            position: absolute;
            z-index: 100;
            left: 0;
            width: 100%;
            border: inherit;
            border-radius: inherit;
            cursor: pointer;
            font: inherit;
            background-color: inherit;
            overflow: hidden;
            &:not(.open-up) {
                top: 100%;
            }
            &.open-up {
                bottom: 100%;
            }
            .selection-item {
                padding: @base-padding;
                border-radius: inherit;
                background-color: inherit;
                &:hover {
                    background-color: @red;
                    font-weight: bold;
                }
            }
        }
    }
</style>