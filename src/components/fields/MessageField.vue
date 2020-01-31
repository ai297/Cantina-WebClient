<template>
    <div class="msgField" :class="{ msgFieldFocused: isFocused }">
        <div id="msgType">ЛС</div>
        <div id="message-field" ref="m-field" :contenteditable="enable"
            v-html="messageFieldHTML" tabindex="1"
            @focus="msgFieldFocused(true)" @blur="msgFieldFocused(false)"
            @keypress.enter.prevent="msgFieldEnterPress" @paste.prevent="msgPasteFilter">
        </div>
        <button id="smileIcon" @click="msgSmilePress"><cantina-icons iconName="smile" /></button>
        <button type="submit" :class="{ msgFieldFocused: isFocused }" @click.prevent="msgSubmit" tabindex="2">
            <cantina-icons iconName="chat" class="submitIcon" />
        </button>
    </div>
</template>

<script>

import cantinaIcons from '../icons/IconBase.vue';

export default {
    name: "MessageField",
    components: {
        cantinaIcons
    },
    data: function() {
        return {
            messageFieldHTML: '',
            isFocused: false,
        }
    },
    props: {
        enable: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        // метод для фокуссировке на поле ввода
        msgFieldFocus: function() {
            this.$refs['m-field'].focus();
        },
        // устанавливает флаг есть фокус на вводе или нет
        msgFieldFocused: function(val) {
            this.isFocused = val;
        },
        // обрабатывает событие нажатия клавиши enter в поле ввода
        msgFieldEnterPress: function() {

        },
        // обрабатывает вставку из буфера (запретить разметку, только текст)
        msgPasteFilter(e) {
            var text = '';
            // получаем значение из буфера
            if (e.clipboardData || e.originalEvent.clipboardData) {
                text = (e.originalEvent || e).clipboardData.getData('text/plain');
            } else if (window.clipboardData) {
                text = window.clipboardData.getData('Text');
            }
            // обрабатываем контент
            text = text.split(/\r?\n/)[0];  // берём только часть строки до первого встреченного переноса строк
            // вставляем результат в поле
            if (document.queryCommandSupported('insertText')) {
                document.execCommand('insertText', false, text);
            } else {
                document.execCommand('paste', false, text);
            }
        },
        // кнопка смайлика
        msgSmilePress: function() {
            this.msgFieldFocus();
        },
        // кнопка ОК
        msgSubmit: function(){
            this.msgFieldFocus();
        },
    },
    mounted: function(){
        this.msgFieldFocus();
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";
    @msg-input-spacing: @base-padding * 3 + @message-input-height * 4;

    .msgField {
        display: block;
        position: relative;
        margin: 0 @base-padding * 2;
        height: @message-input-height;
        overflow: hidden;
        background-color: @dark-grey;
        border-radius: round(@message-input-height / 3);
        border: 1px solid @grey;

        div#msgType {
            position: absolute;
            width: @message-input-height;
            height: @message-input-height;
            left: @base-padding;
            top: 0;
            overflow: hidden;
            font: @system-message-font;
            line-height: @message-input-height;
            text-align: center;
        }
        div#message-field {
            display: block;
            position: absolute;
            top: 0;
            left: @message-input-height + @base-padding;
            width: calc(100% - @msg-input-spacing);
            white-space: nowrap;
            overflow-x: scroll;
            min-height: @base-fontsize * 3;
            resize: none;
            padding: 0 @base-padding;
            font-size: @input-fontsize;
            line-height: @message-input-height;
            cursor: text;
            &:focus {
                outline: none;
            }
        }
        button {
            display: block;
            position: absolute;
            background-color: inherit;
            &:focus {
                outline: none;
            }
            &:active {
                margin-top: 1px;
            }
        }
        button#smileIcon {
            right: @message-input-height * 2;
            top: 0;
            border: none;
            width: @message-input-height;
            height: @message-input-height;
            color: inherit;
            cursor: pointer;
            &:hover {
                color: @gold;
            }
        }
        button[type="submit"] {
            top: -2px;
            right: -2px;
            border: 2px solid @grey;
            border-radius: inherit;
            width: @message-input-height * 2;
            height: @message-input-height + 4px;
            color: @gold;
            cursor: pointer;
            font-family: @button-font;
            font-size: @base-fontsize;
            font-weight: bold;
            &:focus {
                border-color: @gold;
            }
            &:focus, &.msgFieldFocused:hover {
                background-color: @gold;
                color: @dark-grey;
            }
        }
    }

    .msgFieldFocused {
        border-color: @gold !important;
    }

    svg {
        display: inline-block;
        vertical-align: bottom;
        width: round(@message-input-height * 0.7);
        height: round(@message-input-height * 0.7);
    }
</style>