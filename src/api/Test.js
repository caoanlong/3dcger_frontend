import request from '@/utils/request'

class Test {
    static url = '/test'
    static add(data) {
        return request({
            url: this.url + '/add',
            method: 'post',
            data
        })
    }
}

export default Test