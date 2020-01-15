<template>
    <div>
        <label :for="name">{{label}}</label>
        <p class="error" v-show="showError">{{errorMessage}}</p>
        <input type="password" :name="name" maxlength="18" v-bind:value="value" v-bind="$attr" v-on="inputListener" />
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
            if(this.errorMessage) this.showError = !this.checkStatus();
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
            this.check();
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