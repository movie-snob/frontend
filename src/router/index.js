import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routerMap = [
  { path: '/', component: () => import('../components/Auth/Login'), },
  { path: '/register', component: () => import('../components/Auth/Register') },
  { path: '/login', component: () => import('../components/Auth/Login') },
  { path: '*', redirect: '/' }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: routerMap
})
