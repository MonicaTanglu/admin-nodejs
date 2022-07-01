<template>
  <div class="m-t-10 m-b-10">
    <a-button @click="drawBox">drawRedBox</a-button>
    <a-button class="m-l-10" @click="drawByCzml">drawByCzml</a-button>
    <a-button class="m-l-10" type="primary" @click="addJX">江西省WMTS</a-button>
    <a-button class="m-l-10" type="primary" @click="flyTo">定位flyTo</a-button>
  </div>
  <div id="container"></div>
</template>
<script lang="ts">
import * as Cesium from "cesium";
import { CesiumCom } from "./CesiumCom";
import { defineComponent, onMounted, reactive } from "vue";
export default defineComponent({
  setup() {
    const state = reactive({
      viewer: {} as Cesium.Viewer,
      redBox: {} as Cesium.Entity,
      imgTileLayer: {} as Cesium.WebMapTileServiceImageryProvider,
      entity: null as unknown as Cesium.Entity,
    });
    const tileMatrixLabels = [
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
    ];
    const subdomains = ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"];
    const initMap = () => {
      // 影像
      const tdt_img_c =
        "http://{s}.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
        "&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
        "&style=default&format=tiles&tk=" +
        window.TDT_TK;
      // 标注
      const tdt_cia_c = tdt_img_c.replaceAll("img", "cia");
      // "http://{s}.tianditu.gov.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
      // "&LAYER=cia&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
      // "&style=default&format=tiles&tk=" +
      // window.TDT_TK;
      Cesium.Ion.defaultAccessToken = window.cesiumToken;
      // 坐标系是WGS84（EPSG：4326）
      const viewer = new Cesium.Viewer("container", {
        timeline: false,
        homeButton: false,
        fullscreenButton: false,
        baseLayerPicker: false, // 地形影像选择
        // infoBox: false,
        animation: false, // 左下角圆盘组件 控制时间速度启动暂停
        // shouldAnimate: false,
        // imageryProvider baseLayerPicker为false时使用imageryProvider提供的影像图
        // creditContainer: 'credit',
        imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
          url: tdt_img_c,
          // layer: "tdtImg_c",
          layer: "img",
          style: "default",
          format: "tiles",
          tileMatrixSetID: "c", // WMTS 请求TileMatrixSet的标识符
          // subdomains 用于URL模板中{s}占位符的子域 sudomains为天地图服务器
          subdomains: subdomains,
          // tillingScheme: 定义切片的方式为地理坐标系
          tilingScheme: new Cesium.GeographicTilingScheme(),
          /**
           * tileMatrixLabels 用于WMTS请求的 TileMatrix标识列表 TileMatrix显示级别
           * 要从1开始写，否则URL中计算不出来正确的级别，url中有tilematrix={TileMatrix}时
           * tilingScheme这个参数也不能缺少，否则计算不出来缩放级别
           */
          tileMatrixLabels: tileMatrixLabels,
          // maximumLevel: 50,
        }),
      });
      state.viewer = viewer;
      // 去除版权信息
      state.viewer.cesiumWidget.creditContainer.setAttribute(
        "style",
        "display:none"
      );
      viewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
          url: tdt_cia_c,
          layer: "cia",
          style: "default",
          format: "tiles",
          tileMatrixSetID: "c",
          subdomains: subdomains,
          tilingScheme: new Cesium.GeographicTilingScheme(),
          tileMatrixLabels: tileMatrixLabels,
          // maximumLevel: 50,
        })
      );
    };
    const drawBox = () => {
      if (state.viewer.entities.contains(state.redBox)) {
        state.viewer.entities.remove(state.redBox);
        return;
      }
      state.redBox = state.viewer.entities.add({
        name: "red box with black outline",
        position: Cesium.Cartesian3.fromDegrees(-107.0, 40.0, 200000), // 200000 距离底部的高度
        box: {
          dimensions: new Cesium.Cartesian3(400000, 300000, 500000),
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK,
        },
      });
      state.viewer.zoomTo(state.redBox);
    };
    const drawByCzml = () => {
      const czml = [
        {
          id: "document",
          name: "box",
          version: "1.0",
        },
        {
          id: "shape2",
          name: "yellow box with black outline",
          position: {
            cartographicDegrees: [-107.0, 40.0, 300000.0],
          },
          box: {
            dimensions: {
              cartesian: [400000.0, 300000.0, 600000.0],
            },
            material: {
              solidColor: {
                color: {
                  rgba: [65, 184, 131, 128],
                },
              },
            },
            outline: true,
            outlineColor: {
              rgba: [160, 183, 67, 255],
            },
          },
        },
      ];
      if (state.viewer.dataSources.length > 0) {
        state.viewer.dataSources.removeAll();
        return;
      }
      const dataSourcePromise = Cesium.CzmlDataSource.load(czml);
      state.viewer.dataSources.add(dataSourcePromise);
      state.viewer.zoomTo(dataSourcePromise);
    };
    const addJX = () => {
      // state.viewer.imageryLayers.removeAll();
      state.imgTileLayer = CesiumCom.addJX();
      state.viewer.imageryLayers.addImageryProvider(state.imgTileLayer);

      // 跳转
      state.viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(115.68, 27.23, 585000),
        orientation: {
          heading: Cesium.Math.toRadians(0), // 整北 方向 围绕Z轴旋转
          pitch: Cesium.Math.toRadians(-90), // 俯视 倾斜角度 围绕Y轴旋转
          roll: 0.0, // 旋转角度 围绕X轴旋转
        },
      });
    };
    let entity:Cesium.Entity;
    const flyTo = () => {
      // state.viewer.camera.flyTo({
      //   destination: Cesium.Cartesian3.fromDegrees(115.68,27.23,585000),
      //   orientation: {
      //     heading: Cesium.Math.toRadians(0), // 整北
      //     pitch: Cesium.Math.toRadians(-90), // 俯视
      //     roll: 0.0
      //   }
      // })
      console.log('state.entity')
      if (entity) {
        state.viewer.entities.remove(state.entity);
      }
      entity = new Cesium.Entity({
        id: "flyTmp",
        position: Cesium.Cartesian3.fromDegrees(110.0, 35.8),
        point: {
          pixelSize: 10,
          color: Cesium.Color.RED.withAlpha(0.9),
          outlineColor: Cesium.Color.WHITE.withAlpha(0.9),
          outlineWidth: 1,
        },
      });
      state.viewer.entities.add(entity);
      // 不知道咋回事，跳不了
      state.viewer.flyTo(entity, {
        offset: new Cesium.HeadingPitchRange(Cesium.Math.toRadians(0),Cesium.Math.toRadians(-50),500),
        duration: 2
      });
    };
    onMounted(() => {
      initMap();
      // drawByCzml();
      // drawBox();
      // new Cesium.Viewer("container");
    });
    return {
      drawBox,
      drawByCzml,
      addJX,
      flyTo,
    };
  },
});
</script>
<style scoped lang="less">
#container {
  width: 100%;
  height: 100%;
}
</style>
