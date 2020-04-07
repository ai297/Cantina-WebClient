<template>
    <overlay-view @click="saveSettings">
        <template v-slot:header><cantina-icons iconName="gear" /> Настройки</template>
        <p v-if="(error !== false)" class="errorInfo">{{error}}</p>
        <form @submit.prevent="updateSettings" v-if="isDataLoaded">
            <div class="settingsBlock messageSample">
                <span class="nickname" :style="getStyleString(selectedNameFontIndex, selectedNameColorIndex)">
                    {{userProfile.name}}: </span>
                <span class="message-text" :style="getStyleString(selectedMessageFontIndex, selectedMessageColorIndex)">
                    Так будет выглядеть ваше сообщение
                </span>
            </div>
            <div class="twoColumns">
                <div class="settingsBlock">
                    <label>Имя:</label>
                    <flat-field :class="{errorField: isNameInvalid ? validation('name', 'nickname') : isNameInvalid }" placeholder="Имя" maxlength="18" v-model.trim="userProfile.name" />
                    <label>Пол:</label>
                    <flat-select v-model="userProfile.gender">
                        <div v-for="(item, index) of genders" :key="index">{{item}}</div>
                    </flat-select>
                    <label>Откуда вы:</label>
                    <flat-field placeholder="Планета" maxlength="32" v-model.trim="userProfile.location" />
                    <label>О себе:</label>
                    <textarea v-model="userProfile.description" maxlength="250"></textarea>
                </div>
                <div class="settingsBlock">
                    <label>Стиль имени:</label>
                    <flat-select placeholder="Шрифт" v-model="selectedNameFontIndex">
                        <div v-for="(item, index) of fonts" :key="index" :style="(index !== 0)?`font-family: ${item};`:''">{{item}}</div>
                    </flat-select>
                    <flat-select placeholder="Цвет" v-model="selectedNameColorIndex">
                        <div v-for="(rgb, index) of colors" :key="index" :style="(index !== 0)?`background-color: rgb(${rgb[0]},${rgb[1]},${rgb[2]});`:'background: none;'" class="colorPicker">{{(index === 0)?'Стандартный':' '}}</div>
                    </flat-select>
                    <label>Стиль сообщения:</label>
                    <flat-select placeholder="Шрифт" v-model="selectedMessageFontIndex">
                        <div v-for="(item, index) of fonts" :key="index" :style="(index !== 0)?`font-family: ${item};`:''">{{item}}</div>
                    </flat-select>
                    <flat-select placeholder="Цвет" v-model="selectedMessageColorIndex">
                        <div v-for="(rgb, index) of colors" :key="index" :style="(index !== 0)?`background-color: rgb(${rgb[0]},${rgb[1]},${rgb[2]});`:'background: none;'" class="colorPicker">{{(index === 0)?'Стандартный':' '}}</div>
                    </flat-select>
                </div>
            </div>
        </form>
    </overlay-view>
</template>

<script>
import {mapActions, mapMutations} from 'vuex';
import {HTTP} from '../../http-common.js';
import {CHAT_COMMANDS, API_URL, GENDER, FONTS, COLORS, VALIDATION_PATTERNS} from '../../constants.js';
import overlayView from '../ui/OverlayView.vue';

