import * as Cesium from "cesium";

export class CesiumCom {
    static addJX()  {
        const imgTileLayer = new Cesium.WebMapTileServiceImageryProvider({
            // url: "http://localhost:8080/geoserver/gwc/service/wmts/rest/test:shi/{style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}?format=image/png",
            url: "http://localhost:8080/geoserver/gwc/service/wmts/rest/test:shi/{style}/{TileMatrixSet}/{TileMatrixSet}:{TileMatrix}/{TileRow}/{TileCol}?format=image/png",
            layer: "test:shi",
            style: "",
            format: "image/png",
            tileMatrixSetID: "EPSG:900913"
        })
        return imgTileLayer;
    }
}
// export function addJX() {
    
// }