<template>
    <div id="app">
        <router-view />
        <modal-wrapper v-if="modal.show" :component="modal.component" />
        <div class="popUp-layer" v-if="popUp.show" @mousedown.self="closePopUp">
            <component :is="popUp.component" class="pop-up" v-bind="popUp.props" />
        </div>
        <loader-view v-if="loader.show" :showIcon="loader.showIcon">{{loader.text}}</loader-view>
    </div>
</template>

<script>
import loaderView from "./components/ui/LoaderView.vue";
import modalWrapper from "./components/ui/ModalWrapper.vue";
import { mapGetters, mapMutations } from "vuex";

export default {
    name: "app",
    components: {
        loaderView,
        modalWrapper
    },
    computed: {
        ...mapGetters({
            loader: "loader",
            modal: "modal",
            popUp: "popUp",
        })
    },
    methods: {
        ...mapMutations({
            closePopUp: 'closePopUp',
        }),
        
    },
    created: function() {
        // обработка ошибки доступа в axios
        this.$http.interceptors.response.use(undefined, function (err) {
            return new Promise(function () {
                if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
                    this.$store.dispatch("auth/logout")
                }
                throw err;
            });
        });
    }
};
</script>

<style lang="less">
    @import "./less/vars.less";

    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }

    ::-webkit-scrollbar-track {
        background: none;
    }

    ::-webkit-scrollbar-thumb {
        background-color: @dark-grey;
        border: 2px solid @body-background-color;
        border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: @dark-gold;
    }

    html {
        font-family: @main-font;
        font-size: @base-fontsize;
        color: @base-font-color;
    }

    a, button,
    input[type="button"],
    input[type="submit"] {
        cursor: pointer;
    }
    a {
        color: currentColor;
        text-decoration: none;
        &:hover, &:focus {
            text-decoration: underline;
            outline: none;
        }
    }

    h1, h2, h3, h4 {
        font-family: @headers-font;
    }
    h1 {
        font-size: @header1-size;
    }
    h2 {
        font-size: @header2-size;
    }
    h3 {
        font-size: @header3-size;
    }
    h2, h3 {
        line-height: 1em;
        color: @gold;
        text-shadow: 1px 1px 2px @body-background-color;
        margin: @base-padding 0;
    }

    p {
        line-height: 1em;
    }

    button {
        font-family: @button-font;
        font-size: 1em;
        padding: 0 0.5em;
        border: none;
        background: none;
        color: inherit;
        div {
            font: inherit;
            line-height: 1em;
            white-space: nowrap;
        }
        &:focus {
            outline: none;
        }
        &:active div {
            transform: translate(0, 1px);
        }
    }

    input {
        font-size: @input-fontsize;
        font-family: @button-font;
        &:focus {
            outline: none;
        }
    }

    #app {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .modal-wrapper {
        width: 100%;
        height: 100vh;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 0;
        top: 0;
    }
    .popUp-layer {
        display: block;
        position: fixed;
        z-index: 10000;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    @media screen and (max-width: 1500px), screen and (max-height: 800px) {
        html {
            font-size: @base-fontsize * 0.85;
        }
    }
    @media screen and (min-width: 2800px) and (min-height: 1600px) {
        html {
            font-size: @base-fontsize * 2;
        }
    }
</style>