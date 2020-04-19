<template>
    <div class="sndMForm">
        <div id="nameBlock"><p>{{currentUserName}}:</p></div>
        <div id="inputBlock">
            <div class="message-field" :class="{focused:messageFieldFocused}">
                <html-field id="message-field" ref="messageField"
                    v-model="newMessageString"
                    :maxlength="MAX_MESSAGE_LENGTH"
                    :disable="disableMessageInput"
                    @focus="messageFieldFocused = true"
                    @blur="blurMessageField"
                    @submit="submit"
                />
                <button title="Очистить поле ввода" @click="clearMessageString"><div>✕</div></button>
                <button type="submit" @click.prevent="submit" tabindex="2" title="Отправить сообщение">
                    <div><cantina-icons iconName="chat" /></div>
                </button>
            </div>
        </div>
        <div id="extendButtons">
            <button @click="changeWidth"><div><cantina-icons iconName="maximize" /></div></button>
        </div>
        <div id="extendPanel" v-show="isShowExtendPanel"><component :is="extendPanelComponent" /></div>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import {MESSAGE_TYPES, CHAT_COMMANDS} from '../../constants.js';

const MAX_MESSAGE_LENGTH = 384;
const MAX_SMILES_COUNT = 5;

import htmlField from '../ui/HTMLField.vue';

