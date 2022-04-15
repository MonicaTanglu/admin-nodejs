<template>
  <div>
    <p>
      <label id="scale">1:{{ scale }}</label>
    </p>
    <div id="map" ref="map" class="map">
      <div class="legend" id="legend"></div>
    </div>
  </div>
</template>
<script lang="ts">
import "ol/ol.css";
import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import { Map, View } from "ol";
// import Tile from "ol/layer/Tile";
// import TileWMS from "ol/source/TileWMS";
// import OSM from "ol/source/OSM";
import { Projection, METERS_PER_UNIT } from "ol/proj";
import ImageWMS from "ol/source/ImageWMS";
import Image from "ol/layer/Image";
// import Style from "ol/style/Style"
// import Circle from "ol/style/Circle"
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
// import KML from "ol/format/KML";
import GeoJSON from "ol/format/GeoJSON";
import { Fill, Style, Circle, Text } from "ol/style";
import { getVectorContext } from "ol/render";
import { defaults as defaultControls } from "ol/control";
import { LegendControl, getSldXml, transformColor } from "./LegendControl";
// import Extent from 'ol/extent'
// import { getSld } from "@/api/geoApi";
// const gldLegend = {
//   fill: {
//     "小于4.5": "#FF0000",
//     "4.5-5.0": "#FC6900", // >=4.5 && <5.0
//     "5.0-5.5": "#FCAB00",
//     "5.5-6.0": "#F5F500",
//     "6.0-6.5": "#BAF700",
//     "6.5-7.0": "#81F819",
//     ">=7.0": "#10F500",
//   },
// };
// const xzqLegend = {
//   border: {
//     市: "#1C9E78",
//     县: "#D95F02", // >=4.5 && <5.0
//     乡: "#7F7AB9",
//   },
//   fill: {
//     市: "#1C9E78",
//     县: "#D95F02", // >=4.5 && <5.0
//     乡: "#7F7AB9",
//   },
// };
export default defineComponent({
  setup() {
    const state = reactive({
      test: null as unknown,
      scale: 0,
      graphicUrl: "",
      legendObj: {}, // gld
      xzqLegendObj: {},
      map: null as any,
      start: 0,
    });
    const map = ref();
    let scale = 0.02;
    const getPointFillColor = (num) => {
      let color =
        state.legendObj["point"][state.legendObj["point"].length - 1].fill;
      for (let item of state.legendObj["point"]) {
        let numStr = item.name.match(/\d+\.\d+/)[0];
        if (num >= parseFloat(numStr)) {
          color = item.fill;
          break;
        }
      }
      return color;
    };
    // const getSldXml = async (url, cb) => {
    //   let data = await getSld(url);
    //   let legendObj = {};
    //   let result = data.replaceAll("sld:", "");
    //   const xmlStyle = new DOMParser().parseFromString(result, "text/xml");
    //   const userStyleDom = xmlStyle.getElementsByTagName("UserStyle").item(0);
    //   const featureTypeStyleDom =
    //     userStyleDom?.getElementsByTagName("FeatureTypeStyle");
    //   for (let i = 0, l = featureTypeStyleDom?.length || 0; i < l; i++) {
    //     let rulesDom = featureTypeStyleDom
    //       ?.item(i)
    //       ?.getElementsByTagName("Rule");
    //     for (let q = 0, rl = rulesDom?.length || 0; q < rl; q++) {
    //       const name = rulesDom
    //         ?.item(q)
    //         ?.getElementsByTagName("Name")
    //         .item(0)?.innerHTML;
    //       const pointBl = rulesDom
    //         ?.item(q)
    //         ?.getElementsByTagName("PointSymbolizer");
    //       let type = "";
    //       if (pointBl && pointBl.length > 0) type = "point";
    //       else {
    //         const lineBl = rulesDom
    //           ?.item(q)
    //           ?.getElementsByTagName("LineSymbolizer");
    //         if (lineBl && lineBl.length > 0) type = "line";
    //         else {
    //           const polygonBl = rulesDom
    //             ?.item(q)
    //             ?.getElementsByTagName("PolygonSymbolizer");
    //           if (polygonBl && polygonBl.length > 0) type = "polygon";
    //           else break;
    //         }
    //       }
    //       const fillDom = rulesDom?.item(q)?.getElementsByTagName("Fill");
    //       const strokeDom = rulesDom?.item(q)?.getElementsByTagName("Stroke");
    //       legendObj[type] = legendObj[type] || [];
    //       // 填充
    //       let cssDoms = fillDom?.item(0)?.children || [];
    //       const nameObj = { name: name };
    //       for (let cssDom of cssDoms) {
    //         if (cssDom.getAttribute("name") === "fill") {
    //           nameObj["fill"] = cssDom.innerHTML;
    //           break;
    //         }
    //       }
    //       // 线条
    //       cssDoms = strokeDom?.item(0)?.children || [];
    //       for (let cssDom of cssDoms) {
    //         if (cssDom.getAttribute("name") === "stoke") {
    //           nameObj["stoke"] = cssDom.innerHTML;
    //           break;
    //         }
    //       }
    //       legendObj[type].push(nameObj);
    //     }
    //   }
    //   cb(legendObj);
    //   console.log(legendObj, "xmlStyle", xmlStyle);
    // };
    // getSldXml("/test/styles/gld.sld", (v) => (state.legendObj = v));

    const newMap = () => {
      const untiled = new Image({
        visible: true,
        properties: { name: "行政区" },
        source: new ImageWMS({
          url: "http://localhost:8080/geoserver/test/wms",
          params: {
            LAYERS: "test:jiangxi_province",
          },
        }),
      });
      const pointSource = new VectorSource({
        url: "http://localhost:8080/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json&typeName=test:2018gld",
        format: new GeoJSON(),
      });
      const pointVector = new VectorLayer({
        visible: true,
        properties: { name: "过录点" },
        source: pointSource,
        style: function (feature) {
          console.log(feature.getGeometry());
          const ph = feature.get("土壤ph");

          const style = new Style({
            text: new Text({
              offsetY: 10,
              font: "16px '宋体'",
              text:
                state.scale < 172000 ? "ph:" + Math.round(ph * 100) / 100 : "",
            }),
          });
          return style;
        },
      });
      pointSource.on("featuresloadend", (features) => {
        if (!features.features) return;
        for (let feature of features.features) {
          const ph = feature.get("土壤ph");
          const style = new Style({
            image: new Circle({
              fill: new Fill({
                color: getPointFillColor(ph),
              }),
              // scale: Math.random(),
              radius: 4,
            }),
          });
          feature.setStyle(style);
        }
      });
      // const duration = 3000

      state.map = new Map({
        target: "map",
        controls: defaultControls().extend([
          new LegendControl(
            [
              { layer: pointVector, legendConfig: state.legendObj },
              { layer: untiled, legendConfig: state.xzqLegendObj },
            ],
            {
              element: document.getElementById("legend"),
            }
          ),
        ]),
        layers: [pointVector, untiled],
        view: new View({
          projection: new Projection({
            code: "EPSG:4527",
            units: "m",
            axisOrientation: "neu",
          }),
          center: [39361340, 3011742.5],
          zoom: 7,
        }),
      });

      const animate = (event) => {
        if (state.scale > 108216) return;
        if (scale >= 1) {
            scale = 0.02;
        }
        const extent = event.frameState.extent;
        const features = event.target.getSource()?.getFeaturesInExtent(extent);
        const vectorContext = getVectorContext(event);
        // const elapsed = event.frameState.time - state.start;
        for (let feature of features) {
          // const random = Math.random();
          const color = feature.getStyle().getImage().getFill().getColor();
          const colorstr = transformColor(color);

          const style = new Style({
            image: new Circle({
              radius: 20,
              scale: scale,
              fill: new Fill({
                color: "rgba(" + colorstr + (1 - scale) + ")",
              }),
            }),
          });
          vectorContext.setStyle(style);
          vectorContext.drawGeometry(feature.getGeometry().clone());
        }
        state.map.render();
        scale = scale + 0.01
        // state.start = Date.now();
      };
      // pointVector.on("change:extent", (e) => {
      //   console.log("extent", e);
      // });
      pointVector.on("postrender", animate);
      // state.map.getView().on("change:resolution", (e) => {
      //   console.log("size",e.target.getState(),e.target.getProjection().getExtent(),e);
      // });
      state.map.on("postrender", (mapRes) => {
        const resolution = mapRes.frameState.viewState.resolution;
        const units = mapRes.frameState.viewState.projection.getUnits();
        const dpi = 25.4 / 0.28;
        const mpu = METERS_PER_UNIT[units];
        const scale = resolution * mpu * 39.37 * dpi;
        state.scale = Math.round(scale);
      });
    };
    getSldXml("/test/styles/shi.sld", (v) => (state.xzqLegendObj = v));
    onMounted(() => {
      getSldXml("/test/styles/gld.sld", (v) => {
        state.legendObj = v;
        newMap();
      });
    });

    return {
      ...toRefs(state),
      map,
    };
  },
});
</script>
<style lang="less">
#map {
  width: 100%;
  height: 700px;
  position: relative;
}
.legend {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 200px;
  max-height: 700px;
  overflow-y: scroll;
  z-index: 10;
  background: rgba(65, 184, 131, 0.5);
  box-sizing: border-box;
  padding: 10px 16px 20px 16px;
  h4 {
    font-weight: bold;
    margin: 10px 0;
  }
  table {
    border: 0;
    border-collapse: collapse;
    border-spacing: 0;
    line-height: 0;
    width: 100%;
    td {
      text-align: left;
    }
    tr {
      td:first-child {
        width: 36px;
        height: 36px;
      }
    }
  }
}
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0px;
  /*高宽分别对应横竖滚动条的尺寸*/
  // height: 1px;
}
</style>