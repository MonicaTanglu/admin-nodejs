<template>
  <div>
    <p>
      <label id="scale">1:{{ scale }}</label>
    </p>
    <div id="map" ref="map" class="map"></div>
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
const gldLegend = {
  "<4.5": "#FF0000",
  "4.5-5.0": "#FC6900", // >=4.5 && <5.0
  "5.0-5.5": "#FCAB00",
  "5.5-6.0": "#F5F500",
  "6.0-6.5": "#BAF700",
  "6.5-7.0": "#81F819",
  ">=7.0": "#10F500",
};
export default defineComponent({
  setup() {
    const state = reactive({
      test: null as unknown,
      scale: 0,
      // map: null as Map
    });
    const map = ref();

    const getPointFillColor = (num) => {
      if (num >= 7.0) return gldLegend[">=7.0"];
      else if (num >= 6.5) return gldLegend["6.5-7.0"];
      else if (num >= 6.0) return gldLegend["6.0-6.5"];
      else if (num >= 5.5) return gldLegend["5.5-6.0"];
      else if (num >= 5.0) return gldLegend["5.0-5.5"];
      else if (num >= 4.5) return gldLegend["4.5-5.0"];
      else return gldLegend["<4.5"];
    };

    const newMap = () => {
      const untiled = new Image({
        visible: true,
        source: new ImageWMS({
          url: "http://localhost:8080/geoserver/test/wms",
          params: {
            LAYERS: "test:jiangxi_province",
          },
        }),
      });

      const pointVector = new VectorLayer({
        visible: true,
        source: new VectorSource({
          url: "http://localhost:8080/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json&typeName=test:2018gld",
          format: new GeoJSON(),
        }),
        style: function (feature) {
          const ph = feature.get("土壤ph");

          const style = new Style({
            image: new Circle({
              fill: new Fill({
                color: getPointFillColor(ph),
              }),
              scale: Math.random(),
              radius: 10,
            }),
            text: new Text({
              offsetY: 10,
              font: "16px '宋体'",
              text: state.scale < 172000 ? "ph:" + Math.round(ph * 100) / 100 : '',
            }),
          });

          return style;
        },
      });
      pointVector.on("postrender", (event) => {
        // const vectorContext = getVectorContext(event);
      // !是not null的断言操作 不执行运行时检查，告诉编译器只需要知道这个东西
      // const features = pointVector.getSource()!.getFeatures();
      // console.log("features pointRes", features, pointRes);
      });

      map.value = new Map({
        target: "map",
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
      map.value.on("postrender", (mapRes) => {
        const resolution = mapRes.frameState.viewState.resolution;
        const units = mapRes.frameState.viewState.projection.getUnits();
        const dpi = 25.4 / 0.28;
        const mpu = METERS_PER_UNIT[units];
        const scale = resolution * mpu * 39.37 * dpi;
        state.scale = Math.round(scale);
        
      });
    };
    onMounted(() => {
      newMap();
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
}
</style>