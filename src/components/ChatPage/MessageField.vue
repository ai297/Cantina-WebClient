<template><div>
    <div class="msgField">
        <div id="message-field" ref="m-field" :contenteditable="enable" tabindex="1"
            @keypress.enter.prevent="submit" @keydown="checkLength" @keyup="getCursorPosition"
            @paste.prevent="pasteFilter" @input="fieldInput"></div>
        <button id="smileIcon" @click="showSmiles" title="Смайлики"><div><cantina-icons iconName="smile" /></div></button>
        <button type="submit" @click.prevent="submit" tabindex="2" title="Отправить сообщение">
            <div><cantina-icons iconName="chat" class="submitIcon" /></div>
        </button>
    </div>
</div></template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

const MAX_MESSAGE_LENGTH = 384;
const ENTER_CODE = 13;
const BACKSPACE_CODE = 8;
const DELETE_CODE = 46;
const END_CODE = 35;
const HOME_CODE = 36;
const LEFT_CODE = 37;
const RIGHT_CODE = 39;

export default {
    name: "MessageField",
    props: {
        enable: {
            type: Boolean,
            default: true
        }
    },
    data: function() {
        return {
            messageTextLength: 0,
        }
    },
    computed: {
        ...mapGetters({
            messageFieldContent: 'messages/getNewMessageString',
            cursorPosition: 'messages/getMessageFieldCursorPosition',
            messageType: 'messages/getNewMessageType',
        }),
    },
    watch: {
        messageFieldContent: function() {
            this.fieldUpdate();
        },
    },
    methods: {
        ...mapActions({
            sendMessage: 'messages/sendMessage',
        }),
        ...mapMutations ({
            updateMessageString: 'messages/updateMessageString',
            updateCursorPosition: 'messages/updateCursorPosition',
        }),
        fieldInput: function() {
            this.updateMessageString(this.$refs['m-field'].innerHTML);
            this.getCursorPosition();
            this.fieldUpdate();
        },
        fieldUpdate: function() {
            let field = this.$refs['m-field'];
            field.innerHTML = this.messageFieldContent;
            field.focus();
            this.setCursorPosition(this.cursorPosition);
            this.messageTextLength = field.innerText.length;
        },
        // проверяем максимальную длину сообщения и если превышена - игнорируем нажатия любых клавиш, кроме указанных
        checkLength: function(e) {
            if(this.messageTextLength >= MAX_MESSAGE_LENGTH
            && e.which != BACKSPACE_CODE && e.which != DELETE_CODE
            && e.which != END_CODE && e.which != HOME_CODE
            && e.which != LEFT_CODE && e.which != RIGHT_CODE && e.which != ENTER_CODE) {
                e.preventDefault();
            }
        },
        // позиция курсора в поле ввода
        getCursorPosition: function() {
            var field = this.$refs['m-field'];
            let selection = document.getSelection();
            let range = new Range;
            range.setStart(field, 0);
            range.setEnd((selection.anchorNode < selection.focusNode)?selection.anchorNode:selection.focusNode, (selection.anchorNode < selection.focusNode)?selection.anchorOffset:selection.focusOffset);
            let result = range.toString().length;
            result = (result < field.innerText.length)?result:field.innerText.length;
            if(result != this.cursorPosition) this.updateCursorPosition(result);
        },
        setCursorPosition: function(position) {
            this.$refs['m-field'].focus();
            let child = this.$refs['m-field'].firstChild;
            while(position > 0) {
                let length = child.textContent.length;
                if(position > length) {
                    position -= length;
                    child = child.nextSibling;
                }
                else {
                    if(child.nodeType == 3) return document.getSelection().collapse(child, position)
                    child = child.firstChild;
                }
            }
        },
        // метод для фокуссировке на поле ввода (переводит курсор в конец поля)
        focus: function() {
            this.setCursorPosition(this.messageTextLength);
        },
        // обрабатывает вставку из буфера (запретить разметку, только текст)
        pasteFilter(e) {
            let text = '';
            if (e.clipboardData || e.originalEvent.clipboardData) {
                text = (e.originalEvent || e).clipboardData.getData('text/plain');
            } else if (window.clipboardData) {
                text = window.clipboardData.getData('Text');
            }
            text = text.split(/\r?\n/)[0];  // берём только часть строки до первого встреченного переноса строк
            let maxPastLength = MAX_MESSAGE_LENGTH - this.messageTextLength;
            text = text.substr(0, maxPastLength);
            if (document.queryCommandSupported('insertText')) {
                document.execCommand('insertText', false, text);
            } else {
                document.execCommand('paste', false, text);
            }
        },
        // кнопка смайлика
        showSmiles: function() {
            this.$emit('showSmiles');
            this.focus();
        },
        // Отправка сообщения
        submit: function(){
            if(this.messageTextLength < 3) {
                this.focus();
                return;
            }
            // this.onlineUsers.forEach(user => {
            //     var pattern = new RegExp('(?:^|[^a-zA-Zа-яА-Я0-9]+)(?:' + user.name + ')(?:[^a-zA-Zа-яА-Я0-9]+)');
            //     var matchUser = this.messageFieldHTML.match(pattern);
            //     if(matchUser != null) this.recipients.push(user.id);
            // });
            
            this.sendMessage();
        },
        testEnter: function() {
            this.updateMessageString('~В кантину заходит <0>.');
            this.sendMessage();
        }
    },
    mounted: function(){
        this.focus();
        this.testEnter();
    },
}
</script>
<style lang="less">
    @import "../../less/vars.less";
    @msgInput-height: @input-fontsize * 1.4;
    @msgInput-widthSpacing: @msgInput-height * 3;

    .msgField {
        display: block;
        position: relative;
        height: @msgInput-height;
        overflow: hidden;
        background-color: @content-bgcolor;
        border-radius: round(@msgInput-height / 4, 2);
        border: @base-border-width solid @grey;
        &:focus-within {
            border-color: @gold;
        }
        svg {
            display: inline-block;
            vertical-align: bottom;
            width: @msgInput-height * 0.7;
            height: @msgInput-height * 0.7;
        }
        #message-field {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: calc(100% - @msgInput-widthSpacing - round(@base-padding * 2));
            white-space: nowrap;
            overflow-x: scroll;
            min-height: @msgInput-height * 2;
            resize: none;
            padding: 0 @base-padding;
            font-size: @input-fontsize;
            line-height: @msgInput-height;
            cursor: text;
            &:focus {
                outline: none;
            }
        }
        button {
            display: block;
            position: absolute;
            background-color: inherit;
        }
        #smileIcon {
            right: @msgInput-height * 2;
            top: 0;
            height: @msgInput-height;
            color: inherit;
            &:hover {
                color: @gold;
            }
        }
        button[type="submit"] {
            top: 0;
            right: -@base-border-width;
            border-width: @base-border-width;
            border-style:  solid;
            border-color: inherit;
            border-radius: inherit;
            width: @msgInput-height * 2;
            height: @msgInput-height;
            color: @gold;
            background-color: @dark-grey;
            font-family: @button-font;
            font-weight: bold;
            &:hover, &:focus, &.msgFieldFocused:hover {
                background-color: @gold;
                color: @dark-grey;
            }
        }
    }
</style>