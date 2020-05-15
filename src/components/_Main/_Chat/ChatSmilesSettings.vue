<template>
    <base-modal @click="saveSettings">
        <template v-slot:header><cantina-icons iconName="smile" /> Настройка смайликов</template>
        <div class="smilesSelector">
            <ul class="menu">
                <li v-for="(item, index) in categories" :key="index" :class="{selected: activeCategory == index}"><a @click.prevent="changeActiveCategory(index)">{{item}}</a></li>
            </ul>
            <ul class="smiles">
                <li v-for="(file, index) in allSmiles[activeCategory].files" :key="`${activeCategory}-${index}`" :class="{selected: isSmileSelected(activeCategory, index)}">
                    <smile @click="selectSmile(activeCategory, index)">{{allSmiles[activeCategory].path}}{{file}}</smile>
                </li>
            </ul>
            <ul class="menu">
                <li><a @click.prevent="clearSelected">Отменить все</a></li>
                <li><a @click.prevent="resetSmiles">Вернуть стандартную подборку</a></li>
            </ul>
        </div>
    </base-modal>
</template>

<script>
import {mapActions, mapMutations, mapGetters} from 'vuex';
import {CHAT_COMMANDS, MESSAGE_TYPES} from '../../../constants.js';
import {OLD_SMILES, OLD_SMILES_DEFAULT} from '../../../old-smiles.js';
import baseModal from './ChatModalBase.vue';
import Smile from '../Components/Smiles/Smile.vue';

export default {
    name: "SmileSettings",
    components: {
        baseModal,
        Smile,
    },
    data: function(){
        return {
            selected: [],
            allSmiles: OLD_SMILES,
            activeCategory: 0,
            isReseted: false,
            isChanged: false,
        }
    },
    computed: {
        ...mapGetters({
            userId: 'auth/userId',
        }),
        categories: function() {
            let categories = [];
            for(let i in OLD_SMILES) {
                categories.push(OLD_SMILES[i].categoryName);
            }
            return categories;
        },
    },
    methods: {
        ...mapActions({
            runCommand: 'commands/run',
        }),
        ...mapMutations({
            showLoader: 'showLoader',
            hideLoader: 'hideLoader',
            closeModal: 'closeModal',
        }),
        getFileName: function(cat, smile) {
            return `${OLD_SMILES[cat].path}${OLD_SMILES[cat].files[smile]}`;
        },
        isSmileSelected: function(category, smile) {
            return this.selected.indexOf(this.getFileName(category, smile)) > -1;
        },
        changeActiveCategory: function(cat) {
            this.activeCategory = cat;
        },
        selectSmile: function(cat, smile){
            let file = this.getFileName(cat, smile);
            let index = this.selected.indexOf(file);
            if(index < 0) this.selected.push(file);
            else this.selected.splice(index, 1);
            this.isReseted = false;
            this.isChanged = true;
        },

        resetSmiles: function() {
            this.selected.splice(0, this.selected.length);
            for(let stdSm in OLD_SMILES_DEFAULT) this.selected.push(OLD_SMILES_DEFAULT[stdSm]);
            this.isReseted = true;
            this.isChanged = true;
        },

        clearSelected: function() {
            this.selected.splice(0, this.selected.length);
            this.isChanged = true;
        },

        saveSettings: function() {
            // сохраняем выбранные смайлы
            if(this.isReseted) localStorage.removeItem("favoriteSmiles");
            else localStorage.setItem("favoriteSmiles", JSON.stringify(this.selected));

            // закрываем окно с настройками в любом случае
            this.closeModal();
            this.runCommand({commandName: CHAT_COMMANDS.ACTION_SHOW_SMILES});

            if(this.isChanged) this.runCommand({commandName: CHAT_COMMANDS.ACTION_ADD_MESSAGE, payload: {
                authorId: 0,
                authorName: 'System',
                dateTime: new Date(),
                recipients: this.userId,
                type: MESSAGE_TYPES.Information,
                text: "Избранные смайлики обновлены для текущего браузера."
            }});
        },
    },
    mounted: function() {
        this.selected = (localStorage.getItem("favoriteSmiles") !== null) ? JSON.parse(localStorage.getItem("favoriteSmiles")) : OLD_SMILES_DEFAULT.slice(0);
    }
}
</script>

<style lang="less">
    @import "../../../less/vars.less";
    
    div.smilesSelector {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        width: 100%;
        ul {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: flex-start;
            justify-content: center;
            list-style: none;
            &.menu {
                flex-basis: auto;
                flex-grow: 0;
                flex-shrink: 0;
                li {
                    display: inline-block;
                    margin: @base-padding;
                    padding: @base-padding 1em;
                    border: @ui-border-width solid @blue;
                    border-radius: 1em;
                    transition: all .5s;
                    &:hover, &.selected {
                        border-color: @green;
                    }
                    a {
                        font-family: @button-font;
                        color: @blue;
                        display: inline-block;
                        &:hover, &.selected {
                            color: @green;
                            text-decoration: none;
                        }
                        &:active {
                            transform: translateY(1px);
                        }
                    }
                }
            }

            &.smiles {
                flex-grow: 1;
                flex-shrink: 1;
                overflow: hidden;
                overflow-y: scroll;
                border: @ui-border-width solid @blue;
                border-radius: .5rem;
                margin: .5em 0;
                li {
                    width: auto;
                    min-width: 2rem;
                    max-width: 4rem;
                    height: 2rem;
                    overflow: hidden;
                    margin: @base-padding/2;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    img {
                        cursor: pointer;
                        max-width: 100%;
                        max-height: 100%;
                    }
                    &.selected {
                        background-color: @dark-green;
                    }
                }
            }
        }
    }

    @media screen and (max-width: 699px) {
        ul.smilesSelector.menu {
            font-size: @label-fontsize;
        }
    }
    
</style>