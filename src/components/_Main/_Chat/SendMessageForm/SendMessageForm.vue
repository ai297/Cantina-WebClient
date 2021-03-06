<template>
    <div class="chat__message-sender">
        <div id="nameBlock" :class="{focused:messageFieldFocused}"><p>{{(currentUser.name !== null) ? currentUser.name + ':' : ''}}</p></div>
        <div id="inputBlock">
            <div class="message-field" :class="{focused:messageFieldFocused && isConnected}">
                <div id="understudyInput"><pre class="htmlInput" v-html="newMessageString"></pre><span id="inputPositionMarker" ref="inputPositionMarker">marker</span></div>
                <html-field class="htmlInput" ref="messageField"
                    v-model="newMessageString"
                    :maxlength="MAX_MESSAGE_LENGTH"
                    
                    @focus="messageFieldFocused = true"
                    @blur="blurMessageField"
                    @input="inputController"
                    @keydown="inputKeyDown"
                />
                <button title="Очистить поле ввода" @click="clearMessageString"><div>✕</div></button>
                <button type="submit" @click.prevent="submit" tabindex="2" title="Отправить сообщение">
                    <div><cantina-icons iconName="chat" /></div>
                </button>
            </div>
        </div>
        <div id="extendButtons" v-if="isConnected">
            <button title="Смайлики" @click="showSmiles"><div><cantina-icons iconName="smile" /></div></button>
        </div>
    </div>
</template>

<script>
//:disable="disableMessageInput || !isConnected || currentUser.status != STATUS.ONLINE"
import { mapGetters, mapActions, mapMutations } from 'vuex';
import {MESSAGE_TYPES, CHAT_COMMANDS} from '../../../../constants.js';

const MAX_MESSAGE_LENGTH = 384;
const MAX_SMILES_COUNT = 5;

import htmlField from '../../../ui/HTMLField.vue';
import popUpUsers from './PopUpUsersList.vue';
import smilesPanel from './SmilesPanel.vue';

