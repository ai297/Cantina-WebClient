<template>
    <div class="flat-selection" :tabindex="tabindex" ref="flatSelect" :class="{ openUp }" @click="open" @blur="isOpen = false" @keypress.enter="open">
        <div class="selected" ref="selectedItem">{{placeholder}}</div>
        <div class="arrow-icon">▸</div>
        <div class="selection-items" ref="selectItems" v-show="isOpen">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: "MySelect",
    props: {
        tabindex: {
            type: Number,
            required: false,
            default: 0,
        },
        selected: {
            type: Number,
            required: false,
            default: -1,
        },
        placeholder: {
            type: String,
            required: false,
            default: '',
        }
    },
    model: {
        prop: 'selected',
        event: 'select'
    },
    watch: {
        selected: function(val) {
            this.select(val);
        }
    },
    data: function() {
        return {
            openUp: false,
            isOpen: false,
            selectedOptionIndex: 0,
            childNodes: NodeList,
        }
    },
    methods: {
        open: function() {
            this.openUp = (window.innerHeight - this.$refs.flatSelect.getBoundingClientRect().top + this.$refs.flatSelect.offsetHeight)
            < ( this.$refs.selectItems.offsetHeight + this.$refs.flatSelect.offsetHeight);
            this.isOpen = !this.isOpen;
        },
        select: function(index) {
            this.selectedOptionIndex = index;
            this.$refs.selectedItem.innerHTML = '';
            this.$refs.selectedItem.appendChild(this.childNodes[index].cloneNode(true));
        },
        setEventHandler: function() {
            this.childNodes = this.$refs.selectItems.childNodes;
            for(let i = 0; i < this.childNodes.length; i++) {
                let node = this.childNodes[i];
                node.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.select(i);
                    this.$emit('select', i);
                });
            }
            if(this.selected >= 0 && this.selected < this.childNodes.length && this.placeholder === '') this.select(this.selected);
            else if(this.placeholder === '') this.select(0);
        }
    },
    mounted: function() {
        this.setEventHandler();
    }
}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";
    @double-padding: @base-padding * 2;

    .flat-selection {
        display: flex;
        flex-direction: row;
        position: relative;
        min-height: calc(1em + @double-padding);
        margin: .4em;
        font-size: 1em;
        font-family: @button-font;
        background: none;
        border: @ui-border-width solid @gold;
        border-radius: .4em;
        box-sizing: border-box;
        cursor: default;
        outline: none;
        align-items: center;
        justify-content: center;
        &:focus {
            border-color: @green;
            .selection-items {
                display: block;
            }
            .selected {
                & > * {
                    color: @gold;
                }
            }
        }
        .selected {
            & > * {
                font-family: @button-font;
                font-family: inherit;
                font-size: inherit;
                color: @blue;
            }
            font-family: inherit;
            font-size: inherit;
            color: inherit;
            width: calc(100% - 1em);
        }
        .arrow-icon {
            font-size: inherit;
            width: 1em;
            padding: @base-padding / 2 @base-padding;
            cursor: pointer;
            color: @gold;
            text-align: center;
        }
        .selection-items {
            position: absolute;
            z-index: 100;
            left: calc(0 - @ui-border-width);
            width: 100%;
            border: inherit;
            border-radius: inherit;
            cursor: pointer;
            font: inherit;
            background-color: @dark-grey;
            overflow: hidden;
            & > * {
                padding: @base-padding / 2 @base-padding;
                &:hover {
                    background-color: @red;
                    color: @dark-grey;
                }
            }
        }
        &.openUp {
            &:focus {
                .arrow-icon {
                    transform: rotate(-90deg);
                }
            }
            .selection-items {
                bottom: 100%;
            }
        }
        &:not(.openUp) {
            &:focus {
                .arrow-icon {
                    transform: rotate(90deg);
                }
            }
            .selection-items {
                top: 100%;
            }
        }
    }
</style>