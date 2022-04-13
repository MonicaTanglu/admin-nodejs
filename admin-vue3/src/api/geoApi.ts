import { request } from './geoserverInstance'
export function getSld(url) {
    return request({
        url: url,
        params: {customResolve: true},
        headers: {"Content-Type": "application/vnd.ogc.sld+xml"}
    })
}