<script>
import { MESSAGE_TYPES } from '../../../constants.js';
import messageToUserLink from './ChatMessageUserLink.vue';

export default {
    name: "MessageText",
    //functional: true,
    render: function(createElement) {
        //let message = context.props.message;
        let message = this.message;
        if(message === undefined || !message.hasOwnProperty('text')) return false;
        let text = message.text;
        let VNodes = [];                // массив всех дочерних узлов в сообщении
        // шаблон находит xml теги
        let pattern = /<(?<tag>\w+)((?:\s\/>)|(>(?<value>[\dа-я\w\s]+)<\/\1>))/i;
        let userLinkMessageType = (message.type === MESSAGE_TYPES.Privat) ? message.type : MESSAGE_TYPES.Base;

        // перебираем строку сообщения, заменяем известные теги на компоненты, неизвестные вставляем как простой текст
        // при этом сперва вставляем строку до совпадения с шаблоном как текстовую ноду
        // далее обрабатываем совпадение с шаблоном
        // и повторяем всё с начала для части строки после совпадения с шаблоном
        let match = text.match(pattern);
        while(match !== null) {
            VNodes.push(text.substring(0, match.index));
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
                    }
                    ));
                    break;
                default:
                    VNodes.push(match.groups.value);
            }
            text = text.substring(match.index + match[0].length);
            match = text.match(pattern);
        }

        VNodes.push(text.replace(/(<([^>]+)>)/ig, ""));
        
        return createElement('span', VNodes);
    },
    props: {
        message: {
            type: Object,
            default: undefined
        }
    }
}
</script>