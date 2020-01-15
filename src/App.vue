<template>
  <div id="app">
    <ModalContainer :display="modal.Show"><component :is="modal.Component"></component></ModalContainer>
  </div>
</template>

<script>
// import axios from 'axios';
import ModalContainer from './components/ModalContainer.vue';

export default {
  name: 'app',
  components: {
    ModalContainer
  },
  data: function(){
    return {
      modal: {
        Component: null,
        Show: false
      }
    }
  },
  methods: {
    ShowModal: function(comp){
      this.modal.Component = comp;
      this.modal.Show = true;
    }
  },
  mounted: function(){
    //this.ShowModal("login-form");
  }
}

</script>

<style lang="less">
/* глобальные переменные */
@import "./less/vars.less";

/* Общие стили */
* {
    margin: 0;
    padding: 0;
    font-family: @main-font;
}
body {
    background-color: @dark-grey;
    color: @grey;
    font-size: @base-fontsize;
}
div#app {
  width: 100%;
}
</style>