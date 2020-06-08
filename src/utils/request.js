import axios from 'axios'
import Vue from 'vue'
import JSONbig from 'json-bigint'

const baseURL = process.env.NODE_ENV === 'development' ? '/api' : '/'
const service = axios.create({
    baseURL,
    timeout: 15000,
    transformResponse: data => JSONbig.parse(data)
})

service.interceptors.request.use(config => {
    return config
})

service.interceptors.response.use(res => {
    if (res.data.code !== 200) {
        Vue.notify({
            group: 'foo',
            type: 'error',
            title: '错误',
            text: res.data.msg
        })
        return Promise.reject(res.data.msg)
    }
    return res
}, err => {
    Vue.notify({
        group: 'foo',
        type: 'error',
        title: '错误',
        text: err.message.toString()
    })
    return Promise.reject(err)
})

export default service