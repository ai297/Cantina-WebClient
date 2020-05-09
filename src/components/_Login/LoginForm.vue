<template>
    <base-enter-form header="Вход в Кантину">
        <form @submit.prevent="loginFormSubmit" @keypress.enter="loginFormSubmit"><div>
            <p class="errorMessage" v-show="isError">{{errorMessage}}</p>
            <div>
                <flat-field :class="{errorField:isEmailError ? validation('email') : isEmailError }" type="email" placeholder="E-MAIL" v-model.trim="request.email" />
                <flat-field :class="{errorField:isPasswordEmpty ? validation('password') : isPasswordEmpty }" type="password" placeholder="ПАРОЛЬ" maxlength="30" v-model.trim="request.password" />
                <!--<span title="Запомнить в текущем браузере?">Запомнить? <volume-button :active="request.rememberMe" @click.prevent="request.rememberMe = !request.rememberMe" bright>{{request.rememberMe ? '✔' : '✖'}}</volume-button></span>-->
            </div>
            <div>
                <flat-button @click="loginFormSubmit">Войти</flat-button>
            </div>
        </div>
            <div>
                <!--• <a href="#">Забыли пароль?</a> -->• <router-link to="/register">Регистрация</router-link> •
            </div>
        </form>
    </base-enter-form>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import baseEnterForm from './BaseFormView.vue';
import {VALIDATION_PATTERNS, ROUTING} from '../../constants.js';

export default {
    name: "LoginForm",
    components: {
        baseEnterForm,
    },
    data: function(){
        return {
            request: {
                email: '',
                password: '',
                longLife: false,
            },
            isEmailError: false,
            isPasswordEmpty: false,
            isError: false,
            errorMessage: '',
        }
    },
    computed: {
        ...mapGetters({
            authStatus: 'auth/status',
        })
    },
    methods: {
        ...mapActions({
            login: 'auth/login',
        }),
        ...mapMutations({
            showLoader: 'showLoader',
            hideLoader: 'hideLoader',
        }),
        validation: function(field) {
            if(this.request[field].match(VALIDATION_PATTERNS[field]) === null) return true;
            else return false;
        },
        loginFormSubmit: function(){
            this.isError = false;
            this.isEmailError = this.validation('email');                   // проверка email
            this.isPasswordEmpty = this.validation('password');             // проверка пароля
            if(this.isEmailError || this.isPasswordEmpty) return false;
            
            // отправка данных
            this.showLoader('Выполняем вход...');
            this.login(this.request)
            .then(() => {
                if(this.authStatus == 'Unconfirmed') this.$router.push("/activation");                          // если аккаунт не подтвержден - на страницу активации
                else if(this.authStatus == "Authorized") this.$router.push(ROUTING.IN_PAGE).catch(()=>{});      // если авторизация удалась - переходим на главную страницу
                else {
                    this.errorMessage = 'Что-то пошло не по плану...';
                    this.isError = true;
                }
            })
            .catch(error => {
                if(error.response !== undefined) {
                    this.errorMessage = error.response.data;
                }
                else this.errorMessage = 'Не удалось соединиться с сервером.';
                this.isError = true;
            })
            .finally(() => this.hideLoader());
        }
    },
}
</script>

<style lang="less" scoped>
    @import "../../less/vars.less";
    span div {
        font-size: @label-fontsize;
    }
</style>