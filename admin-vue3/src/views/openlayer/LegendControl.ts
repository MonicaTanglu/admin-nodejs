import { Control } from 'ol/control';
import BaseLayer from 'ol/layer/Base'
import { getSld } from "@/api/geoApi";
interface CustomLayer {
    layer: BaseLayer,
    type: string,
    legendConfig: object
}
interface CustomStyle {
    fill?: string,
    name: string
    stroke?: string
}
const SVG_NS = 'http://www.w3.org/2000/svg'
export class LegendControl extends Control {
    legendDiv: HTMLElement
    layerArr: CustomLayer[]

    constructor(layers, options = {}) {
        options = options || {}

        super(options)
        this.layerArr = layers
    }
    setMap() {
        this.render()
    }
    render() {
        if (!this.legendDiv) {
            this.legendDiv = document.createElement("div")
            this.legendDiv.id = "legendSub"
            this.legendDiv.className = 'legend_sub'
            this.element.appendChild(this.legendDiv)

            for (let i = 0, len = this.layerArr.length; i < len; i++) {
                const layer: BaseLayer = this.layerArr[i].layer
                if (!layer.getVisible()) continue
                const labelLyr = document.createElement('h4')
                labelLyr.innerHTML = layer.getProperties()['name']
                this.legendDiv.appendChild(labelLyr)

                const tableDiv = document.createElement('table')
                this.legendDiv.appendChild(tableDiv)

                for (const key in this.layerArr[i].legendConfig) {
                    if (key === 'point') { // 点
                        this.createPointLegend(tableDiv, this.layerArr[i].legendConfig[key])
                    } else if (key === 'line') { // 线
                        this.createLineLegend(tableDiv, this.layerArr[i].legendConfig[key])
                    } else { // 面
                        this.createPolygonLegend(tableDiv, this.layerArr[i].legendConfig[key])
                    }
                }
            }
        }
    }
    createPointLegend(tableDiv: HTMLElement, legendConfig: CustomStyle[]) {
        for (const legend of legendConfig) {
            const trDiv = document.createElement('tr')

            const colorTd = document.createElement('td')
            trDiv.appendChild(colorTd)
            const svg = document.createElementNS(SVG_NS, 'svg')
            svg.setAttribute('style', "width:36px;height:36px;");
            const tag = document.createElementNS(SVG_NS, 'circle')
            tag.setAttribute('cx', "18")
            tag.setAttribute('cy', "18")
            tag.setAttribute('r', "3")
            if (legend.fill) tag.setAttribute('fill', legend.fill)
            let borderColor = "none"
            if (legend.stroke) borderColor = legend.stroke
            tag.setAttribute('stroke', borderColor)
            tag.setAttribute('stroke-width', "1")
            svg.appendChild(tag)
            colorTd.appendChild(svg)

            const labelTd = document.createElement('td')
            trDiv.appendChild(labelTd)
            const itemLabel = document.createElement('label')
            itemLabel.setAttribute('style', 'margin-left:5px;position:relative;top:3px;')
            itemLabel.innerHTML = legend.name
            labelTd.appendChild(itemLabel)

            tableDiv.appendChild(trDiv)

        }
    }
    createPolygonLegend(tableDiv: HTMLElement, legendConfig: CustomStyle[]) {
        // const border = legendConfig.border
        for (const legend of legendConfig) {
            const trDiv = document.createElement('tr')

            const colorTd = document.createElement('td')
            trDiv.appendChild(colorTd)
            const svg = document.createElementNS(SVG_NS, 'svg')
            let fillColor = "none"
            if (legend.fill) fillColor = legend.fill
            svg.setAttribute('style', "width:36px;height:36px;fill:" + fillColor);
            const tag = document.createElementNS(SVG_NS, 'polygon')
            tag.setAttribute('points', "16,4 32,4 32,32 4,32")
            if (legend.stroke) tag.setAttribute('stroke', legend.stroke)
            tag.setAttribute('stroke-width', "1")
            svg.appendChild(tag)
            colorTd.appendChild(svg)

            const labelTd = document.createElement('td')
            trDiv.appendChild(labelTd)
            const itemLabel = document.createElement('label')
            itemLabel.setAttribute('style', 'margin-left:5px;position:relative;top:3px;')
            itemLabel.innerHTML = legend.name
            labelTd.appendChild(itemLabel)
            tableDiv.appendChild(trDiv)

        }
    }

