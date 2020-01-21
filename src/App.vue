<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',

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
    background-color: @body-background-color;
    color: @base-font-color;
    font-size: @base-fontsize;
}
div#app {
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
}
</style>