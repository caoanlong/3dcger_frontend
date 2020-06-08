import request from '@/utils/request'

class Scene {
    static url = '/scene'
    static save(data, onUploadProgress) {
        return request({
            url: this.url + '/save',
            method: 'post',
            headers: { 'Content-type': 'multipart/form-data;charset=UTF-8' },
            data,
            onUploadProgress
        })
    }
    static update(data, onUploadProgress) {
        return request({
            url: this.url + '/update',
            method: 'post',
            headers: { 'Content-type': 'multipart/form-data;charset=UTF-8' },
            data,
            onUploadProgress
        })
    }
    static del(data) {
        return request({
            url: this.url + '/del',
            method: 'post',
            data
        })
    }
    static findList(params) {
        return new Promise((resolve, reject) => {
            request({
                url: this.url + '/findList',
                params
            }).then(res => {
                resolve(res.data.data)
            }).catch(err => {
                reject(err)
            })
        })
    }
    static findById(params) {
        return new Promise((resolve, reject) => {
            request({
                url: this.url + '/findById',
                params
            }).then(res => {
                resolve(res.data.data)
            }).catch(err => {
                reject(err)
            })
        })
    }
}

export default Scene