export default {
    name: "SendMessageForm",
    components: {
        htmlField,
        //popUpUsers
    },
    data: function() {
        return {
            MAX_MESSAGE_LENGTH,
            //STATUS,

            disableMessageInput: false,
            newMessageString: '',
            messageFieldFocused: false,
            messageTypes: [],
            messageTypesRegEx: null,
            mfRange: null,

            sortValue: '',
            popUpUsersCoord: {
                x: 0,
                y: 0,
            },
            popUpSelectedIndex: 0,
        }
    },
    computed: {
        ...mapGetters({
            currentUser: 'users/currentUser',
            usersInOnline: 'users/usersInOinline',
            isConnected: 'connection/isConnected',
            popUp: 'popUp',
        }),

        // сортрованный список юзеров в онлайне, исключающий тех, кто уже есть в строке сообщения, TODO: а так же текущего юзера.
        sortedUsersList: function() {
            let result = [];
            for(let user of this.usersInOnline) {
                if(this.isMessageStringContainsUsername(user.name) || this.sortValue.length > user.name.length || user.userId == this.currentUser.userId) continue;
                let match = user.name.match(new RegExp('^'+this.sortValue, 'i'));
                if(match !== null) result.push(user.name);
            }
            return result;
        },
    },
    methods: {
        ...mapActions({
            sendToServer: 'connection/send',
            runCommand: 'commands/run',
        }),
        ...mapMutations({
            registerCommand: 'commands/registerCommand',
            deleteCommand: 'commands/deleteCommand',
            openPopUp: 'openPopUp',
            closePopUp: 'closePopUp',
        }),

        showSmiles: function(e) {
            const el = e.target.getBoundingClientRect();
            this.openPopUp({component: smilesPanel, props: {
                left: el.left + el.width /2,
                top: el.top - 10,
            }});
        },

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
            
            if(!payload.hasOwnProperty('userName')) return;
            this.focusMessageField();
            
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
            document.execCommand("selectAll");
            selection = document.getSelection();
            // перед этим удаляем ввод до @ и после
            let match = this.newMessageString.match(/@([a-zа-я]{0,11}\s?[a-zа-я0-9]{0,})$/i);
            if(match === null) selection.collapseToEnd();
            else {
                selection.setBaseAndExtent(selection.focusNode, selection.focusOffset - match[0].length, selection.focusNode, selection.focusOffset);
            }
            document.execCommand("insertHTML", false, `<span contenteditable="false"><user contenteditable="false">${payload.userName}</user></span>, `);
            document.execCommand("selectAll");
            document.getSelection().collapseToEnd();
            if(this.popUp.show) this.openUserList(false);           // закрывает менюшку с выбором юзеров
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


        // отслеживание ввода юзера
        inputController: function(input) {
            // ВВОД ЮЗЕРА С ИСВОЛЬЗОВАНИЕМ POP-UP СПИСКА
            // ввод @ предлагает выбрать юзера из присутствующих в чате
            let match = input.match(/@([a-zа-я]{1,11}\s?[a-zа-я0-9]{0,})$/i);
            if(input[input.length - 1] == "@") {
                // определяем координаты каретки в пикселях, используя невидимый блок с копией поля ввода
                this.sortValue = '';
                const rect = this.$refs['inputPositionMarker'].getBoundingClientRect();
                this.popUpUsersCoord.x = rect.left;
                this.popUpUsersCoord.y = rect.top;
                this.openUserList();                                    // включаем менюшку выбора юзеров
            } else if(match !== null) {
                this.sortValue = match[1];
            } else if(this.popUp.show) this.openUserList(false);        // включаем менюшку выбора юзеров
        },

        // нажатие клавишь при вводе
        inputKeyDown: function(key) {
            switch(key) {
                case "ArrowDown":
                    if(this.popUp.show && this.popUpSelectedIndex < this.sortedUsersList.length - 1) this.popUpSelectedIndex++;
                    break;
                case "ArrowUp":
                    if(this.popUp.show && this.popUpSelectedIndex > 0) this.popUpSelectedIndex--;
                    break;
                case "Enter":
                    if(this.popUp.show) this.addNicknameToMessageString({messageType: MESSAGE_TYPES.Base, userName: this.sortedUsersList[this.popUpSelectedIndex]});
                    else this.submit();
                    break;
                case "Tab":
                    if(this.popUp.show) {
                        this.addNicknameToMessageString({messageType: MESSAGE_TYPES.Base, userName: this.sortedUsersList[this.popUpSelectedIndex]});
                        setTimeout( () => this.focusMessageField(), 10);
                    }
                    break;
            }
        },

        openUserList: function(open = true) {
            if(open) {
                this.openPopUp({component: popUpUsers, props: {
                    list: this.sortedUsersList,
                    top: this.popUpUsersCoord.y,
                    left: this.popUpUsersCoord.x,
                    selected: this.popUpSelectedIndex
                }});
            }
            else this.closePopUp();
        },

        // Отправка сообщения
        submit: function(){
            if(this.popUp.show || !this.isConnected) return;

            let messageText = this.newMessageString.replace(/\s{2,}/ig, ' ').trim();
            if(messageText.length < 2) return;
            this.disableMessageInput = true;
            // определяем тип сообщения
            // и удаляем из текста указатель на тип сообщения и повторяющиеся пробелы
            let messageType = this.calculateMessageType();
            if(messageType.type != MESSAGE_TYPES.Base) messageText = messageText.substring(messageType.command.length);

            // Обработка содержимого строки сообщения
            messageText = messageText.replace(/(?:<user[^>]*>)([^<]+)(?:<\/user>)/ig, "<user>$1</user>");                   // 1. тег юзер
            messageText = messageText.replace(/<img src=['"]+\/smiles\/([^"'.]+)[^>]*>/ig, "<smile>$1</smile>");            // 2. смайлики
            messageText = messageText.replace(/<(?!\/?((user)|(author)|(smile)))[^>]*(?:\s\/)?>/ig, "");                    // N. очистка всех лишних тегов

            // составляем список получателей
            let recipients = [];
            let recMatch = messageText.match(/^([a-zа-я]{2,11}\s?[a-zа-я0-9]{2,11})[,.*()[\]{}:;!?/\\]+/i);

            for(let ui in this.usersInOnline) {
                if(this.isMessageStringContainsUsername(this.usersInOnline[ui].name)) {
                    recipients.push(this.usersInOnline[ui].userId);
                } else if(recMatch !== null && this.usersInOnline[ui].name == recMatch[1]) {
                    recipients.push(this.usersInOnline[ui].userId);
                    messageText = messageText.replace(recMatch[1], `<user>${recMatch[1]}</user>`);
                }
            }
            
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
            .catch(() => {
                this.runCommand({commandName: CHAT_COMMANDS.ACTION_ADD_MESSAGE, payload: {
                    authorId: 0,
                    authorName: 'System',
                    dateTime: new Date(),
                    recipients: this.currentUser.userId,
                    type: MESSAGE_TYPES.Error,
                    text: "Не удалось отправить сообщение."
                }});
            })
            .finally(() => {
                setTimeout(() => {
                    this.disableMessageInput = false;
                    this.clearMessageString();
                }, 100);
            });
            
        },
    },
    watch: {
        sortedUsersList: function(val) {
            this.popUpSelectedIndex = 0;
            if(val.length == 0 && this.popUp.show) this.openUserList(false);
        },
    },
    created: function() {
        // регулярное выражение для определения типа сообщения
        let pattern = '^';
        for(let type in MESSAGE_TYPES.TYPES) {
            if(type != MESSAGE_TYPES.Base) {
                this.messageTypes.push(MESSAGE_TYPES.TYPES[type].name);
                if(MESSAGE_TYPES.TYPES[type].shortCommand !== null)
                    pattern += '((?:[' + MESSAGE_TYPES.TYPES[type].shortCommand + '])|(?:\\/' + MESSAGE_TYPES.TYPES[type].command + '\\s))|';
                else pattern += '(\\/' + MESSAGE_TYPES.TYPES[type].command + '\\s)|';
            }
        }
        pattern += '(\\s?)';
        this.messageTypes.push(MESSAGE_TYPES.TYPES[MESSAGE_TYPES.Base].name);
        this.messageTypesRegEx = new RegExp(pattern, 'i');

        // регистрируем общедоступные команды
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_FOCUS_INPUT_FIELD, command: this.focusMessageField});
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_ADD_NAME_TO_MESSAGE, command: (data) => {
            if(this.$route.name == 'chat') this.addNicknameToMessageString(data)
        }});
        this.registerCommand({commandName: CHAT_COMMANDS.ACTION_INSERT_SMILE_TO_MESSAGE, command: this.isertOldSmileToMessageString});
    },
    beforeDestroy: function() {
        this.deleteCommand(CHAT_COMMANDS.ACTION_FOCUS_INPUT_FIELD);
        this.deleteCommand(CHAT_COMMANDS.ACTION_ADD_NAME_TO_MESSAGE);
        this.deleteCommand(CHAT_COMMANDS.ACTION_INSERT_SMILE_TO_MESSAGE);
    }
}
</script>

