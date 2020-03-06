<template>
    <base-enter-form>
        <form>
            <h3>Активация аккаунта</h3>
            <p>Для входа в Кантину активируйте ваш аккаунт:</p>
            <div>
                <flat-field placeholder="КОД АКТИВАЦИИ" />
                <flat-button>Активировать</flat-button>
            </div>
            <p class="label">
                В период тестирования доступ к Кантине ограничен. Получить код для активации аккаунта вы можете у Ветра.
            </p>
        </form>
    </base-enter-form>
</template>

<script>
import baseEnterForm from './BaseFormView.vue';
export default {
    name: "ConfirmRegistration",
    components: {
        baseEnterForm,
    }
}
</script>