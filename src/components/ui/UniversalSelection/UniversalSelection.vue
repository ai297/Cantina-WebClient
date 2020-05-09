<script>
// <template>
//     <div class="flat-selection" :tabindex="tabindex" ref="flatSelect" :class="{ openUp }" @click="open" @blur="isOpen = false" @keypress.enter="open">
//         <div class="selected" ref="selectedItem">{{placeholder}}</div>
//         <div class="arrow-icon">▸</div>
//         <div class="selection-items" ref="selectItems" v-show="isOpen">
//             <slot />
//         </div>
//     </div>
// </template>

export default {
    name: "UniversalSelection",
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
    render: function(createElement) {
        let self = this;
        return createElement("div", {
            class: {
                'universal-selection': true,
            }
        } )
    }
}
</script>

<style lang="less">
    @import "../../../less/vars.less";

</style>