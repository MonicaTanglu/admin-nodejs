<template>
  <div id="container"></div>
</template>
<script lang="ts">
import * as Cesium from "cesium";
import { defineComponent, onMounted } from "vue";
export default defineComponent({
  setup() {
    const initMap = () => {
      // 影像
      const tdt_img_c =
        "http://{s}.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
        "&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
        "&style=default&format=tiles&tk=" + window.TDT_TK;
      // 标注
      const tdt_cia_c =
        "http://{s}.tianditu.gov.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
        "&LAYER=cia&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
        "&style=default&format=tiles&tk=" + window.TDT_TK;
      const viewer = new Cesium.Viewer("cesiumContainer", {
        timeline: true,
        homeButton: true,
        fullscreenButton: true,
        infoBox: true,
        animation: true,
        shouldAnimate: true,
        imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
          url: tdt_img_c,
          layer: "tdtImg_c",
          style: "default",
          format: "tiles",
          tileMatrixSetID: "c",
          subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
          tilingScheme: new Cesium.GeographicTilingScheme(),
          tileMatrixLabels: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
          ],
          maximumLevel: 50,
        }),
      });

      viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({ 
        url: tdt_cia_c,
        layer: "tdtImg_c",
        style: "default",
        format: "tiles",
        tileMatrixSetID: "c",
        subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        tilingScheme: new Cesium.GeographicTilingScheme(),
        tileMatrixLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"],
        maximumLevel: 50
    }))
    };
    onMounted(() => {
      initMap()
      // new Cesium.Viewer("container");
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
