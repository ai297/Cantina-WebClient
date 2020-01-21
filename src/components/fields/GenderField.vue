<template>
    <div>
        <label :for="name">{{label}}</label>
        <span><input type="radio" name="gender" value="1" v-model.number="gender" v-on:change="$emit('change', $event.target.value)" /> Мужской</span>
        <span><input type="radio" name="gender" value="2" v-model.number="gender" v-on:change="$emit('change', $event.target.value)" /> Женский</span>
        <span><input type="radio" name="gender" value="0" v-model.number="gender" v-on:change="$emit('change', $event.target.value)" /> Не знаю</span>
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

<style scoped>
    span {
        display: inline-block;
        white-space: nowrap;
    }
</style>