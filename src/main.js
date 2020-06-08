import Vue from 'vue'
import Notifications from 'vue-notification'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import '@google/model-viewer/lib/model-viewer'
import '@/assets/css/reset.scss'

import '@/assets/icons/index.js'

Vue.config.productionTip = false

Vue.use(Notifications)
Vue.prototype.$staticUrl = 'http://localhost:1000/test/'

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
