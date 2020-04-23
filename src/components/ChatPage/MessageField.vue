<template>
    <div class="msgField">
        <div id="message-field" ref="m-field" :contenteditable="enable" tabindex="1"
            @keypress.enter.prevent="submit" @keydown="checkLength"
            @paste.prevent="pasteFilter" @input="fieldInput" @drop.prevent="focus"></div>
        <button class="clearButton" title="Очистить поле ввода" @click="clearMessageString"><div>✕</div></button>
        <button type="submit" @click.prevent="submit" tabindex="2" title="Отправить сообщение">
            <div><cantina-icons iconName="chat" class="submitIcon" /></div>
        </button>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import {MESSAGE_TYPES, CHAT_COMMANDS} from '../../constants.js';

const MAX_MESSAGE_LENGTH = 384;
const MAX_SMILES_COUNT = 5;

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
            messageString: '',
            messageTextLength: 0,
            cursorPosition: 0,
            disable: false,
            messageTypes: [],
            messageTypesRegEx: null,
        }
    },
    computed: {
        ...mapGetters({
            usersInOnline: 'users/usersInOinline',
        }),
    },
    methods: {
        ...mapActions({
            sendToServer: 'connection/send',
        }),
        ...mapMutations({
            registerCommand: 'commands/registerCommand',
            deleteCommand: 'commands/deleteCommand',
        }),


        // событие onInput на поле ввода
        fieldInput: function() {
            this.updateMessageString(this.$refs['m-field'].innerHTML);
            this.updateCursorPosition();
            this.fieldUpdate();
        },


        // обновление html в поле ввода
        fieldUpdate: function() {
            this.$refs['m-field'].innerHTML = this.messageString;
            this.$refs['m-field'].focus();
            this.messageTextLength = this.$refs['m-field'].innerText.length;
            this.setCursorPosition(this.cursorPosition);
            
        },


        // обновление содержимого строки сообщения
        updateMessageString: function(newString) {
            newString = newString.replace(/<br>/g, " ");                // удаляем тег <br> (автоматом вставляется в edge например)
            // удаляем тег user, если внутри него не имя одного из присутствующих юзеров
            newString = newString.replace(/<user>([^<]*)<\/user>/g, (match, val) => {
                for(let ui in this.usersInOnline) {
                    if(this.usersInOnline[ui].name == val) return match;
                }
                return val;
            });
            
            // распознавание ручного ввода имени юзера
            let handWritedNamePattern = new RegExp('^((?:@)|(?:\\/pm\\s))?([a-zа-я]{2,11}\\s?[a-zа-я0-9]{2,11}),', 'i');
            newString = newString.replace(handWritedNamePattern, (replace, cmd, name) => {
                for(let ui in this.usersInOnline) {
                    if(this.usersInOnline[ui].name == name) {
                        replace = `<user>${name}</user>,`;
                        break;
                    }
                }
                if(cmd !== undefined) {
                    replace = cmd + replace;
                }
                return replace;
            });
            
            this.messageString = newString;
        },


        clearMessageString: function() {
            this.messageString = "";
            this.cursorPosition = 0;
            this.fieldUpdate();
        },


        // проверяем максимальную длину сообщения и если превышена - игнорируем нажатия любых клавиш, кроме указанных
        checkLength: function(e) {
            if(this.disable) {
                e.preventDefault();
                return;
            }
            if(this.messageTextLength >= MAX_MESSAGE_LENGTH
            && e.which != BACKSPACE_CODE && e.which != DELETE_CODE
            && e.which != END_CODE && e.which != HOME_CODE
            && e.which != LEFT_CODE && e.which != RIGHT_CODE && e.which != ENTER_CODE) {
                e.preventDefault();
            }
        },


        // позиция курсора в поле ввода
        updateCursorPosition: function() {
            var field = this.$refs['m-field'];
            let selection = document.getSelection();
            let range = new Range;
            range.setStart(field, 0);
            range.setEnd((selection.anchorNode < selection.focusNode)?selection.anchorNode:selection.focusNode, 
            (selection.anchorNode < selection.focusNode)?selection.anchorOffset:selection.focusOffset);
            let result = range.toString().length;
            result = (result < field.innerText.length)?result:field.innerText.length;
            this.cursorPosition = result;
        },


        //установка новой позиции курсора
        setCursorPosition: function(position) {
            this.$refs['m-field'].focus();
            let child = this.$refs['m-field'].firstChild;
            position = (position > this.$refs['m-field'].innerText.length) ? this.$refs['m-field'].innerText.length : position;
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


        // // упоминается ли юзернейм в строке ввода сообщения
        isMessageStringContainsUsername: function(userName) {
            let userNameRegex = new RegExp('(?:<user>)(?:' + userName + ')(?:</user>)');
            return this.messageString.match(userNameRegex) !== null;
        },


        // добавить юзернейм в поле ввода сообщения
        addNicknameToMessageString: function(payload) {
            if(!payload.hasOwnProperty('userName')) return false;
            
            let insert = '';
            // если в строке сообщения нещё нет ника юзера - вставляем
            if(!this.isMessageStringContainsUsername(payload.userName)) {
                insert = "<user>"+payload.userName+"</user>";
                if(this.messageTextLength > 0) insert+=', ';
                else insert+=',&nbsp;';
            }
            
            // меняем тип сообщения на новый
            // для этого сначала удаляем из строки сообщения указатель на старый тип сообщения
            // и потом формируем строку сообщения с указателем на новый тип сообщения
            if(!payload.hasOwnProperty('messageType')) payload.messageType = MESSAGE_TYPES.Base;
            let currentMessageType = this.calculateMessageType();
            let newMessageString = this.messageString.substring(currentMessageType.command.length);
            insert = MESSAGE_TYPES.TYPES[payload.messageType].shortCommand + insert + newMessageString;

            this.updateMessageString(insert);
            this.fieldUpdate();
            this.focus();
        },

        // вставить смайлик в поле ввода сообщения
        inserSmile: function(filename) {
            let smilesInMessageString = this.messageString.match(/<img/ig);
            if(smilesInMessageString !== null && smilesInMessageString.length >= MAX_SMILES_COUNT) {
                this.focus();
                return false;
            }
            
            let smile = document.createElement("img");
            smile.src="/smiles/" + filename;
            this.$refs['m-field'].appendChild(smile);
            this.fieldInput();
        },


        // метод для фокуссировки на поле ввода (переводит курсор в конец)
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


        // метод вычисляет тип сообщения и указатель, которым этот тип создаётся (для последующей замены)
        calculateMessageType: function() {
            let match = this.messageString.match(this.messageTypesRegEx);
            if(match !== null) {
                for(let type = 0; type < this.messageTypes.length; type++) {
                    if(match[type + 1] !== undefined) return {type: MESSAGE_TYPES[this.messageTypes[type]], command: match[type + 1]};
                }
            }
            return {type: MESSAGE_TYPES.Base, command: ''};
        },


        // кнопка отправки сообщения
        submit: async function(){
            if(this.messageTextLength < 2) {
                this.focus();
                return;
            }
            // составляем список получателей
            let recipients = [];
            for(let ui in this.usersInOnline) {
                if(this.isMessageStringContainsUsername(this.usersInOnline[ui].name)) {
                    recipients.push(this.usersInOnline[ui].userId);
                }
            }

            // определяем тип сообщения
            // и удаляем из текста указатель на тип сообщения
            let messageType = this.calculateMessageType();

            let messageRequest = {
                text: this.messageString.substring(messageType.command.length).replace(/(&nbsp;)/ig, '').trim(),
                recipients: recipients,
                messageType: messageType.type
            }
            

            // отправка на сервер
            this.$refs['m-field'].innerHTML="Отправка...";
            this.fieldUpdate();
            this.disable = true;
            await this.sendToServer({command: CHAT_COMMANDS.SEND_MESSAGE, data: messageRequest});
            this.clearMessageString();
            this.disable = false;
            this.focus();
        },
    },
    mounted: function(){
        // регулярное выражение для определения типа сообщения
        let pattern = '^';
        for(let type in MESSAGE_TYPES.TYPES) {
            if(type != MESSAGE_TYPES.Base) {
                this.messageTypes.push(MESSAGE_TYPES.TYPES[type].name);
                pattern += '((?:[' + MESSAGE_TYPES.TYPES[type].shortCommand + '])|(?:\\/' + MESSAGE_TYPES.TYPES[type].command + '\\s))|';
            }
        }
        pattern += '(\\s?)';
        this.messageTypes.push(MESSAGE_TYPES.TYPES[MESSAGE_TYPES.Base].name);
        this.messageTypesRegEx = new RegExp(pattern, 'i');


        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_ADD_NAME_TO_MESSAGE, command: this.addNicknameToMessageString});
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_INSERT_SMILE, command: this.inserSmile});
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_FOCUS_INPUT_FIELD, command: this.focus});
        this.focus();
    },
    beforeDestroy: function() {
        this.deleteCommand(CHAT_COMMANDS.ACTION_ADD_NAME_TO_MESSAGE);
        this.deleteCommand(CHAT_COMMANDS.ACTION_FOCUS_INPUT_FIELD);
    }

}
</script>

