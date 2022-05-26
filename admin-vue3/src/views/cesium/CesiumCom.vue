<template>
  <div id="container"></div>
</template>
<script lang="ts">
import * as Cesium from "cesium";
import { defineComponent, onMounted } from "vue";
export default defineComponent({
  setup() {
    onMounted(() => {
      new Cesium.Viewer('container');
    });
    return {};
  },
});
</script>
<style scoped lang="less">
#container {
  width: 100%;
  height: 100%;
}
</style>