<style lang="less">
    @import "../../../../less/vars.less";
    @msgInput-height: @input-fontsize * 1.4;

    div.chat__message-sender {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        margin-top: @base-padding;
        align-items: center;

        .inputUserListMenu {
            display: block;
            position: fixed;
            z-index: 10000;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }

        #nameBlock {
            color: inherit;
            display: inline-block;
            flex-grow: 0;
            flex-shrink: 0;
            max-width: 10rem;
            flex-basis: auto;
            padding-right: @base-padding*2;
            p {
                width: 100%;
                text-align: right;
                color: inherit;
                white-space: nowrap;
                overflow: hidden;
                line-height: @input-fontsize * 1.4;
            }
            &.focused {
                color: @gold;
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
                background: none;
                border-radius: round(@msgInput-height / 4, 2);
                border: @base-border-width solid @grey;

                #understudyInput {
                    position: absolute;
                    pointer-events: none;
                    left: 0;
                    top: 0;
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    visibility: hidden;
                    pre {
                        display: block;
                        overflow-y: scroll;
                        white-space: pre;
                        font-family: inherit;
                        flex-grow: 0;
                        flex-shrink: 0;
                        flex-basis: auto;
                        min-height: unset;
                        width: auto;
                        max-width: calc(100% - 5rem);
                        padding: 0;
                    }
                    #inputPositionMarker {
                        background-color: @blue;
                    }
                }

                .htmlInput {
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
                    background: none;
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
                    color: @grey;
                    background: none;
                    font-family: @button-font;
                    font-weight: bold;
                    &:hover, &:focus, &.msgFieldFocused:hover {
                        background-color: @grey;
                        color: @dark-grey;
                    }
                }

                &.focused {
                    border-color: @gold;
                    background-color: mix(@dark-grey, rgba(0,0,0,0));
                    button[type="submit"] {
                        color: @gold;
                        &:hover, &:focus, &.msgFieldFocused:hover {
                            background-color: @gold;
                            color: @dark-grey;
                        }
                    }
                }
            }
        }
        #extendButtons {
            flex-grow: 0;
            flex-shrink: 0;
            flex-basis: auto;
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
    }

    @media screen and (max-width: 699px) {
        div.chat__message-sender #nameBlock{
            display: none;
        }
    }
</style>