<template>
    <base-enter-form>
        <form @submit.prevent="registerFormSubmit"><div>
            <h3>Регистрация:</h3>
            <div>
                <p class="errorMessage" v-show="isError">{{errorMessage}}</p>
            </div>
            <div>
                <flat-field :class="{errorField: isEmailInvalid ? validation('email') : isEmailInvalid }" type="email" placeholder="E-MAIL" v-model.trim="request.email" />
                <flat-field :class="{errorField: isPasswordInvalid ? validation('password') : isPasswordInvalid }" :type="showPassword ? 'text' : 'password'" placeholder="ПАРОЛЬ" maxlength="30" v-model.trim="request.password"><a @click.prevent="showPassword = !showPassword" title="Показать/Скрыть">⊛</a></flat-field>
                <flat-field :class="{errorField: isNameInvalid ? validation('name', 'nickname') : isNameInvalid }" placeholder="Никнейм" maxlength="18" v-model.trim="request.name" />
            </div>
            <div>
                <flat-button >Зарегистрироваться</flat-button>
            </div>
            <div>
                <router-link to="/login">Вернуться к авторизации</router-link>
            </div>
        </div></form>
    </base-enter-form>
</template>

<script>
import {HTTP} from '../../http-common.js';
import baseEnterForm from './BaseFormView.vue';
import {VALIDATION_PATTERNS, API_URL} from '../../constants.js';

export default {
    name: "RegisterForm",
    components: {
        baseEnterForm,
    },
    data: function(){
        return {
            request: {
                email: '',
                password: '',
                name: '',
            },
            isError: false,
            errorMessage: '',
            showPassword: false,
            isEmailInvalid: false,
            isPasswordInvalid: false,
            isNameInvalid: false,
        }
    },
    
    methods: {
        validation: function(field, pattern = field) {
            if(this.request[field].match(VALIDATION_PATTERNS[pattern]) === null) return true;
            else return false;
        },
        registerFormSubmit: function(){
            // ВАЛИДАЦИЯ //
            this.isError = false;
            this.isEmailInvalid = this.validation('email');             // проверка email
            this.isPasswordInvalid = this.validation('password');       // проверка пароля
            this.isNameInvalid = this.validation('name', 'nickname');   // проверка имени
            if(this.isEmailInvalid || this.isPasswordInvalid || this.isNameInvalid || this.isLocationInvalid) return;
            
            // Запрос на регистрацию
            this.$store.commit('showLoader', 'Регистрация...');
            HTTP.post(API_URL.REGISTER, this.request)
            .then(() => {
                // успешная регистрация
                this.$router.push("/activation");
            })
            .catch((error) => {
                // ошибка запроса
                if(error.response !== undefined) {
                    this.errorMessage = error.response.data;
                }
                else this.errorMessage = 'Не удалось соединиться с сервером.';
                this.isError = true;
            })
            .finally(()=>{
                this.$store.commit('hideLoader');
            });
        },
    }
}
</script>