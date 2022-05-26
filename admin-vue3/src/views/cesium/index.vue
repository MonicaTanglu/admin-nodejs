<template>
  <div>
    <cesium-com></cesium-com>
  </div>
</template>
<script lang="ts">
// import * as Cesium from "cesium";
// import { onMounted } from "vue";
// import { Options, Vue } from 'vue-class-component';
import CesiumCom from './CesiumCom.vue'
// @Options({
//   components: {
//     CesiumCom
//   }
// })
// export default class Cesium extends Vue {

// }
export default {
  components: {
    CesiumCom
  },
};
</script>
<style scoped lang="less">
#container {
  width: 100%;
  height: 100%;
}
</style>
