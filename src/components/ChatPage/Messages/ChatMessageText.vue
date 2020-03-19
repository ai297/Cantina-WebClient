<script>
import { MESSAGE_TYPES } from '../../../constants.js';
import messageToUserLink from './ChatMessageUserLink.vue';

export default {
    name: "MessageText",
    render: function(createElement) {
        if(!this.message.hasOwnProperty('text')) return false;
        let VNodes = [];                // массив всех дочерних узлов в сообщении
        let varsPattern = /<(\d)>/;     // шаблон для поиска в тексте сообщения переменных вида <x>

        // рекурсивная функция поиска переменных в тексте сообщения
        let replacer = (text) => {
            var match = text.match(varsPattern);
            if(match == null) VNodes.push(text);
            else {
                VNodes.push(text.substring(0, match.index));
                // Переменную <0> - меняем на имя автора сообщения
                let linkMessageType;
                if(this.message.type == MESSAGE_TYPES.Base.name ||
                this.message.type == MESSAGE_TYPES.Privat.name) {
                    linkMessageType = this.message.type;
                } else linkMessageType = MESSAGE_TYPES.Base.name;
                
                if(match[1] == 0) VNodes.push(createElement(messageToUserLink, {
                    props: {
                        nickname: this.message.authorName,
                        messageType: linkMessageType
                    },
                }));
                else VNodes.push(match[0]);
                
                let nextIndex = match.index + match[0].length;
                if(nextIndex < text.length) {
                    replacer(text.substring(nextIndex));
                } else VNodes.push(text.substring(nextIndex));
            }
        }
        replacer(this.message.text);

        return createElement('span', VNodes);
    },
    props: {
        message: Object
    }
}
</script>