export default {
    name: "UserSettings",
    components: {
        overlayView,
    },
    data: function(){
        return {
            genders: GENDER,
            fonts: FONTS,
            colors: COLORS,
            isDataLoaded: false,
            userProfile: {
                name: '',
                location: '',
                gender: 0,
                description: '',
                settings: {
                    messageStyle: {
                        nameFont: null,
                        messageFont: null,
                        nameColor: null,
                        messageColor: null,
                    }
                }
            },
            selectedNameFontIndex: 0,
            selectedNameColorIndex: 0,
            selectedMessageFontIndex: 0,
            selectedMessageColorIndex: 0,
            
            error: false,
            isNameInvalid: false,
        }
    },
    methods: {
        ...mapActions({
            runCommand: 'commands/run',
        }),
        ...mapMutations({
            showLoader: 'showLoader',
            hideLoader: 'hideLoader',
        }),
        validation: function(field, pattern = field) {
            if(this.userProfile[field].match(VALIDATION_PATTERNS[pattern]) === null) return true;
            else return false;
        },
        updateSettings: function() {
            return false;
        },
        getRGBCOlor: function(rgb) {
            return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
        },
        getStyleString: function(fontIndex, colorIndex) {
            let fontStyle = (fontIndex !== 0) ? `font-family: ${FONTS[fontIndex]}; ` : '';
            let colorStyle = (colorIndex !== 0) ? `color: ${this.getRGBCOlor(COLORS[colorIndex])};` : '';
            return fontStyle + colorStyle;
        },
        saveSettings: function() {
            this.error = false;
            // валидация формы
            this.isNameInvalid = this.validation('name', 'nickname');   // проверка имени
            if(this.isNameInvalid) return;

            // настройки шрифта и цвета
            let nameStyle = {};
            if(this.selectedNameFontIndex !== 0) nameStyle.font = FONTS[this.selectedNameFontIndex];
            if(this.selectedNameColorIndex !== 0) nameStyle.color = {r: COLORS[this.selectedNameColorIndex][0], g: COLORS[this.selectedNameColorIndex][1], b: COLORS[this.selectedNameColorIndex][2]};
            let messageStyle = {};
            if(this.selectedMessageFontIndex !== 0) messageStyle.font = FONTS[this.selectedMessageFontIndex];
            if(this.selectedNameColorIndex !== 0) messageStyle.color = {r: COLORS[this.selectedMessageColorIndex][0], g: COLORS[this.selectedMessageColorIndex][1], b: COLORS[this.selectedMessageColorIndex][2]};
            this.userProfile.settings = { nameStyle, messageStyle };
            // сохранение профиля
            this.showLoader('Сохраняем профиль...');
            HTTP.patch(API_URL.USERINFO, this.userProfile)
            .then(() => {
                this.runCommand({commandName: CHAT_COMMANDS.ACTION_CLOSE_MODAL});
            })
            .catch((error) => {
                // ошибка запроса
                if(error.response !== undefined) {
                    this.error = error.response.data;
                }
                else this.error = 'Не удалось соединиться с сервером.';
            })
            .finally(() => this.hideLoader());
        },
    },
    mounted: function() {
        // Загружаем данные профиля
        this.showLoader("Загрузка профиля...");
        HTTP.get(API_URL.USERINFO).then(result => {
            this.isDataLoaded = true;
            this.userProfile = result.data;
            delete this.userProfile['onlineTime'];
            delete this.userProfile['user'];
            
            // Устанавливаем настройки юзера
            let getFontIndex = function(fontName) {
                if(fontName === null) return 0;
                let fontIndex = FONTS.indexOf(fontName, 1);
                return (fontIndex >= 0) ? fontIndex : 0;
            }
            let getColorIndex = function(rgbObject) {
                if(rgbObject === null) return 0;
                let result = COLORS.findIndex((color) => {
                    return (rgbObject.r == color[0] && rgbObject.g == color[1] && rgbObject.b == color[2]);
                });
                if(result >= 0) return result;
                else {
                    COLORS.push([rgbObject.r, rgbObject.g, rgbObject.b]);
                    return COLORS.length;
                }
            }
            if(this.userProfile.settings !== null && this.userProfile.settings.hasOwnProperty('messageStyle')) {
                let settings = this.userProfile.settings.messageStyle;
                if(settings.hasOwnProperty('font')) this.selectedMessageFontIndex = getFontIndex(settings.font);
                if(settings.hasOwnProperty('color')) this.selectedMessageColorIndex = getColorIndex(settings.color);
            }
            if(this.userProfile.settings !== null && this.userProfile.settings.hasOwnProperty('nameStyle')) {
                let settings = this.userProfile.settings.nameStyle;
                if(settings.hasOwnProperty('font')) this.selectedNameFontIndex = getFontIndex(settings.font);
                if(settings.hasOwnProperty('color')) this.selectedNameColorIndex = getColorIndex(settings.color);
            }
        })
        .catch(() => {
            this.error = 'Ошибка загрузки данных';
        })
        .finally(() => {
            this.hideLoader();
        })
    }
}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";
    p.errorInfo {
        color: @red;
        padding: 1rem;
        font-weight: bold;
    }
    label {
        display: block;
        font-family: @label-font;
        font-size: @label-fontsize;
        text-align: left;
        padding-left: 1rem;
        margin-bottom: -.2rem;
    }
    textarea {
        display: block;
        position: relative;
        font-size: @input-fontsize;
        font-family: @button-font;
        box-sizing: border-box;
        width: calc(100% - .8em);
        margin: .4em;
        height: 3em;
        outline: none;
        background: none;
        border: @ui-border-width solid @gold;
        border-radius: .4em;
        transition: all .5s;
        color: @blue;
        padding: 0 @base-padding;
        &:focus {
            color: @gold;
        }
    }
    .settingsBlock {
        margin: @base-padding;
        padding: @base-padding;
        border: @base-border-width solid @blue;
        border-radius: .5rem;
        .selection-items .colorPicker {
            display: inline-block;
            width: 1.4em;
            height: 1.4em;
            border: @base-padding / 2 solid @content-bgcolor;
            margin: 0 @base-padding / 2;
            padding: 0 !important;
            overflow: hidden;
            &:hover {
                border-color: @blue;
                color: @blue;
            }
            &:first-child {
                display: block;
                width: auto;
                height: auto;
                margin: @base-padding;
            }
        }
        .selected .colorPicker {
            height: 1em;
            margin-left: @base-padding;
        }
    }
    .twoColumns {
        display: flex;
        justify-content: center;
        align-items: stretch;
        & > div {
            width: 50%;
        }
    }
    .messageSample {
        padding: @base-padding * 2;
        background-color: @content-bgcolor;
    }

    .nickname {
        color: @dark-gold;
    }
</style>