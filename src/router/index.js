import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home'),
  },
  // {
  //   path: '/',
  //   name: 'Release',
  //   component: () => import('@/views/Release'),
  // },
]

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
})
