import request from '@/utils/request'

class Scene {
    static url = '/scene'
    static save(data) {
        return request({
            url: this.url + '/save',
            method: 'post',
            headers: { 'Content-type': 'multipart/form-data;charset=UTF-8' },
            data
        })
    }
}

export default Scene