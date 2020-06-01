import Vue from 'vue'
import Vuex from 'vuex'

import studio from './modules/studio'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		studio
	},
	getters
})
