<template>
    <div class="flat-field" :class="{withvalue:(value != ''), selected: isSelected}">
        <input :type="type" :maxlength="maxlength" :value="value" v-on="inputListener" @focus="isSelected = true" @blur="isSelected = false" ref="input" />
        <div class="extender"><slot /></div>
        <div class="placeholder" v-show="isShowPlaceholder" v-html="placeholder"></div>
    </div>
</template>

<script>
export default {
    name: 'FlatField',
    props: {
        value: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'text',
        },
        maxlength: {
            type: String,
            default: '32',
        },
        placeholder: {
            type: String,
            default: '',
        },
        autofocus: {
            type: Boolean,
            default: false,
        }
    },
    data: function() {
        return {
            isSelected: false,
        }
    },
    computed: {
        inputListener: function(){
            var vm = this;
            return Object.assign({},
                this.$listeners,
                {
                    input: function(event){
                        vm.$emit('input', event.target.value);
                    }
                }
            )
        },
        isShowPlaceholder: function() {
            return this.value == '' && !this.isSelected;
        }
    },
    mounted: function() {
        if(this.autofocus) this.$refs['input'].focus();
    }
}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";
    @doublePadding: @base-padding * 2;
    .flat-field {
        display: flex;
        flex-direction: row;
        position: relative;
        overflow: hidden;
        margin: .4em;
        font-size: 1em;
        font-family: @button-font;
        background: none;
        border: @ui-border-width solid @gold;
        border-radius: .4em;
        transition: all .5s;
        color: inherit;
        input {
            display: block;
            z-index: 1;
            width: 100%;
            box-sizing: border-box;
            padding: @base-padding @doublePadding;
            font-size: inherit;
            font-family: inherit;
            text-align: inherit;
            background: none;
            color: inherit;
            border: none;
            &:focus {
                color: @gold;
            }
        }
        .placeholder {
            position: absolute;
            z-index: 0;
            width: 100%;
            top: @ui-border-width; left: 0;
            margin: 0;
            pointer-events: none;
            border: none;
            line-height: calc(@doublePadding + 1em);
            color: inherit;
        }
        .extender {
            width: auto;
            float: right;
            margin: 0;
            padding: @base-padding;
            padding-right: @doublePadding;
            font-size: inherit;
            font-family: inherit;
            color: inherit;
            line-height: 1em;
        }
        &.withvalue {
            color: @blue;
        }
        &.errorField {
            border-left-width: @base-padding*2;
            border-color: @red;
            border-radius: 0;
            padding-left: @base-padding;
            background-color: @dark-red;
        }
        &.selected {
            border-color: @green;
        }
    }
</style>