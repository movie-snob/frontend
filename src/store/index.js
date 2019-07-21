import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'

import auth from './modules/auth'
import app from './modules/app'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    app
  },
  getters
})

export default store
