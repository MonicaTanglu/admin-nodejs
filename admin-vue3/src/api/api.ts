import { request } from "./instance"
// import axios from 'axios'

// import { AxiosResponse } from 'axios'


export function getAction<T>(url, params = {}) {
    return request<T>({
        url: url,
        method: "get",
        params: params
    })
}

export function postAction<T>(url, params = {}) {
    return request<T>({
        url: url,
        method: "post",

        data: params
    })
}

export function putAction<T>(url, params = {}) {
    return request<T>({
        url: url,
        method: "put",

        data: params
    })
}

export function deleteAction<T>(url, params = {}) {
    return request<T>({
        url: url,
        method: 'delete',
        params: params
    })
}

export function uploadAction<T>(url, parameter = {}) {
    return request<T>({
        url: url,
        data: parameter,
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data',  // 文件上传
        },
    })
}
// export function uploadFile(url, param = {}) {
//     return instance.post(url, param, {
//         headers: { "Content-Type": "multipart/form-data" },
//     });
// }
// export function downFile(url, parameter = {}) {
//     return instance({
//         url: url,
//         params: parameter,
//         method: 'get',
//         responseType: 'blob'
//     })
// }

// const getPermissionList = () => getAction(`/api/public/user/permissions`, { customResolve: true })

export default { getAction, postAction, putAction, deleteAction }