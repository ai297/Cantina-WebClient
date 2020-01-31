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
    width: 100%;
    display: flex;
    align-content: center;
    justify-content: center;
}
h1, h2, h3 {
  font-family: @headers-font;
}
h1 {
  font-size: @header1-size;
}
h2 {
  font-size: @header2-size;
}
h3 {
  font-size: @header3-size;
}

div#app {
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
}
</style>