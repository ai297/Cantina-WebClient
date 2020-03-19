<template>
    <base-enter-form>
        <form @submit.prevent="sendActivation">
            <h3>Активация аккаунта</h3>
            <p :class="{errorMessage: isRequestError}">{{responseMessage}}</p>
            <div v-if="!isActivationSuccess">
                <flat-field :class="{errorField:isEmailError ? validation : isEmailError }" type="email" placeholder="E-MAIL" v-model.trim="request.email" />
                <flat-field :class="{errorField:isCodeError ? isCodeEmpty : isCodeError }" placeholder="КОД АКТИВАЦИИ" type="text" v-model.trim="request.activationCode" />
                <flat-button>Активировать</flat-button>
            </div>
            <p v-else><router-link to="/login">Войти в Кантину</router-link></p>
            <p class="label">
                В период тестирования доступ к Кантине ограничен. Получить код для активации аккаунта вы можете у Ветра.
            </p>
        </form>
    </base-enter-form>
</template>

<script>
import {HTTP} from '../../http-common.js';
import baseEnterForm from './BaseFormView.vue';
import {VALIDATION_PATTERNS, API_URL} from '../../constants.js';

export default {
    name: "ConfirmRegistration",
    components: {
        baseEnterForm,
    },
    data: function() {
        return {
            request: {
                email: '',
                activationCode: ''
            },
            isEmailError: false,
            isCodeError: false,
            defaultMessage: 'Для входа в Кантину необходимо активировать аккаунт.',
            responseMessage: '',
            isRequestError: false,
            isActivationSuccess: false,
        }
    },
    computed: {
        validation: function() {
            return this.request.email.match(VALIDATION_PATTERNS.email) === null;
        },
        isCodeEmpty: function() {
            return this.request.activationCode.length < 10;
        }
    },
    methods: {
        sendActivation: function() {
            this.isRequestError = false;
            this.responseMessage = this.defaultMessage;
            this.isEmailError = this.validation;
            this.isCodeError = this.isCodeEmpty;
            if(this.isEmailError || this.isCodeError) return;

            this.$store.commit('showLoader', 'Активация аккаунта');

            HTTP.put(API_URL.activation, this.request)
            .then(response => {
                this.responseMessage = response.data;
                this.isActivationSuccess = true;
            })
            .catch((error) => {
                if(error.response !== undefined) {
                    this.responseMessage = error.response.data;
                } else this.responseMessage = 'Не удалось подключиться к серверу';
                this.isRequestError = true;
                this.isActivationSuccess = false;
            })
            .finally(() => {
                this.$store.commit('hideLoader');
            });
        }
    },
    mounted: function() {
        this.responseMessage = this.defaultMessage;
        // если в запросе уже указан нужный email - подставляем
        if(this.$route.query.email !== undefined) this.request.email = this.$route.query.email;
        // так же подставляем код активации, если указан
        if(this.$route.query.code !== undefined) this.request.activationCode = this.$route.query.code;
        // если форма уже заполнена - автоматом отправляем её
        if(!this.validation && !this.isCodeEmpty) this.sendActivation();
    }
}
</script>