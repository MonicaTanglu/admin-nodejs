import { request } from './geoserverInstance'
export function getSld(url) {
    return request({
        url: url,
        params: {customResolve: true},
        headers: {"Content-Type": "application/vnd.ogc.sld+xml"}
    })
}
export function geoQueryPost(url, params = {}) {
    return request({
        url: url,
        method: "post",
        headers: {
            'Content-Type': 'text/plain;charset=UTF-8',  // 文件上传
        },
        data: params
    })
}