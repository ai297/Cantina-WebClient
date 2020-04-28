<template>
    <base-enter-form>
        <form @submit.prevent="loginFormSubmit"><div>
            <h3>Вход в Кантину:</h3>
            <p class="errorMessage" v-show="isError">{{errorMessage}}</p>
            <div>
                <flat-field :class="{errorField:isEmailError ? validation('email') : isEmailError }" type="email" placeholder="E-MAIL" v-model.trim="request.email" />
                <flat-field :class="{errorField:isPasswordEmpty ? validation('password') : isPasswordEmpty }" type="password" placeholder="ПАРОЛЬ" maxlength="30" v-model.trim="request.password" />
            </div>
            <div>
                <flat-button>Войти</flat-button>
            </div>
        </div>
            <div>
                <!--• <a href="#">Забыли пароль?</a> -->• <router-link to="/register">Регистрация</router-link> •
            </div>
        </form>
    </base-enter-form>
</template>

<script>
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
            
            // отправка данных
            this.$store.commit('showLoader', 'Авторизация...');
            this.$store.dispatch("auth/login", this.request)
            .then(() => {
                let result = this.$store.state.auth.auth;
                if(result.isAuth) this.$router.push(ROUTING.IN_PAGE);
                else {
                    switch(result.type) {
                        case "activation":
                            this.$router.push("/activation");
                            break;
                        case "error":
                            this.errorMessage = result.text;
                            this.isError = true;
                            break;
                    }
                }
            })
            .finally(() => {
                this.$store.commit('hideLoader');
            });
        }
    }
}
</script>