<style lang="less">
    @import "../../less/vars.less";
    @msgInput-height: @input-fontsize * 1.4;

    .msgField {
        display: flex;
        position: relative;
        height: @msgInput-height;
        overflow: hidden;
        background-color: @dark-grey;
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
            white-space: nowrap;
            overflow-x: scroll;
            min-height: @msgInput-height * 2;
            resize: none;
            padding: 0 @base-padding;
            font-size: @input-fontsize;
            line-height: @msgInput-height;
            cursor: text;
            flex-grow: 1;
            &:focus {
                outline: none;
            }
            user {
                font-weight: bold;
                font-style: italic;
                color: @green;
            }
            img {
                max-height: @msgInput-height;
                vertical-align: middle;
            }
        }
        button {
            display: block;
            background-color: inherit;
            flex-shrink: 0;
            &:hover {
                color: @gold;
            }
        }
        button[type="submit"] {
            margin-right: -@base-border-width;
            border-width: @base-border-width;
            border-style:  solid;
            border-color: inherit;
            border-radius: inherit;
            width: @msgInput-height * 2;
            height: @msgInput-height;
            color: @gold;
            background-color: inherit;
            font-family: @button-font;
            font-weight: bold;
            &:hover, &:focus, &.msgFieldFocused:hover {
                background-color: @gold;
                color: @dark-grey;
            }
        }
    }
</style>