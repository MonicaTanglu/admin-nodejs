<template>
  <div>
    <p style="padding: 20px 16px">
      <span class="m-l-20">
        <a-cascader
          change-on-select
          v-model:value="casVal"
          :options="casOptions"
        ></a-cascader>
        <a-button class="m-l-10" @click="search">查询</a-button>
      </span>
      <label id="scale" style="float: right">1:{{ scale }}</label>
    </p>
    <div id="map" ref="map" class="map">
      <div class="legend" id="legend"></div>

      <div class="pop-table" v-if="tables && tables.length > 0">
        <h4>{{ tables[tableIndex - 1].tableName }}</h4>
        <div class="table-scroll">
          <table border="1" cellspacing="0">
            <tr v-for="(tds, i) of tables[tableIndex - 1].tableData" :key="i">
              <td>{{ tds.key }}</td>
              <td>{{ tds.value }}</td>
            </tr>
          </table>
        </div>
        <p class="right">
          <span @click="preTable"
            ><icon-font type="icon-caret-left"></icon-font
          ></span>
          <label>{{ tableIndex }}/{{ tables.length }}</label>
          <span @click="nextTable"
            ><icon-font type="icon-caret-right"></icon-font
          ></span>
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import "ol/ol.css";
import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import { Feature, Map, View } from "ol";
import { Projection, METERS_PER_UNIT } from "ol/proj";
import ImageWMS from "ol/source/ImageWMS";
import Image from "ol/layer/Image";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON, WFS } from "ol/format";
import { Fill, Style, Circle, Text, Stroke } from "ol/style";
import { getVectorContext } from "ol/render";
import { defaults as defaultControls } from "ol/control";
import { LegendControl, getSldXml, transformColor } from "./LegendControl";
import { equalTo } from "ol/format/filter";
import { geoQueryPost } from "@/api/geoApi";
const options = [
  {
    value: "上饶市",
    label: "上饶市",
  },
  {
    value: "南昌市",
    label: "南昌市",
  },
  {
    value: "宜春市",
    label: "宜春市",
    children: [
      {
        value: "高安市",
        label: "高安市",
        children: [
          {
            value: "石脑镇",
            label: "石脑镇",
          },
          {
            value: "黄沙岗镇",
            label: "黄沙岗镇",
          },
        ],
      },
      {
        value: "袁州区",
        label: "袁州区",
      },
    ],
  },
];
export default defineComponent({
  setup() {
    const state = reactive({
      test: null as unknown,
      scale: 0,
      graphicUrl: "",
      legendObj: {}, // gld
      xzqLegendObj: {},
      map: null as any,
      casOptions: options,
      casVal: [],
    });
    const map = ref();

    // 矢量图层point 样式处理 动画处理
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
    const pointSource = new VectorSource({
      url: "http://localhost:8080/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json&typeName=test:2018gld",
      format: new GeoJSON(),
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
            radius: 4,
          }),
        });
        feature.setStyle(style);
      }
    });
    const pointVector = new VectorLayer({
      visible: true,
      properties: { name: "过录点" },
      source: pointSource,
      style: function (feature) {
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
    const animate = (event) => {
      if (state.scale > 108216) return;
      if (scale >= 1) {
        scale = 0.02;
      }
      const extent = event.frameState.extent;
      const features = event.target.getSource()?.getFeaturesInExtent(extent);
      const vectorContext = getVectorContext(event);
      for (let feature of features) {
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
          text: new Text({
            offsetY: 10,
            font: "16px '宋体'",
            text: "ph:" + Math.round(feature.get("土壤ph") * 100) / 100,
          }),
        });
        vectorContext.setStyle(style);
        vectorContext.drawGeometry(feature.getGeometry().clone());
      }
      state.map.render();
      scale = scale + 0.01;
    };
    pointVector.on("postrender", animate);

    // 点击查询高亮
    const hightlightSource = new VectorSource();
    const highlightLayer = new VectorLayer({
      source: hightlightSource,
      style: new Style({
        image: new Circle({
          radius: 4,
          stroke: new Stroke({
            color: "#10C3FB",
            width: 2,
          }),
        }),
      }),
    });
    interface TableKey {
      key: string;
      value: string | number;
    }
    interface TableObj {
      tableName?: string;
      tableData: TableKey[];
    }
    const stateTable = reactive({
      tables: [] as TableObj[],
      tableIndex: 1,
    });
    const getFeatureInfo = (evt) => {
      const features = state.map.getFeaturesAtPixel(evt.pixel);
      hightlightSource.clear();
      stateTable.tables = [];
      stateTable.tableIndex = 1;
      for (let feature of features) {
        const tableName = feature.id_.split(".")[0];
        let obj: TableObj = { tableName: tableName, tableData: [] };
        const keys = feature.getKeys();
        for (const v of keys) {
          if (v === "geometry") {
            hightlightSource.addFeature(new Feature(feature.get(v)));
            continue;
          }
          const fieldObj: TableKey = { key: v, value: feature.get(v) };
          obj.tableData.push(fieldObj);
        }
        stateTable.tables.push(obj);
      }
    };
    const preTable = () => {
      if (stateTable.tableIndex <= 1) return;
      else --stateTable.tableIndex;
    };
    const nextTable = () => {
      if (stateTable.tableIndex >= stateTable.tables.length) return;
      else ++stateTable.tableIndex;
    };

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
        layers: [untiled, pointVector],
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
      // 比例尺监听计算
      state.map.on("postrender", (mapRes) => {
        const resolution = mapRes.frameState.viewState.resolution;
        const units = mapRes.frameState.viewState.projection.getUnits();
        const dpi = 25.4 / 0.28;
        const mpu = METERS_PER_UNIT[units];
        const scale = resolution * mpu * 39.37 * dpi;
        state.scale = Math.round(scale);
      });
      state.map.on("singleclick", getFeatureInfo);
    };

    // 获取在线样式 图例样式准备
    getSldXml("/test/styles/shi.sld", (v) => (state.xzqLegendObj = v));

    // 属性查询高亮 区域高亮
    const querySource = new VectorSource();
    const queryLayer = new VectorLayer({
      source: querySource,
      style: new Style({
        stroke: new Stroke({
          color: "#10C3FB",
          width: 4,
        }),
      }),
    });
    const search = () => {
      const featureRequest = new WFS().writeGetFeature({
        srsName: "EPSG:4527",
        featureNS: "http://localhost:8080/geoserver/test",
        featurePrefix: "test",
        featureTypes: ["shi", "xian", "xiang"],
        outputFormat: "application/json",
        filter: equalTo("name", state.casVal[state.casVal.length - 1]),
      });
      const str = new XMLSerializer().serializeToString(featureRequest);
      querySource.clear(true);
      geoQueryPost("http://localhost:8080/geoserver/test/wfs", str).then(
        (res) => {
          const features = new GeoJSON().readFeatures(res);
          querySource.addFeatures(features);
          state.map.getView().fit(querySource.getExtent(), { duration: 500 });
        }
      );
    };

    onMounted(() => {
      getSldXml("/test/styles/gld.sld", (v) => {
        state.legendObj = v;
        newMap();
        state.map.addLayer(queryLayer);
        state.map.addLayer(highlightLayer);
      });
    });

    return {
      ...toRefs(state),
      ...toRefs(stateTable),
      map,
      search,
      preTable,
      nextTable,
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

.pop-table {
  position: absolute;
  z-index: 12;
  display: block;
  right: 10px;
  bottom: 10px;
  width: 400px;
  max-height: 700px;

  background: rgba(65, 184, 131, 1);
  padding: 10px 16px 0px 16px;
  .table-scroll {
    max-height: 620px;
    overflow-y: scroll;
  }
  table {
    width: 100%;
    tr {
      height: 34px;
      td {
        padding: 0 4px;
      }
    }
  }
  .right {
    margin: 0px 0px 8px 0px;
    span {
      color: #999;
      cursor: pointer;
      :hover {
        color: #333;
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