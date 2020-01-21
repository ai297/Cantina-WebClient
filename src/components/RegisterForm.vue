<template>
<modal-container>
    <div id="registerForm" class="modalWindow">
        <h2>Регистрация:</h2>
        <form @submit.prevent="submitForm">
            <email-field name="email" label="* Ваш действующий e-mail:" v-model="request.email" @validation="checkRequest"></email-field>
            <password-field name="password" label="* Придумайте пароль:" errorMessage="Пароль слишком короткий" v-model.trim="request.password" @validation="checkRequest"></password-field>
            <password-field name="repeatPassword" label="* Повторите пароль ещё раз:" errorMessage="Пароли не совпадают" :checkValue="confirmPassword" v-model.trim="repeatPassword" @validation="checkRequest"></password-field>
            <name-field name="name" label="* Никнейм (отображается в чате):" v-model="request.name" @validation="checkRequest"></name-field>

            <gender-field name="gender" label="Ваш пол:" value="0" v-model.number="request.gender"></gender-field>
            <location-field name="location" label="Откуда вы:" v-model.trim="request.location" @validation="checkRequest"></location-field>

            <input type="submit" value="Зарегистрироваться" :disabled="!isAllValid" />
        </form>
    </div>
</modal-container>
</template>

<script>
import GenderField from './fields/GenderField.vue';
import LocationField from './fields/LocationField.vue';

export default {
    name: "RegisterForm",
    components: {
        GenderField,
        LocationField,
    },
    data: function(){
        return {
            request: {
                email: '',
                password: '',
                name: '',
                gender: 0,
                location: ''
            },
            repeatPassword: '',
            validation: {},
            isAllValid: false
        }
    },
    methods: {
        confirmPassword: function(pass){
            if(!pass || !this.request.password || pass != this.request.password) return false;
            else return true;
        },
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
            if(!this.isAllValid) return false;
            // var apiUrl = "api/register";
            // HTTP.post(apiUrl, this.request).then(() => {
            //     // если регистрация прошла удачно
            //     // TODO: Заменить алерт на приличное окошко с кнопочкой OK или полем для подтверждения e-mail
            //     alert("Успешная регистрация! (TODO: Заменить алерт на приличное окошко)");
            //     this.$router.push({name: 'login', replace: true});
            // }).catch(error => {
            //     // если регистрация не удалась
            //     var message = '';
            //     if(error.response.data.message) message = error.response.status + ": " + error.response.data.message;
            //     else message = error;
            //     alert(message);
            // });
        }
    }
}
</script>

<style lang="less">
    @import "../less/vars.less";
    
    div#registerForm {
        background-color: @blue;
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
            input[type="text"], input[type="email"], input[type="password"] {
                background: none;
                border: none;
                border-bottom: 2px solid @dark-grey;
                &:focus {
                    border-bottom-color: @red;
                }
            }
            input[type="submit"] {
                background-color: @red;
                color: #ffffff;
                padding: round(@base-fontsize * 0.6) round(@base-fontsize * 1.5);
                border: none;
                margin-top: @base-fontsize;
                &:hover:not(:disabled) {
                    background-color: @gold;
                    color: @dark-grey;
                }
                &:disabled {
                    background-color: @grey;
                    cursor: auto;
                }
            }
            input[type="radio"] {
                width: auto;
                margin-left: round(@base-fontsize * 0.5);
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