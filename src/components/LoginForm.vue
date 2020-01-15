<template>
<modal-container>
    <div id="loginForm" class="modalWindow">
        <h2>Вход в Кантину:</h2>
        <form @submit.prevent="submitForm">
            <email-field name="email" label="Ваш e-mail:" v-model="request.email" @validation="checkRequest"></email-field>
            <password-field name="password" label="Пароль:" v-model="request.password" @validation="checkRequest"></password-field>

            <input type="submit" value="Войти" :disabled="!isAllValid" />
            <router-link to="/register">Зарегистрироваться</router-link>
        </form>
    </div>
</modal-container>
</template>

<script>
import ModalContainer from './ModalContainer.vue';
export default {
    name: "LoginForm",
    data: function(){
        return {
            request: {
                email: '',
                password: ''
            },
            validation: {},
            isAllValid: false
        }
    },
    components: {
        ModalContainer
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
                    cursor: auto;
                }
            }
            div{
                display: inline-block;
                width: 100%;
                p {
                    color: @red;
                    font-weight: bold;
                    display: inline-block;
                    width: 100%;
                }
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
    }
</style>