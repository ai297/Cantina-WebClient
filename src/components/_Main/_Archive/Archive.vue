<template>
    <div class="archive-page"
            :class="{hideSideBar: !isShowSidebar && !isMinWidth() }"
            :style="{'flex-direction': (reverseDirection && !isMinWidth()) ? 'row-reverse' : 'row'}">
        <div class="archive-main">
            <h2>История сообщений{{(data.date !== undefined) ? ` за ${archiveDate}г.` : ''}}</h2>
            <p class="error" v-if="error !== false">{{error}}</p>
            <div class="messages">
                <chat-message v-for="(item, index) in data.messages" :key="'message-'+index" :message="item" />
                <p v-if="data.date === undefined || data.date.length == 0">Нет сообщений</p>
            </div>
            <div class="pagination" v-if="data.all > messagesOnPage">
                Страницы: <a v-for="p in pages + 1" :key="'page'+p" @click="gotoPage(p-1)" :class="{active: (p - 1) == page}">{{p}}</a>
            </div>
        </div>
        <main-aside :class="{'aside': true, 'auto-show': isAutoShow}" >
            <archive-dates @select="updateArchive" />
            <template v-slot:bottom>
                <settings-panel />
            </template>
        </main-aside>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
import { API_URL } from '../../../constants';
import mainAside from '../Aside.vue';
import archiveDates from './ArchiveDates.vue';
import settingsPanel from '../Components/SettingsPanel.vue';
import chatMessage from '../Components/Messages/Message.vue';

export default {
    name: "ArchivePage",
    components: {
        mainAside,
        archiveDates,
        settingsPanel,
        chatMessage,
    },
    data: function() {
        return {
            isAutoShow: false,

            date: undefined,
            page: 0,
            data: {},
            messagesOnPage: 200,

            error: false,
        }
    },
    computed: {
        ...mapGetters({
            isMinWidth: 'isMinWidth',
            reverseDirection: 'chat/isReversedDirection',
            isShowSidebar: 'chat/isShowSidebar',
        }),
        archiveDate: function() {
            if(this.data.hasOwnProperty('date')) {
                let d = new Date(this.data.date);
                let day = d.getDate();
                let month = d.getMonth() + 1;
                month = (month < 10)? '0' + month : month;
                return `${day}.${month}.${d.getFullYear()}`;
            } else return '';
        },
        pages: function() {
            return Math.floor(this.data.all / this.messagesOnPage);
        }
    },
    watch: {
        isShowSidebar: function(val) {
            if(val) this.isAutoShow = false;
            else setTimeout(() => this.isAutoShow = true, 1500);
        },
    },
    methods: {
        ...mapMutations({
            showLoader: 'showLoader',
            hideLoader: 'hideLoader',
        }),
        loadData: function() {
            this.showLoader('Загрузка...');
            this.error = false;
            
            let d = this.date !== undefined ? '/' + this.date : '';
            d += this.page > 0 ? '/' + this.page : '';

            return new Promise((resolve, reject) => {
                this.$http.get(API_URL.ARCHIVE + `/messages/${this.messagesOnPage}${d}`)
                .then((response) => {
                    this.data = response.data;
                    resolve();
                })
                .catch(() => {
                    this.error = "Не удалось загрузить архив";
                    reject();
                })
                .finally(() => {
                    this.hideLoader();
                })
            });
        },
        updateArchive: function({date, page}) {
            this.date = date;
            this.page = page;
            this.loadData();
        },
        gotoPage: function(p) {
            if(this.page != p) this.$router.push({name: 'archive', params: {
                date: this.date,
                page: p
            }})
            .then(() => {
                this.updateArchive({date: this.date, page: p});
            })
            .catch(() => {});
        }
    },
    created: function() {
        this.isAutoShow = !this.isShowSidebar;
        if(this.$route.params.hasOwnProperty('date') && this.$route.params.date !== undefined) this.date = this.$route.params.date;
        if(this.$route.params.hasOwnProperty('page') && this.$route.params.page !== undefined) this.page = this.$route.params.page;
        this.loadData();
    },
}
</script>

<style lang="less">
    @import "../../../less/vars.less";
    .archive-page {
        justify-content: flex-start;
        align-items: stretch;

        .archive-main {
            flex-grow: 1;
            flex-shrink: 1;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: flex-start;
            margin: @base-padding;
            
            h2 {
                margin-top: .5em;
                flex-grow: 0;
                flex-shrink: 0;
                text-align: center;
            }
            p.error {
                color: @red;
                font-weight: bold;
            }
            .messages {
                flex-grow: 1;
                flex-shrink: 0;
                height: 5rem;
                overflow: hidden;
                overflow-y: scroll;
                border: @base-border-width solid mix(@blue, @body-background-color, 70%);
                background-color: mix(@content-bgcolor, rgba(0,0,0,0), 70%);
                border-radius: @base-padding;
                padding: .5rem;
                padding-left: .5rem + @base-padding;
                p {
                    text-align: center;
                }
            }
            .pagination {
                text-align: center;
                font-family: @label-font;
                color: @system-font-color;

                a {
                    display: inline-block;
                    margin: 0 @base-padding;
                    &.active {
                        color: @blue;
                        font-weight: bold;
                    }
                }
            }
        }

        .aside {
            flex-grow: 0;
            flex-shrink: 0;
            width: 22vw;
            min-width: 16.5rem;
            max-width: 20rem;
            transition: all .5s;
            text-align: center;
        }

        &.hideSideBar {
            .aside {
                min-width: 0rem;
                width: 0vw;
                &.auto-show:hover {
                    width: 22vw;
                    min-width: 16.5rem;
                }
            }
        }
    }

    @media screen and (max-width: 699px) {
        div.archive-page {
            .archive-main {
                flex-shrink: 0;
                padding: 0;
                margin: 0;
                flex-basis: 100%;
                border: 0;
            }
            .aside {
                flex-basis: 100%;
                flex-shrink: 0;
                max-width: unset;
            }
        }
    }
</style>