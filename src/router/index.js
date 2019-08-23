import Vue from 'vue'
import Router from 'vue-router'

import progress from 'nprogress'
import 'nprogress/nprogress.css'

import { getToken } from '../utils/auth'

Vue.use(Router)

const routerMap = [
  { path: '/', component: () => import('../components/Movies/Suggested'), },
  { path: '/register', component: () => import('../components/Auth/Register') },
  { path: '/login', component: () => import('../components/Auth/Login') },
  { path: '/movies/suggested', component: () => import('../components/Movies/Suggested') },
  { path: '/movies/archive', component: () => import('../components/Movies/Archive') },
  { path: '*', redirect: '/' }
]

let router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: routerMap
})

router.beforeEach((to, _from, next) => {
  const whitelisted = ['/login', '/register']
  const token = getToken()

  progress.start()
  if (token) {
    if (whitelisted.includes(to.path)) {
      next({ path: '/movies/suggested', replace: true})
      progress.done()
      return
    }

    next()

    return
  }

  if (whitelisted.includes(to.path)) {
    next()
  } else {
    next(`/login?redirect=${to.path}`)
    progress.done()
  }
})

router.afterEach(() => {
  progress.done()
})

export default router
