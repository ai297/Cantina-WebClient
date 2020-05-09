<template>
    <aside-section caption="Архив">
        <p v-if="(error !== false)" class="archive__dates errorInfo">{{error}}</p>
        <div class="archive__dates month" v-for="(arch, index) in dates" :key="index">
            <h3>{{months[arch.month]}}</h3>
            <hr />
            <div class="days">
                <holo-button class="day" 
                v-for="day in daysInMonth(arch.year, arch.month)" 
                :key="arch.month + '-' + day"
                @click="loadArchive(arch, (daysInMonth(arch.year, arch.month) - day + 1))"
                :class="{'no-data-day': !hasDay(arch.days, (daysInMonth(arch.year, arch.month) - day + 1))}">
                    {{daysInMonth(arch.year, arch.month) - day + 1}}
                </holo-button></div>
        </div>
    </aside-section>
</template>

<script>
import asideSection from '../Components/BaseAsideSection.vue';
import {MONTHS, API_URL} from '../../../constants.js';

export default {
    name: "ArchiveDates",
    components: {
        asideSection,
    },
    data: function(){
        return {
            error: "Загрузка...",
            dates: [],
            months: MONTHS,
        }
    },
    methods: {
        daysInMonth: function(year, month) {
            let now = new Date();
            if(now.getUTCMonth() != month) return 33 - new Date(year, month, 33).getDate();
            else return now.getUTCDate() - 1;
        },
        hasDay: function(days, day) {
            return days.indexOf(day) > -1;
        },
        loadArchive: function(arch, day) {
            if(this.hasDay(arch.days, day)) {
                let date = `${arch.year}-${arch.month + 1}-${day}`;
                this.$router.push({name: 'archive', params: {
                    date: date
                }})
                .then(() => {
                    this.$emit('select', {date: date, page: 0});
                })
                .catch(() => {console.log('переход не выполнен')});
            }
        },

        loadData: function() {
            //запрос к апи за списком доступных дней в архиве (за последние N дней)
            this.$http.get(API_URL.ARCHIVE + "/90")
            .then(response => {
                if(Array.isArray(response.data)) {
                    this.error = '';
                    for(let i = response.data.length - 1; i >= 0; i--) {
                        let day = new Date(response.data[i]);
                        let month = day.getUTCMonth();
                        let index = this.dates.map(function(e) { return e.month; }).indexOf(month);
                        if(index < 0) {
                            this.dates.push({year: day.getUTCFullYear(), month: month, days: []});
                            index = this.dates.length - 1;
                        }
                        this.dates[index].days.push(day.getUTCDate() + 1);
                    }
                } else {
                    this.error = "Архив не найден";
                }
            })
        },
    },
    created: function() {
        this.loadData();
    }
}
</script>

<style lang="less">
    @import "../../../less/vars.less";
    
    .archive__dates {
        &.errorInfo {
            color: @red;
            font-weight: bold;
            text-align: center;
            margin: @base-padding;
        }
        &.month {
            background-color: mix(@blue, rgba(0,0,0,0), 20%);
            border-radius: @base-padding;
            margin-bottom: @base-padding;

            h3 {
                color: @light-blue;
                padding-top: @base-padding;
            }

            hr {
                border: none;
                color: @blue;
                background-color: @blue;
                height: @ui-border-width;
                text-align: center;
                width: 90%;
                margin: 0 auto;
            }

            .days {
                padding: @base-padding;
                font-size: @label-fontsize;
                text-align: left;
                .day {
                    font-weight: bold;
                    margin: @base-padding 1.1%;
                    width: 12%;
                    padding: @base-padding 0;;
                }
                .no-data-day {
                    color: @grey;
                    border-color: mix(@blue, @body-background-color, 70%);
                    font-weight: normal;
                    cursor: default;
                    background: none;
                }
                // .selected {
                //     color: @red;
                //     border-color: @blue;
                //     background: radial-gradient(mix(@red, rgba(0,0,0,0), 50%), rgba(0,0,0,0.3));;
                // }
            }
            
        }
    }

</style>