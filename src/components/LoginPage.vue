<template>
<modal-container>
    <div id="loginForm" class="modalWindow">
        <h2>Вход в Кантину:</h2>
        <form @submit.prevent="submitForm">
            <email-field name="email" label="Ваш e-mail:" v-model="request.email" @validation="checkRequest"></email-field>
            <password-field name="password" label="Пароль:" v-model="request.password" @validation="checkRequest"></password-field>
            <p class="error" v-show="err.show">{{err.message}}</p>
            <input type="submit" value="Войти" :disabled="!isAllValid" />
            <router-link to="/register">Зарегистрироваться</router-link>
        </form>
    </div>
</modal-container>
</template>

<script>
export default {
    name: "LoginPage",
    data: function(){
        return {
            request: {
                email: '',
                password: ''
            },
            validation: {},
            isAllValid: false,
            err: {
                show: false,
                message: ''
            },
        }
    },
    computed: {
        isAuth: function() {
            return this.$store.getters['auth/isAuth'];
        },
        authError: function() {
            return this.$store.state.auth.err;
        }
    },
    methods: {
        checkRequest: function(obj) {
            this.validation[obj.sender] = obj.status;
            this.isAllValid = this.validationStatus();
        },
        validationStatus: function(){
            if(!this.validation) return false;
            var valid = true;
            for(let key in this.validation){
                valid = valid && this.validation[key];
            }
            return valid;
        },
        submitForm: function(){
            // отправка запроса на авторизащию на сервер
            this.err.show = false;
            if(!this.isAllValid) return false;
            this.isAllValid = false;
            this.$store.dispatch('auth/login', this.request)
            .then(() => {
                if(this.isAuth) {
                    this.$router.replace({name: 'main'});
                } else {
                    this.request.email = '';
                    this.request.password = '';
                    this.err.message = this.authError.message;
                    this.err.show = true;
                }
            });
        }
    }
}
</script>

<style lang="less">
    @import "../less/vars.less";

    div#loginForm {
        background-color: @gold;
        color: @dark-grey;
        form {
            width: 70%;
            display: inline-block;
            input {
                width: 100%;
                text-align: center;
                margin-bottom: round(@base-fontsize * 0.5);
                padding: 5px;
                &:focus {
                    outline: none;
                }
            }
            label {
                display: inline-block;
                width: 100%;
                text-align: left;
                margin-left: -10px;
            }
            input[type="email"], input[type="password"] {
                background: none;
                border: none;
                border-bottom: 2px solid @red;
                &:focus {
                    border-bottom-color: @blue;
                }
            }
            input[type="submit"] {
                background-color: @red;
                color: #ffffff;
                padding: round(@base-fontsize * 0.6) round(@base-fontsize * 1.5);
                border: none;
                margin-top: @base-fontsize;
                &:hover:not(:disabled) {
                    background-color: @blue;
                    color: #ffffff;
                }
                &:disabled {
                    color: @dark-grey;
                    background-color: @grey;
                    cursor: auto;
                }
            }
            div{
                display: inline-block;
                width: 100%;
            }
        }
        a {
            color: @red;
            text-decoration: none;
            font-family: @headers-font;
            font-weight: bold;
            &:hover {
                color: @dark-grey;
                text-decoration: underline;
            }
        }
        .error {
            color: @red;
            font-weight: bold;
            display: inline-block;
            width: 100%;
        }
    }
</style>