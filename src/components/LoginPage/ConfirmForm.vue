<template>
    <base-enter-form>
        <form @submit.prevent="sendActivation">
            <h3>Активация аккаунта</h3>
            <p :class="{errorMessage: isRequestError}">{{responseMessage}}</p>
            <div v-if="!isActivationSuccess">
                <flat-field :class="{errorField:isCodeEmpty}" placeholder="КОД АКТИВАЦИИ" type="text" v-model.trim="token" maxlength=200 autofocus />
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
import {API_URL} from '../../constants.js';

export default {
    name: "ConfirmRegistration",
    components: {
        baseEnterForm,
    },
    data: function() {
        return {
            token: '',
            defaultMessage: 'Для входа в Кантину необходимо активировать аккаунт.',
            responseMessage: '',
            isRequestError: false,
            isActivationSuccess: false,
        }
    },
    computed: {
        isCodeEmpty: function() {
            return this.token.length < 10;
        }
    },
    methods: {
        sendActivation: function() {
            this.isRequestError = false;
            this.responseMessage = this.defaultMessage;
            if(this.isCodeEmpty) return;

            this.$store.commit('showLoader', 'Активация аккаунта');

            HTTP({
                method: "put",
                url: API_URL.ACTIVATION,
                headers: {
                    "Authorization": "Bearer " + this.token,
                }
            })
            .then(response => {
                this.responseMessage = response.data;
                this.isActivationSuccess = true;
            })
            .catch((error) => {
                if(error.response !== undefined) {
                    if(error.response.status == 401) {
                        this.responseMessage = "Неверный токен.";
                    }
                    else this.responseMessage = error.response.data;
                } else this.responseMessage = 'Не удалось подключиться к серверу.';
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
        // так же подставляем код активации, если указан
        if(this.$route.query.token !== undefined) {
            this.token = this.$route.query.token;
            this.sendActivation();
        }
    }
}
</script>