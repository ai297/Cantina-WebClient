<script>
import {CHAT_COMMANDS} from '../../constants.js';
import {OLD_SMILES_DEFAULT} from '../../old-smiles.js';
import Smile from '../Smile.vue';

export default {
    functional: true,
    name: "SmilesExtendPanel",
    render: function(createElement, ctx) {

        const smiles = (localStorage.getItem("favoriteSmiles") !== null) ? JSON.parse(localStorage.getItem("favoriteSmiles")) : OLD_SMILES_DEFAULT;
        const store = ctx.parent.$store;
        let VNodes = [];
        for(let i in smiles) {
            VNodes.push(createElement(Smile, {
                on: {
                    click: () => {
                        store.dispatch('commands/run', {commandName: CHAT_COMMANDS.ACTION_INSERT_SMILE_TO_MESSAGE, payload: smiles[i]});
                    }
                }
            }, smiles[i]));
        }

        return createElement('div', {
            class: {
                'smilesExtendPanel': true,
            },
            attrs: ctx.data.attrs,
        }, VNodes);
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";
    .smilesExtendPanel {
        padding: @base-padding;
        img {
            display: inline-block;
            margin: @base-padding;
            vertical-align: baseline;
            cursor: pointer;
        }
    }
</style>