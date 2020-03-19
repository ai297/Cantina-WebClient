import Queue from '../../queue.js';
import { MESSAGE_TYPES } from '../../constants.js';

export default {
    namespaced: true,
    state: {
        newMessageString: '',
        newMessageType: MESSAGE_TYPES.Base.name,
        messageFieldCursorPosition: 0,

        messages: new Queue(),
        maxCount: 100,
    },
    getters: {
        getNewMessageString: state => {
            return state.newMessageString;
        },
        getMessageFieldCursorPosition: state => {
            return state.messageFieldCursorPosition;
        },
        getNewMessageType: state => {
            return state.newMessageType;
        },
        isMessageStringContainsUsername: state => userName => {
            let userNameRegex = new RegExp('(?:^|[^a-zA-Zа-яА-Я0-9]+)(?:' + userName + ')(?:[^a-zA-Zа-яА-Я0-9]+)');
            return state.newMessageString.match(userNameRegex) !== null;
        },

        getMessages: state => {
            return state.messages.getAll();
        },
        count: state => {
            return state.messages.getSize();
        }
    },
    mutations: {
        updateMessageString: (state, newString) => {
            newString = newString.replace(/<br>/g, " ");                // удаляем тег <br> (автоматом вставляется в edge например)
            newString = newString.replace(/(&nbsp;)+(?!$)/g, "");       // удаляем сущности &nbsp; кроме одной в конце строки
            newString = newString.replace(/\s+/g, " ");                 // удаляем повторяющиеся пробелы
            // авто распознавание типов сообщений
            state.newMessageType = MESSAGE_TYPES.Base.name;
            for(let type in MESSAGE_TYPES){
                if(type != 'base') {
                    let commandPattern = new RegExp('^['+MESSAGE_TYPES[type].shortCommand+']|(\\/'+MESSAGE_TYPES[type].command+'\\s+)', 'i');
                    if(newString.match(commandPattern) !== null) {
                        state.newMessageType = MESSAGE_TYPES[type].name;
                        break;
                    }
                }
            }
            state.newMessageString = newString;
        },
        updateCursorPosition: (state, position) => {
            state.messageFieldCursorPosition = position;
        },

        addMessage: (state, message) => {
            // если размер очереди достиг максимального - удаляем самый старый элемент
            if(state.messages.getSize() >= state.maxCount) {
                state.messages.dequeue();
            }
            // добавляем сообщение в очередь
            state.messages.enqueue(message);
        },
        clearMessageString: state => {
            state.newMessageString = '';
            state.messageFieldCursorPosition = 0;
            state.newMessageType = MESSAGE_TYPES.Base.name;
        },
        clearMessages: state => {
            state.messages = new Queue();
        }
    },
    actions: {
        addNicknameToMessageString: (context, payload) => {
            if(!payload.hasOwnProperty('userName')) return false;
            if(context.getters.isMessageStringContainsUsername(payload.userName)) return;
            let insert = payload.userName;
            let oldMessageString = context.getters.getNewMessageString;
            if(oldMessageString.length > 0) insert+=', ';
            else insert+=',&nbsp;';
            
            if(!payload.hasOwnProperty('messageType')) payload.messageType = MESSAGE_TYPES.Base.name;
            let newCursorPositionOffset = MESSAGE_TYPES[payload.messageType].shortCommand.length + payload.userName.length + 2;
            // удаляем из строки сообщения команду-указатель на тип сообщения
            if(context.getters.getNewMessageType != MESSAGE_TYPES.Base.name) {
                newCursorPositionOffset -= oldMessageString.length;
                let commandPattern = new RegExp('^[' + MESSAGE_TYPES[context.getters.getNewMessageType].shortCommand +
                    ']|(\\/' + MESSAGE_TYPES[context.getters.getNewMessageType].command+'\\s+)', 'i');
                oldMessageString = oldMessageString.replace(commandPattern, '');
                newCursorPositionOffset += oldMessageString.length;
            }
            // формируем новую строку сообщения с включенным новым указателем на тип сообщения
            insert = MESSAGE_TYPES[payload.messageType].shortCommand + insert + oldMessageString;
            context.commit('updateMessageString', insert);
            context.commit('updateCursorPosition', context.getters.getMessageFieldCursorPosition + newCursorPositionOffset);
        },
        
        sendMessage: (context) => {
            if(!context.rootGetters['auth/isAuth']) return;
            let message = {};
            message.text = context.getters.getNewMessageString;
            message.type = context.getters.getNewMessageType;
            // обработка сообщения
            message.text = message.text.replace(/(&nbsp;)/ig, '').trim();
            // удаляем из текста указатель на тип сообщения
            if(message.type != MESSAGE_TYPES.Base.name) {
                let commandsPattern;
                for(let messageType in MESSAGE_TYPES) {
                    if(MESSAGE_TYPES[messageType].name != 'base') {
                        if(!commandsPattern) commandsPattern = '^';
                        else commandsPattern += '|';
                        commandsPattern += '(['+MESSAGE_TYPES[messageType].shortCommand+']|(\\/'+MESSAGE_TYPES[messageType].command+'\\s+))';
                    }
                }
                message.text = message.text.replace(new RegExp(commandsPattern, 'ig'), '');
            }
            // определяем получателей
            let recipients = [];
            let usersOnline = context.rootGetters['users/getUsersInOinline'];
            usersOnline.forEach(user => {
                if(context.getters.isMessageStringContainsUsername(user.name)) recipients.push(user.id);
            });
            let request = {
                authorName: context.rootGetters['auth/сurrentUserInfo'].name,
                authorId: context.rootGetters['auth/сurrentUserInfo'].id,
                datetime: Date.now(),
                type: message.type,
                text: message.text,
                recipients: recipients,
            };
            context.commit('addMessage', request);
            context.commit('clearMessageString');
        },

        clearMessagesList: (context) => {
            context.commit('clearMessages');
        },
    }
}