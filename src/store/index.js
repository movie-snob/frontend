import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'

import auth from './modules/auth'
import movies from './modules/movies'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    movies
  },
  getters
})

export default store
