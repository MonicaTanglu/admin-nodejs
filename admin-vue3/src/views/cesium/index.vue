<template>
  <div id="container"></div>
</template>
<script lang="ts">
import "_CES/Widgets/widgets.css";
// @ts-ignore
// import * as Cesium from "_CES/Cesium";
// const Cesium = require("_CES/Cesium");
import * as Cesium from "cesium";

export default {
  name: 'HelloCesium',
  mounted () {
    new Cesium.Viewer('container');
  }
}
</script>
<style scoped lang="less">
// @import  "~cesium/Build/Cesium/Widgets/widgets.css";
#container {
  width: 100%;
  height: 100%;
}
</style>
