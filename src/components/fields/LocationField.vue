<template>
    <div>
        <label :for="name">{{label}}</label>
        <p v-show="showError" class="error">Некорректное значение</p>
        <input type="text" :name="name" maxlength="32" :value="value" v-on="inputListener" @change="check" />
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            showError: false,
            isValid: true
        }
    },
    methods: {
        checkStatus: function() {
            var pattern = /^[а-я\w\s]{4,32}$/i;
            this.isValid = (pattern.test(this.value) || !this.value);
            this.$emit('validation', {status: this.isValid, sender: this.name});
            return this.isValid;
        },
        check: function(){
            this.showError = !this.checkStatus();
        }
    },
    props: {
        name: String,
        value: String,
        label: String
    },
    watch: {
        value: function(){
            this.checkStatus();
            if(this.isValid) this.showError = false;
        }
    },
    computed: {
        inputListener: function(){
            var vm = this;
            return Object.assign({},
                this.$listeners,
                {
                    input: function(event){
                        vm.$emit('input', event.target.value);
                    }
                }
            )
        }
    },
    mounted: function(){
        this.checkStatus();
    }
}
</script>