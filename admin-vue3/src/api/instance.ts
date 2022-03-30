// import Vue from 'vue'
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { message, notification } from 'ant-design-vue'
import store from '../store'

const service = axios.create({
    baseURL: '/api',
    timeout: 30000
})
interface PendingObject {
    u: string,
    f: () => void
}
const pending: PendingObject[] = []
const cancelToken = axios.CancelToken
const removePending = (ever) => {
    for (let i = 0, l = pending.length; i < l; i++) {
        if (pending[i] && pending[i].u === ever.url + '&' + ever.method) {
            pending[i].f() // 执行取消
            pending.splice(i, 1)
        }
    }
}

// 拦截器
service.interceptors.request.use(config => {
    config.headers['X-Access-Token'] = store.getters.token || localStorage.getItem('token')
    if (config.method === 'get') {
        config.params = {
            _t: new Date().getTime(),
            ...config.params
        }
    } else {
        if (config.data && config.data.customResolve) {
            config.params = {
                customResolve: true,
                ...config.params
            }
        }

    }
    removePending(config)
    // eslint-disable-next-line new-cap
    config.cancelToken = new cancelToken((c) => {
        pending.push({ u: config.url + '&' + config.method, f: c })
    })
    return config
})
const resultJudge = (data) => {
    if (!data.success) {
        if (data instanceof Blob) {
            return true
        } else {
            message.error(data.message)
            return false
        }

    } else {
        return true
    }
}
const err = (error) => {
    if (error.response) {
        const data = error.response.data
        switch (error.response.status) {
            case 403:
                notification.error({
                    message: '系统提示',
                    description: "拒绝访问",
                    duration: 4
                })
                break
            case 500:
                notification.error({
                    message: "系统提示",
                    description: data.message,
                    duration: 4,
                });
                break
            case 404:
                notification.error({
                    message: "系统提示",
                    description: "很抱歉，资源未找到!",
                    duration: 4,
                });
                break;
            case 504:
                notification.error({ message: "系统提示", description: "网络超时" });
                break;
            case 401:
                notification.error({
                    message: "系统提示",
                    description: "token失效，请重新登录",
                    duration: 4,
                });
                // if (error.config.params && error.config.params['customResolve']) {
                //     store.dispatch('showLoginForm', true) // 跳转登录
                //     window.location.reload()
                // } else {
                //     store.dispatch('showLoginForm', true)
                // }
                location.href = '/user/login'

                break;
            default:
                notification.error({
                    message: "系统提示",
                    description: data.message,
                    duration: 4,
                });
                break
        }
    }
    return Promise.reject(error)
}
interface AxiosResponseCustomDefine<T = any> {
    code: number,
    message: string,
    result: T,
    success: boolean,
    timestamp: number
}
// service.interceptors.response.use((response) => {
//     if (response.config && response.config.params && response.config.params['customResolve']) return response.data
//     const bl = resultJudge(response.data)
//     if (bl) return response.data
//     else return false
// }, err)

const request = async <T = any>(config: AxiosRequestConfig): Promise<AxiosResponseCustomDefine<T>> => {
    return new Promise((resolve, reject) => {
        service.request(config).then((res: AxiosResponse<AxiosResponseCustomDefine>) => {
            removePending(config)
            if (config.params && config.params['customResolve']) resolve(res.data)
            else {
                const bl = resultJudge(res.data)
                if (bl) return resolve(res.data)
                else return reject(false)
            }
        }, err)
    })
}
// const installer = {
//     vm: {},
//     install (Vue, router = {}) {
//         Vue.use(router, service)
//     }
// }
export { request }