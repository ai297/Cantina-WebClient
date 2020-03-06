<template>
    <base-enter-form>
        <form @submit.prevent="registerFormSubmit"><div>
            <h3>Регистрация:</h3>
            <div>
                <p class="label">Аккаунт:</p>
                <flat-field :class="{errorField: isEmailInvalid ? validation('email') : isEmailInvalid }" type="email" placeholder="E-MAIL" v-model.trim="request.email" />
                <flat-field :class="{errorField: isPasswordInvalid ? validation('password') : isPasswordInvalid }" :type="showPassword ? 'text' : 'password'" placeholder="ПАРОЛЬ" maxlength="30" v-model.trim="request.password"><a @click.prevent="showPassword = !showPassword">show</a></flat-field>
            </div>
            <div>
                <p class="label">Профиль:</p>
                <flat-field :class="{errorField: isNameInvalid ? validation('name', 'nickname') : isNameInvalid }" placeholder="Никнейм" maxlength="18" v-model.trim="request.name" />
                <flat-selection :options="$options.gender" placeholder="Пол" v-model="request.gender" />
                <flat-field :class="{errorField: isLocationInvalid ? validation('location') : isLocationInvalid }" placeholder="Откуда вы" v-model.trim="request.location" />
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
import baseEnterForm from './BaseFormView.vue';
import {VALIDATION_PATTERNS} from '../../constants.js';

export default {
    name: "RegisterForm",
    components: {
        baseEnterForm,
    },
    gender: [
        "Не определился",
        "Мужской",
        "Женский"
    ],
    data: function(){
        return {
            request: {
                email: '',
                password: '',
                name: '',
                location: '',
                gender: 0,
            },
            isError: false,
            showPassword: false,
            isEmailInvalid: false,
            isPasswordInvalid: false,
            isNameInvalid: false,
            isLocationInvalid: false,
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
            // проверка email
            this.isEmailInvalid = this.validation('email');
            // проверка пароля
            this.isPasswordInvalid = this.validation('password');
            // проверка имени
            this.isNameInvalid = this.validation('name', 'nickname');
            // проверка локации
            this.isLocationInvalid = this.validation('location');
        },
    }
}
</script>