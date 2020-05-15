<script>
import { MESSAGE_TYPES } from '../../../../constants.js';
import messageToUserLink from './MessageUserLink.vue';
import smile from '../Smiles/Smile.vue';

export default {
    name: "MessageText",
    functional: true,
    props: {
        message: {
            type: Object,
            default: undefined
        }
    },
    render: function(createElement, ctx) {
        let message = ctx.props.message;
        if(message === undefined || !message.hasOwnProperty('text')) return false;
        let text = message.text;
        let VNodes = [];                // массив всех дочерних узлов в сообщении
        // шаблон находит xml теги
        let pattern = /<(?<tag>\w+)((?:\s\/>)|(>(?<value>[^<]+)<\/\1>))/i;
        let userLinkMessageType = (message.type === MESSAGE_TYPES.Privat) ? message.type : MESSAGE_TYPES.Base;

        // перебираем строку сообщения, заменяем известные теги на компоненты, неизвестные вставляем как простой текст
        // при этом сперва вставляем строку до совпадения с шаблоном как текстовую ноду
        // далее обрабатываем совпадение с шаблоном
        // и повторяем всё с начала для части строки после совпадения с шаблоном
        let match = text.match(pattern);
        while(match !== null) {
            VNodes.push(createElement("span", {
                domProps: { 
                    innerHTML: text.substring(0, match.index)
                }
            }));
            switch(match.groups.tag.toLowerCase()) {
                case "author":
                    VNodes.push(createElement(messageToUserLink, {
                        props: {
                            nickname: message.authorName,
                            messageType: userLinkMessageType,
                        },
                    }
                    ));
                    break;
                case "user":
                    VNodes.push(createElement(messageToUserLink, {
                        props: {
                            nickname: match.groups.value,
                            messageType: userLinkMessageType
                        },
                    }));
                    break;
                case "smile":
                    VNodes.push(createElement(smile, {}, match.groups.value));
                    break;
                default:
                    VNodes.push(createElement("span", {
                        domProps: { 
                            innerHTML: match.groups.value
                        }
                    }));
                    //VNodes.push(match.groups.value);
            }
            text = text.substring(match.index + match[0].length);
            match = text.match(pattern);
        }
        text = text.replace(/(<([^>]+)>)/ig, "");
        VNodes.push(createElement("span", {
            domProps: { 
                innerHTML: text
            }
        }));
        
        return createElement('span', ctx.data, VNodes);
    }
}
</script>