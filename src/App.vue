<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {

  },
  data: function(){
    return {
    }
  },
  methods: {
  },
}

</script>

<style lang="less">
@import "./less/vars.less";
* {
    margin: 0;
    padding: 0;
    font-family: @main-font;
}
body {
    background-color: #000;
    color: @grey;
    font-size: @base-fontsize;
}
div#app {
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
}
</style>