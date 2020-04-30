<template>
    <base-modal @click="saveSettings">
        <template v-slot:header><cantina-icons iconName="gear" /> Настройки профиля</template>
        <p v-if="(error !== false)" class="userSettingsForm errorInfo">{{error}}</p>
        <form @submit.prevent="saveSettings" @keypress.enter.prevent="saveSettings" v-if="isDataLoaded" class="userSettingsForm">
            <div class="settingsBlock messageSample">
                <span class="nickname" :style="getStyleString(selectedNameFontIndex, selectedNameColorIndex)">
                    {{userProfile.name}}: </span>
                <span class="message-text" :style="getStyleString(selectedMessageFontIndex, selectedMessageColorIndex)">
                    Так будет выглядеть ваше сообщение
                </span>
            </div>
            <div class="settingsBlock">
                <label>Имя:</label>
                <flat-field :class="{errorField: isNameInvalid ? validation('name', 'nickname') : isNameInvalid }" placeholder="Имя" maxlength="18" v-model.trim="userProfile.name" />
                <label>Пол:</label>
                <flat-select v-model="userProfile.gender">
                    <div v-for="(item, index) of genders" :key="index">{{item}}</div>
                </flat-select>
                <label>Откуда вы:</label>
                <flat-field :class="{errorField: isLocationInvalid ? validation('location') : isLocationInvalid }" placeholder="Планета" maxlength="32" v-model.trim="userProfile.location" />
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
        </form>
    </base-modal>
</template>

<script>
import {mapActions, mapMutations} from 'vuex';
import {HTTP} from '../../http-common.js';
import {CHAT_COMMANDS, API_URL, GENDER, FONTS, COLORS, VALIDATION_PATTERNS, MESSAGE_TYPES} from '../../constants.js';
import baseModal from './ChatBaseModal.vue';

export default {
    name: "UserSettings",
    components: {
        baseModal
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
            loadingError: false,
            isNameInvalid: false,
            isLocationInvalid: false,
        }
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
            if(this.loadingError) {
                this.closeModal();
                return;
            }

            this.error = false;
            // валидация формы
            this.isNameInvalid = this.validation('name', 'nickname');   // проверка имени
            this.isLocationInvalid = this.validation('location');       // проверка города
            if(this.isNameInvalid || this.isLocationInvalid) return;

            // настройки шрифта и цвета
            let nameStyle = {};
            if(this.selectedNameFontIndex !== 0) nameStyle.font = FONTS[this.selectedNameFontIndex];
            if(this.selectedNameColorIndex !== 0) nameStyle.color = {r: COLORS[this.selectedNameColorIndex][0], g: COLORS[this.selectedNameColorIndex][1], b: COLORS[this.selectedNameColorIndex][2]};
            let messageStyle = {};
            if(this.selectedMessageFontIndex !== 0) messageStyle.font = FONTS[this.selectedMessageFontIndex];
            if(this.selectedNameColorIndex !== 0) messageStyle.color = {r: COLORS[this.selectedMessageColorIndex][0], g: COLORS[this.selectedMessageColorIndex][1], b: COLORS[this.selectedMessageColorIndex][2]};
            this.userProfile.settings = { nameStyle, messageStyle };
            
            // сохранение профиля
            HTTP.patch(API_URL.USERINFO, this.userProfile)
            .then((response) => {
                // если успешно
                if(response.data.length > 0) this.runCommand({commandName: CHAT_COMMANDS.ACTION_ADD_MESSAGE, payload: {
                    authorId: 0,
                    authorName: 'System',
                    dateTime: new Date(),
                    recipients: this.userProfile.userId,
                    type: MESSAGE_TYPES.Information,
                    text: response.data
                }});
            })
            .catch((error) => {
                // если ошибка
                let errorText;
                if(error.response !== undefined && typeof(error.response.data) === "string") {
                    errorText = error.response.data;
                }
                else errorText = 'Не удалось соединиться с сервером.';
                // Выводим сообщение об ошибке
                this.runCommand({commandName: CHAT_COMMANDS.ACTION_ADD_MESSAGE, payload: {
                    authorId: 0,
                    authorName: 'System',
                    dateTime: new Date(),
                    recipients: this.userProfile.userId,
                    type: MESSAGE_TYPES.Error,
                    text: "Не удалось обновить профиль. " + errorText
                }});
            });

            // закрываем окно с настройками в любом случае
            this.closeModal();
        },
    },
    beforeMount: function() {
        this.showLoader("Загрузка профиля...");
    },
    mounted: function() {
        // Загружаем данные профиля
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
            this.loadingError = true;
            setTimeout(() => this.closeModal(), 3000);
        })
        .finally(() => {
            this.hideLoader();
        })
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";
    p.userSettingsForm.errorInfo {
        color: @red;
        padding: 1rem;
        font-weight: bold;
    }
    
    .userSettingsForm {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content:stretch;
        overflow: hidden;
        overflow-y: scroll;

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
            flex-grow: 1;
            flex-shrink: 1;
            flex-basis: 45%;
            margin: @base-padding;
            padding: @base-padding;
            border: @base-border-width solid @blue;
            border-radius: .5rem;
            min-width: 12rem;
            font-size: @input-fontsize;
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
        .messageSample {
            padding: @base-padding * 2;
            background-color: @content-bgcolor;
            flex-grow: 1;
            flex-shrink: 1;
            flex-basis: 100%;
            font-size: 1rem;
        }

        .nickname {
            color: @dark-gold;
        }
    }

    @media screen and (max-width: 699px) {
        .userSettingsForm .settingsBlock:nth-child(2) label {
            display: none;
        }
    }
    
</style>