    createLineLegend(tableDiv: HTMLElement, legendConfig: CustomStyle[]) {
        for (const legend of legendConfig) {
            const trDiv = document.createElement('tr')

            const colorTd = document.createElement('td')
            trDiv.appendChild(colorTd)
            const svg = document.createElementNS(SVG_NS, 'svg')

            svg.setAttribute('style', "width:36px;height:36px;");
            const tag = document.createElementNS(SVG_NS, 'line')
            if (legend.stroke) tag.setAttribute('stroke', legend.stroke)
            tag.setAttribute('stroke-width', "1")
            tag.setAttribute('x1', "4")
            tag.setAttribute('y1', "34")
            tag.setAttribute('x2', "34")
            tag.setAttribute('y2', "4")
            svg.appendChild(tag)
            colorTd.appendChild(svg)

            const labelTd = document.createElement('td')
            trDiv.appendChild(labelTd)
            const itemLabel = document.createElement('label')
            itemLabel.setAttribute('style', 'margin-left:5px;position:relative;top:3px;')
            itemLabel.innerHTML = legend.name
            labelTd.appendChild(itemLabel)
            tableDiv.appendChild(trDiv)

        }
    }
}

export async function getSldXml(url, cb) {
    const data = await getSld(url);
    const legendObj = {};
    const result = data.replaceAll("sld:", "");
    const xmlStyle = new DOMParser().parseFromString(result, "text/xml");
    const userStyleDom = xmlStyle.getElementsByTagName("UserStyle").item(0);
    const featureTypeStyleDom =
        userStyleDom?.getElementsByTagName("FeatureTypeStyle");
    for (let i = 0, l = featureTypeStyleDom?.length || 0; i < l; i++) {
        const rulesDom = featureTypeStyleDom
            ?.item(i)
            ?.getElementsByTagName("Rule");
        for (let q = 0, rl = rulesDom?.length || 0; q < rl; q++) {
            const name = rulesDom
                ?.item(q)
                ?.getElementsByTagName("Name")
                .item(0)?.innerHTML;
            const pointBl = rulesDom
                ?.item(q)
                ?.getElementsByTagName("PointSymbolizer");
            let type = "", targetDom;
            if (pointBl && pointBl.length > 0) { type = "point"; targetDom = pointBl }
            else {
                const lineBl = rulesDom
                    ?.item(q)
                    ?.getElementsByTagName("LineSymbolizer");
                if (lineBl && lineBl.length > 0) { type = "line"; targetDom = lineBl }
                else {
                    const polygonBl = rulesDom
                        ?.item(q)
                        ?.getElementsByTagName("PolygonSymbolizer");
                    if (polygonBl && polygonBl.length > 0) { type = "polygon"; targetDom = polygonBl }
                    else break;
                }
            }
            const fillDom = targetDom?.item(0)?.getElementsByTagName("Fill");
            const strokeDom = targetDom?.item(0)?.getElementsByTagName("Stroke");
            legendObj[type] = legendObj[type] || [];
            // 填充
            let cssDoms = fillDom?.item(0)?.children || [];
            const nameObj = { name: name };
            for (const cssDom of cssDoms) {
                if (cssDom.getAttribute("name") === "fill") {
                    nameObj["fill"] = cssDom.innerHTML;
                    break;
                }
            }
            // 线条
            cssDoms = strokeDom?.item(0)?.children || [];
            for (const cssDom of cssDoms) {
                if (cssDom.getAttribute("name") === "stroke") {
                    nameObj["stroke"] = cssDom.innerHTML;
                    break;
                }
            }
            legendObj[type].push(nameObj);
        }
    }
    cb(legendObj);
}
// 十六进制转rgba
export function transformColor(color: string) {
    let thecolor = color.toLowerCase();
    //十六进制颜色值的正则表达式
    const r = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是16进制颜色
    if (thecolor && r.test(thecolor)) {
        if (thecolor.length === 4) {
            let sColorNew = "#";
            for (let i = 1; i < 4; i += 1) {
                sColorNew += thecolor.slice(i, i + 1).concat(thecolor.slice(i, i + 1));
            }
            thecolor = sColorNew;
        }
        //处理六位的颜色值
        const sColorChange: number[] = [];
        for (let i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + thecolor.slice(i, i + 2)));
        }
        return sColorChange.join(",") + ',';
    }
    return thecolor;
}