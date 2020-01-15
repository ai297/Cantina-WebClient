<template>
    <div id="loginForm" class="modalWindow">
        <h2>Вход в Кантину:</h2>
        <form @submit.prevent="submitForm">
            <email-field name="email" label="Ваш e-mail:" v-model="request.email" @validation="checkRequest"></email-field>
            <password-field name="password" label="Пароль:" v-model="request.password"></password-field>

            <input type="submit" value="Войти" :disabled="!isAllValid" />
        </form>
    </div>
</template>

<script>
export default {
    name: "LoginForm",
    data: function(){
        return {
            request: {
                email: '',
                password: ''
            },
            isAllValid: false
        }
    },
    methods: {
        checkRequest: function(obj) {
            this.isAllValid = obj.status;
        },
        submitForm: function(){
            
        }
    }
}
</script>

<style lang="less">
/* глобальные переменные */
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
                color: @dark-grey;
                padding: round(@base-fontsize * 0.6) round(@base-fontsize * 1.5);
                border: none;
                margin-top: @base-fontsize;
                &:hover:not(:disabled) {
                    background-color: @blue;
                    color: #ffffff;
                }
                &:disabled {
                    background-color: @grey;
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
    }
</style>