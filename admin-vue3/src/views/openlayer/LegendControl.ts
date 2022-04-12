import { Control } from 'ol/control';
import BaseLayer from 'ol/layer/Base'
interface CustomLayer {
    layer: BaseLayer,
    type: string,
    legendConfig: CustomStyle
}
interface CustomStyle {
    fill?: object,
    border?: object
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

                if (this.layerArr[i].type === 'point') { // 点
                    this.createPointLegend(tableDiv,this.layerArr[i].legendConfig)
                } else if (this.layerArr[i].type === 'line') { // 线

                } else { // 面
                    this.createPolygonLegend(tableDiv,this.layerArr[i].legendConfig)
                }
            }
        }
    }
    createPointLegend(tableDiv: HTMLElement, legendConfig: CustomStyle) {
        const fill = legendConfig.fill
        for (const key in fill) {
            const trDiv = document.createElement('tr')

            const colorTd = document.createElement('td')
            trDiv.appendChild(colorTd)
            const svg = document.createElementNS(SVG_NS, 'svg')
            svg.setAttribute('style',"width:36px;height:36px;");
            const tag = document.createElementNS(SVG_NS, 'circle')
            tag.setAttribute('cx', "18")
            tag.setAttribute('cy', "18")
            tag.setAttribute('r', "3")
            tag.setAttribute('fill', fill[key])
            let borderColor = "none"
            if (legendConfig.border) borderColor = legendConfig.border[key]
            tag.setAttribute('stroke', borderColor)
            tag.setAttribute('stroke-width', "1")
            svg.appendChild(tag)
            colorTd.appendChild(svg)

            const labelTd = document.createElement('td')
            trDiv.appendChild(labelTd)
            const itemLabel = document.createElement('label')
            itemLabel.setAttribute('style', 'margin-left:5px;position:relative;top:3px;')
            itemLabel.innerHTML = key
            labelTd.appendChild(itemLabel)

            tableDiv.appendChild(trDiv)

        }
    }
    createPolygonLegend(tableDiv: HTMLElement, legendConfig: CustomStyle) {
        const border = legendConfig.border
        for (const key in border) {
            const trDiv = document.createElement('tr')

            const colorTd = document.createElement('td')
            trDiv.appendChild(colorTd)
            const svg = document.createElementNS(SVG_NS, 'svg')
            let fillColor = "none"
            if(legendConfig.fill) fillColor = legendConfig.fill[key]
            svg.setAttribute('style',"width:36px;height:36px;fill:" + fillColor);
            const tag = document.createElementNS(SVG_NS, 'polygon')
            tag.setAttribute('points', "16,4 32,4 32,32 4,32")
            tag.setAttribute('stroke', border[key])
            tag.setAttribute('stroke-width', "1")
            svg.appendChild(tag)
            colorTd.appendChild(svg)

            const labelTd = document.createElement('td')
            trDiv.appendChild(labelTd)
            const itemLabel = document.createElement('label')
            itemLabel.setAttribute('style', 'margin-left:5px;position:relative;top:3px;')
            itemLabel.innerHTML = key
            labelTd.appendChild(itemLabel)
            tableDiv.appendChild(trDiv)

        }
    }

    createLineLegend(tableDiv: HTMLElement, legendConfig: CustomStyle) {
        const border = legendConfig.border
        for (const key in border) {
            const trDiv = document.createElement('tr')

            const colorTd = document.createElement('td')
            trDiv.appendChild(colorTd)
            const svg = document.createElementNS(SVG_NS, 'svg')
        
            svg.setAttribute('style',"width:36px;height:36px;");
            const tag = document.createElementNS(SVG_NS, 'line')
            tag.setAttribute('stroke', border[key])
            tag.setAttribute('stroke-width', "1")
            tag.setAttribute('x1', "4")
            tag.setAttribute('y1', "34")
            tag.setAttribute('x1', "34")
            tag.setAttribute('y1', "4")
            svg.appendChild(tag)
            colorTd.appendChild(svg)

            const labelTd = document.createElement('td')
            trDiv.appendChild(labelTd)
            const itemLabel = document.createElement('label')
            itemLabel.setAttribute('style', 'margin-left:5px;position:relative;top:3px;')
            itemLabel.innerHTML = key
            labelTd.appendChild(itemLabel)
            tableDiv.appendChild(trDiv)

        }
    }
}