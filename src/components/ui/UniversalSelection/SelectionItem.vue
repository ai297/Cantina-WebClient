<script>
export default {
    name: "SelectionItem",
    props: {
        selected: {
            type: Boolean,
            default: false
        },
        value: {
            type: Number,
            default: 0,
        }
    },
    render: function(createElement) {
        let self = this;
        return createElement("div", {
            class: { 
                'universal-selection__selection-item': true,
                'selected': self.selected,
            },
            on: {
                click: function() {
                    self.$emit('select', self.value);
                }
            }
        }, this.$slots.default)
    }
}
</script>

<style lang="less">
    .universal-selection__selection-item {
        cursor: pointer;
    }
</style>