export default {
    name: "SendMessageForm",
    components: {
        htmlField,
    },
    data: function() {
        return {
            MAX_MESSAGE_LENGTH,
            disableMessageInput: false,
            newMessageString: '',
            messageFieldFocused: false,
            messageTypes: [],
            messageTypesRegEx: null,
            mfRange: null,
        }
    },
    computed: {
        ...mapGetters({
            currentUserName: 'auth/userName',
            usersInOnline: 'users/usersInOinline',
            isShowExtendPanel: 'chat/isShowExtendPanel',
            extendPanelComponent: 'chat/getExtendPanelComponent',
        }),
    },
    methods: {
        ...mapActions({
            sendToServer: 'connection/send',
            runCommand: 'commands/run',
        }),
        ...mapMutations({
            showExtend: 'chat/showExtendPanel',
            changeWidth: 'chat/changeWidth',
            registerCommand: 'commands/registerCommand',
            deleteCommand: 'commands/deleteCommand',
        }),
        

        // при потере фокуса с поля ввода
        blurMessageField: function() {
            this.messageFieldFocused = false;
            let selection = document.getSelection();
            this.mfRange = selection.getRangeAt(selection.rangeCount - 1);
        },

        
        // установить фокус в поле ввода сообщения
        focusMessageField: function() {
            this.$refs['messageField'].focus();
        },


        // очистить поле ввода
        clearMessageString: function() {
            this.newMessageString = "";
            this.$refs['messageField'].clear();
        },


        // метод вычисляет тип сообщения и указатель, которым этот тип создаётся (для последующей замены)
        calculateMessageType: function() {
            let match = this.newMessageString.match(this.messageTypesRegEx);
            if(match !== null) {
                for(let type = 0; type < this.messageTypes.length; type++) {
                    if(match[type + 1] !== undefined) return {type: MESSAGE_TYPES[this.messageTypes[type]], command: match[type + 1]};
                }
            }
            return {type: MESSAGE_TYPES.Base, command: ''};
        },


        // упоминается ли юзернейм в строке ввода сообщения
        isMessageStringContainsUsername: function(userName) {
            let userNameRegex = new RegExp('(?:<user[^>]*>)(?:' + userName + ')(?:</user>)');
            return this.newMessageString.match(userNameRegex) !== null;
        },


        // добавить юзернейм в поле ввода сообщения
        addNicknameToMessageString: function(payload) {
            this.focusMessageField();

            if(!payload.hasOwnProperty('userName')) return;
            
            // заменяем тип сообщения
            let currentMessageType = this.calculateMessageType();
            let newMessageType = (payload.hasOwnProperty("messageType")) ? payload.messageType : MESSAGE_TYPES.Base;
            if(currentMessageType.type == MESSAGE_TYPES.Privat) newMessageType = MESSAGE_TYPES.Privat;

            document.execCommand("selectAll");
            let selection = document.getSelection();
            selection.collapse(selection.anchorNode, currentMessageType.command.length);
            document.execCommand("delete");
            document.execCommand("insertText", false, MESSAGE_TYPES.TYPES[newMessageType].shortCommand);
            
            // если в строке сообщения уже вставлен данный юзер - больше ничего не делаем
            if(this.isMessageStringContainsUsername(payload.userName)) {
                this.focusMessageField();
                return;
            }
            // иначе вставляем тег с новым юзером
            document.execCommand("insertHTML", false, `<span contenteditable="false"><user contenteditable="false">${payload.userName}</user></span>, `);
            document.execCommand("selectAll");
            document.getSelection().collapseToEnd();
        },


        // вставить смайл в поле ввода сообщения
        isertOldSmileToMessageString: function(filename) {
            if(this.mfRange == null) this.focusMessageField();
            else {
                let selection = document.getSelection();
                selection.removeAllRanges();
                selection.addRange(this.mfRange);
            }

            let matchSmiles = this.newMessageString.match(/<img src=["']\/smiles/ig);
            if(matchSmiles === null || matchSmiles.length < MAX_SMILES_COUNT) document.execCommand("insertHTML", false, `<img src="/smiles/${filename}.gif" />`);
        },

        // вставить любой текст(html?) в строку сообщения
        insertTextToMessageString: function(value) {
            if(this.mfRange == null) this.focusMessageField();
            else {
                let selection = document.getSelection();
                selection.removeAllRanges();
                selection.addRange(this.mfRange);
            }

            document.execCommand("insertHTML", false, value);
        },


        // Отправка сообщения
        submit: function(){
            let messageText = this.newMessageString.replace(/\s{2,}/ig, ' ').trim();
            if(messageText.length < 2) return;
            // составляем список получателей
            let recipients = [];
            for(let ui in this.usersInOnline) {
                if(this.isMessageStringContainsUsername(this.usersInOnline[ui].name)) {
                    recipients.push(this.usersInOnline[ui].userId);
                }
            }

            // определяем тип сообщения
            // и удаляем из текста указатель на тип сообщения и повторяющиеся пробелы
            let messageType = this.calculateMessageType();
            if(messageType.type != MESSAGE_TYPES.Base) messageText = messageText.substring(messageType.command.length);

            // Обработка содержимого строки сообщения
            messageText = messageText.replace(/(?:<user[^>]*>)(.+)(?:<\/user>)/ig, "<user>$1</user>");                  // 1. тег юзер
            messageText = messageText.replace(/<img src=['"]+\/smiles\/([^"'.]+)[^>]*>/ig, "<smile>$1</smile>");    // 2. смайлики
            //messageText = messageText.replace(/(.){6,}/ig, "$1$1$1(много раз)");                                        // 3. любые повторяющиеся символы больше 5х
            messageText = messageText.replace(/<(?!\/?((user)|(author)|(smile)))[^>]*(?:\s\/)?>/ig, "");                // N. очистка всех лишних тегов
            
            //console.log(messageText);

            // итоговый объект для отправки на сервер
            let messageRequest = {
                text: messageText,
                recipients: recipients,
                messageType: messageType.type
            }
            
            // отправка на сервер
            this.disableMessageInput = true;
            this.sendToServer({command: CHAT_COMMANDS.SEND_MESSAGE, data: messageRequest})
            .finally(() => {
                setTimeout(() => {
                    this.disableMessageInput = false;
                    this.clearMessageString();
                }, 100);
            });
            
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


        // регистрируем общедоступные команды
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_FOCUS_INPUT_FIELD, command: this.focusMessageField});
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_ADD_NAME_TO_MESSAGE, command: this.addNicknameToMessageString});
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_INSERT_SMILE_TO_MESSAGE, command: this.isertOldSmileToMessageString});
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_INSERT_TEXT_TO_MESSAGE, command: this.insertTextToMessageString});

        this.focusMessageField();
    },
    beforeDestroy: function() {
        this.deleteCommand(CHAT_COMMANDS.ACTION_FOCUS_INPUT_FIELD);
        this.deleteCommand(CHAT_COMMANDS.ACTION_ADD_NAME_TO_MESSAGE);
        this.deleteCommand(CHAT_COMMANDS.ACTION_INSERT_SMILE_TO_MESSAGE);
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";
    @msgInput-height: @input-fontsize * 1.4;

    div.sndMForm {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        margin-top: @base-padding;
        align-items: center;

        #nameBlock {
            color: @gold;
            display: inline-block;
            flex-grow: 0;
            flex-shrink: 0;
            max-width: 10rem;
            min-width: 8rem;
            flex-basis: auto;
            padding-right: @base-padding*2;
            p {
                width: 100%;
                text-align: right;
                color: @gold;
                white-space: nowrap;
                overflow: hidden;
                line-height: @input-fontsize * 1.4;
            }
        }
        #inputBlock {
            flex-grow: 1;
            flex-shrink: 1;
            width: 5rem;
            
            .message-field {
                display: flex;
                position: relative;
                height: @msgInput-height;
                overflow: hidden;
                background-color: @dark-grey;
                border-radius: round(@msgInput-height / 4, 2);
                border: @base-border-width solid @grey;
                &.focused {
                    border-color: @gold;
                }

                #message-field {
                    display: block;
                    min-height: @msgInput-height * 2;
                    padding: 0 @base-padding;
                    font-size: @input-fontsize;
                    line-height: @msgInput-height;
                    cursor: text;
                    flex-grow: 1;

                    user {
                        font-weight: bold;
                        font-style: italic;
                        color: @green;
                        user-select: none;
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
                    border: inherit;
                    border-top: none; border-right: none; border-bottom: none;
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
        }
        #extendButtons {
            flex-grow: 0;
            flex-shrink: 0;
            flex-basis: auto;
            min-width: 8rem;
            line-height: @input-fontsize * 1.4;
            button {
                display: inline-block;
                line-height: @input-fontsize * 1.4;
                padding: 0;
                margin: 0;
                margin-left: .5rem;
                svg {
                    display: inline-block;
                    vertical-align: text-bottom;
                    width: @input-fontsize;
                    height: @input-fontsize;
                }
                &:hover {
                    color: @gold;
                }
            }
        }

        #extendPanel {
            flex-basis: 100%;
            flex-grow: 1;
            flex-shrink: 1;
            width: 100%;
        }
    }

    @media screen and (max-width: 700px) {
        div.sndMForm #nameBlock{
            display: none;
        }
        div.sndMForm #extendButtons {
            min-width: 0;
            display: none;
        }
    }   
</style>