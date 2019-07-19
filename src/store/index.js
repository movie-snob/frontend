import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'

import auth from './modules/auth'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth
  },
  getters
})

export default store
