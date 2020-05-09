<template>
    <pre class="html-field" ref="html-field" v-on="inputListener" :class="{multiline}" 
    :tabindex="tabindex" :contenteditable="!disable"></pre>
</template>

<script>

const ENTER_KEY = 13;
const BACKSPACE_KEY = 8;
const DELETE_KEY = 46;
const END_KEY = 35;
const HOME_KEY = 36;
const LEFT_KEY = 37;
const RIGHT_KEY = 39;

export default {
    name: "HtmlField",
    props: {
        maxlength: {
            type: Number,
            default: 100
        },
        value: {
            type: String,
            default: ''
        },
        disable: {
            type: Boolean,
            default: false
        },
        multiline: {
            type: Boolean,
            default: false
        },
        tabindex: {
            type: Number,
            default: 0
        }
    },
    computed: {
        inputListener: function(){
            var vm = this;
            return Object.assign({},
                this.$listeners,
                {
                    input: function(){
                        vm.$emit('input', vm.$refs["html-field"].innerHTML);
                    },
                    keydown: function(event) {
                        vm.$emit('keydown', event.key);
                        // обработка клавиши enter
                        if(event.which == ENTER_KEY && !vm.multiline) {
                            event.preventDefault();
                        }
                        // обработка клавиши backspace
                        //else if(window.getSelection && event.which == BACKSPACE_KEY) vm.fixNotEditableBlocks(event);
                        // проверка длины строки
                        else vm.checkLength(event);
                    },
                    paste: function(event) {
                        event.preventDefault();
                        vm.paste(event);
                    },
                    drop: function(event) {
                        event.preventDefault();
                        vm.focus();
                        return false;
                    }
                }
            )
        },
    },
    methods: {

        // обрабатывает вставку из буфера (запретить разметку, только текст)
        paste: function(e) {
            let text = '';
            if (e.clipboardData || e.originalEvent.clipboardData) {
                text = (e.originalEvent || e).clipboardData.getData('text/plain');
            } else if (window.clipboardData) {
                text = window.clipboardData.getData('Text');
            }
            text = text.split(/\r?\n/)[0];  // берём только часть строки до первого встреченного переноса строк
            let maxPastLength = this.maxlength - this.$refs["html-field"].innerText.length;
            text = text.substr(0, maxPastLength);
            if (document.queryCommandSupported('insertText')) {
                document.execCommand('insertText', false, text);
            } else {
                document.execCommand('paste', false, text);
            }
        },

        // игнорируем нажатия клавишь, кроме указанных, если длина текста превысила допустимую
        checkLength: function(e) {
            // игнорировать нажатие всех клавишь, кроме указанных, если достигнута максимальная длина строки
            if(this.$refs["html-field"].innerText.length >= this.maxlength
            && e.which != BACKSPACE_KEY && e.which != DELETE_KEY
            && e.which != END_KEY && e.which != HOME_KEY
            && e.which != LEFT_KEY && e.which != RIGHT_KEY) {
                e.preventDefault();
            }
        },

        // установить фокус на поле (в конец)
        focus: function() {
            this.$refs['html-field'].focus();
            let range = new Range();
            range.selectNodeContents(this.$refs['html-field']);
            let selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            selection.collapseToEnd();
        },

        clear: function() {
            this.$refs['html-field'].innerHTML="";
            this.$refs['html-field'].focus();
        },

        // fixNotEditableBlocks: function(event) {
        //     let selection = window.getSelection();
        //     if (!selection.isCollapsed || !selection.rangeCount) {
        //         return;
        //     }
        //     let curRange = selection.getRangeAt(selection.rangeCount - 1);
        //     if (curRange.commonAncestorContainer.nodeType == 3 && curRange.startOffset > 0) {
        //         // we are in child selection. The characters of the text node is being deleted
        //         return;
        //     }
        //     let range = document.createRange();
        //     if (selection.anchorNode != this.$refs['html-field']) {
        //         // selection is in character mode. expand it to the whole editable field
        //         range.selectNodeContents(this.$refs['html-field']);
        //         range.setEndBefore(selection.anchorNode);
        //     } else if (selection.anchorOffset > 0) {
        //         range.setEnd(this.$refs['html-field'], selection.anchorOffset);
        //     } else {
        //         // reached the beginning of editable field
        //         return;
        //     }
        //     range.setStart(this.$refs['html-field'], range.endOffset - 1);
        //     let previousNode = range.cloneContents().lastChild;
        //     if (previousNode && previousNode.contentEditable == false) {
        //         // this is some rich content, e.g. smile. We should help the user to delete it
        //         range.deleteContents();
        //         event.preventDefault();
        //         this.$emit('input', this.$refs['html-field'].innerHTML);
        //     }
        // }

    },
    watch: {
        value: function() {
            if(!this.multiline) {
                this.$refs["html-field"].scrollLeft = this.$refs["html-field"].scrollWidth - this.$refs["html-field"].clientWidth;
            }
        }
    },
    mounted: function() {
        this.$refs["html-field"].innerHTML = this.value;
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";
    
    .html-field {
        display: block;
        resize: none;
        overflow: hidden;
        overflow-y: scroll;
        white-space: pre;
        font: inherit;
        &:focus {
            outline: none;
        }

        &:not(.multiline) {
            overflow: hidden;
            overflow-x: scroll;
        }
    }
</style>