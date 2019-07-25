import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'

import auth from './modules/auth'
import app from './modules/app'

Vue.use(Vuex)

const hlCache = new Map()

Vue.directive('highlight', {
  bind(el, { value }) {
    hlCache.set(el, value)
  },
  componentUpdated(el, { value }) {
   if (hlCache.get(el) !== value) {
     hlCache.set(el, value)
     el.classList.remove('highlight')
     el.classList.add('highlight')

     setTimeout(() => {
       el.classList.remove('highlight')
     }, 500)
   }
  },
  unbind(el) {
    hlCache.remove(el)
  }
})

const store = new Vuex.Store({
  modules: {
    auth,
    app
  },
  getters
})

export default store
