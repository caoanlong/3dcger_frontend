import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'home',
		component: Home,
		redirect: '/edit'
	},
	{
		path: '/edit',
		name: 'edit',
		component: () => import('@/views/Edit')
	},
	{
		path: '/info',
		name: 'info',
		component: () => import('@/views/Info')
	}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
