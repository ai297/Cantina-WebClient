<template>
    <div>
        <label :for="name">{{label}}</label>
        <input type="radio" name="gender" value="0" v-model="gender" v-on:change="$emit('change', $event.target.value)" /> Не знаю
        <input type="radio" name="gender" value="1" v-model="gender" v-on:change="$emit('change', $event.target.value)" /> Мужской
        <input type="radio" name="gender" value="2" v-model="gender" v-on:change="$emit('change', $event.target.value)" /> Женский
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            gender: this.value
        }
    },
    methods: {

    },
    model: {
        event: 'change'
    },
    props: {
        name: String,
        value: Number,
        label: String
    }
}
</script>