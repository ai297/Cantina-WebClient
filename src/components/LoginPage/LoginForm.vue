<template>
    <base-enter-form>
        <form @submit.prevent="loginFormSubmit"><div>
            <h3>Вход в Кантину:</h3>
            <div>
                <flat-field :class="{errorField:isEmailError ? validation('email') : isEmailError }" type="email" placeholder="E-MAIL" v-model.trim="request.email" />
                <flat-field :class="{errorField:isPasswordEmpty ? validation('password') : isPasswordEmpty }" type="password" placeholder="ПАРОЛЬ" maxlength="30" v-model.trim="request.password" />
            </div>
            <div>
                <p class="errorMessage" v-show="isError">{{errorMessage}}</p>
            </div>
            <div>
                <flat-button @click="loginFormSubmit">Войти</flat-button>
            </div>
        </div>
            <div>
                <a href="#">Забыли пароль?</a> • <router-link to="/register">Регистрация</router-link>
            </div>
        </form>
    </base-enter-form>
</template>

<script>
import baseEnterForm from './BaseFormView.vue';
import {VALIDATION_PATTERNS, MAIN_PAGE} from '../../constants.js';

export default {
    name: "LoginForm",
    components: {
        baseEnterForm,
    },
    data: function(){
        return {
            request: {
                email: '',
                password: ''
            },
            isEmailError: false,
            isPasswordEmpty: false,
            isError: false,
            errorMessage: '',
        }
    },
    methods: {
        validation: function(field) {
            if(this.request[field].match(VALIDATION_PATTERNS[field]) === null) return true;
            else return false;
        },
        loginFormSubmit: function(){
            this.isError = false;
            // проверка email
            this.isEmailError = this.validation('email');
            // проверка пароля
            this.isPasswordEmpty = this.validation('password');
            if(this.isEmailError || this.isPasswordEmpty) return false;
            // загрузчик
            this.$store.commit('showLoader', 'Авторизация...');
            // отправка данных
            this.$store.dispatch('auth/login', this.request).then((isAuth) => {
                if(!isAuth) {
                    this.errorMessage = this.$store.state.auth.err.message;
                    this.isError = true;
                } else {
                    this.isError = false;
                    this.$router.push(MAIN_PAGE);
                }
            }).catch(()=>{
                this.errorMessage = 'Что-то сломалось';
                this.isError = true;
            }).finally(() => {
                this.$store.commit('hideLoader');
            });
        }
    }
}
</script>