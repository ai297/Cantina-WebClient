<template>
    <div>
        <label :for="name">{{label}}</label>
        <p class="error" v-show="showError">{{errorMessage}}</p>
        <input type="password" :name="name" maxlength="18" v-bind:value="value" v-on="inputListener" @change="check" />
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
        checkStatus: function(){
            if(this.checkValue) {
                this.isValid = this.checkValue(this.value);
            } else {
                this.isValid = !(this.value.length < 5);
            }
            this.$emit('validation', {status: this.isValid, sender: this.name});
            return this.isValid;
        },
        check: function(){
            this.checkStatus();
            this.showError = !this.isValid;
        }
    },
    props: {
        name: String,
        value: String,
        errorMessage: String,
        label: String,
        checkValue: Function
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