<template>
    <base-modal buttonText="Закрыть" @click="close">
        <template v-slot:header>Архив сообщений</template>
        <p v-if="(error !== false)" class="archiveDateSelector errorInfo">{{error}}</p>
        <div class="archiveDateSelector">
            <div class="mounth" v-for="(arch, index) in dates" :key="index">
                <div class="header">{{mounths[arch.mounth]}}</div>
                <ul class="days">
                    <li v-for="day in daysInMonth(2020, arch.mounth)" @click="() => {if(hasDay(arch.days, day)) openArchive(arch.year, arch.mounth, day); }" :key="arch.mounth + '-' + day" :class="{active: hasDay(arch.days, day)}">{{day}}</li>
                </ul>
            </div>
        </div>
    </base-modal>
</template>

<script>
import {mapMutations} from 'vuex';
import {HTTP} from '../../http-common.js';
import {API_URL, MOUNTHS} from '../../constants.js';
import baseModal from '../ChatPage/ChatBaseModal.vue';
//import archivePage from './ArchivePage.vue';

export default {
    name: "ArchiveDatesPanel",
    components: {
        baseModal,
    },
    data: function(){
        return {
            error: false,
            dates: [],
            mounths: MOUNTHS,
        }
    },
    methods: {
        ...mapMutations({
            showModal: 'showModal',
            closeModal: 'closeModal',
            showLoader: 'showLoader',
            hideLoader: 'hideLoader',
        }),
        close: function() {
            this.closeModal();
        },
        daysInMonth: function(year, mounth) {
            return 33 - new Date(year, mounth, 33).getDate();
        },
        hasDay: function(days, day) {
            return days.indexOf(day) > -1;
        },
        openArchive: function(year, mounth, day) {
            let date = `${year}-${mounth + 1}-${day}`;
            console.log(date);
        },

        loadData: function() {
            // запрос к апи за списком доступных дней в архиве (за последние N дней)
            HTTP.get(API_URL.ARCHIVE + "/60")
            .then(response => {
                if(Array.isArray(response.data)) {
                    this.test = response.data;
                    for(let dt of response.data) {
                        let day = new Date(dt);
                        let mounth = day.getUTCMonth();
                        let index = this.dates.map(function(e) { return e.mounth; }).indexOf(mounth);
                        if(index < 0) {
                            this.dates.push({year: day.getUTCFullYear(), mounth: mounth, days: []});
                            index = this.dates.length - 1;
                        }
                        this.dates[index].days.push(day.getUTCDate() + 1);
                    }
                } else {
                    this.error = "Архив не найден";
                }
            })
            .finally(() => {
                this.hideLoader();
            });
        },
    },
    beforeMount: function() {
        this.showLoader("Запрос данных...");
    },
    mounted: function() {
        this.loadData();
    }
}
</script>

<style lang="less">
    @import "../../less/vars.less";

    .archiveDateSelector {
        width: 100%;

        p.errorInfo {
            color: @red;
            font-weight: bold;
            text-align: center;
        }

        .mounth {
            display: flex;
            flex-direction: row;
            width: 100%;
            align-items: flex-start;
            justify-content: left;
            text-align: left;
            .header {
                flex-grow: 0;
                flex-shrink: 0;
                flex-basis: 33%;
                text-align: center;
                font-family: @label-font;
                line-height: 2em;
                color: @blue;
            }
            ul.days {
                flex-grow: 1;
                display: block;
                border: @base-border-width solid @blue;
                border-radius: .5rem;
                box-sizing: border-box;
                padding: @base-padding;
                li {
                    list-style: none;
                    display: flex;
                    float: left;
                    width: 2em;
                    height: 2em;
                    background-color: @dark-blue;
                    margin: @base-padding;
                    align-items: center;
                    justify-content: center;
                    color: @blue;
                    border-radius: 50%;

                    &.active {
                        background-color: @blue;
                        color: @dark-blue;
                        cursor: pointer;
                        font-weight: bold;
                        &:hover {
                            background-color: @green;
                        }
                    }
                }
            }
        }
    }
    @media screen and (max-width: 699px) {
        .archiveDateSelector {
            .mounth {
                flex-direction: column;
                width: 100%;
                align-items: center;
                justify-content: center;
                text-align: center;
                .header {
                    flex-basis: auto;
                }
            }
        }
    }
</style>