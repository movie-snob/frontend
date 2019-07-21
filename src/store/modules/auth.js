import { login, register, getInfo } from '../../api/auth'
import { setToken } from '../../utils/auth'

const auth = {
  state: {
    token: '',
    user: {
      name: '',
      email: '',
      loaded: false
    }
  },
  mutations: {
    'SET_TOKEN': (state, token) => {
      setToken(token)
      state.token = token
    },
    'SET_INFO': (state, { id, name, email }) => {
      state.user.name = name
      state.user.email = email
      state.user.id = id
      state.user.loaded = true
    }
  },
  actions: {
    async Register({ commit, dispatch }, { name, email, password }) {
      const registerResponse = await register(name, email, password)
      commit('SET_TOKEN', registerResponse.data.token)

      dispatch('GetUserInfo')
    },
    async Login({ commit, dispatch }, { email, password }) {
      const loginResponse = await login(email, password)
      commit('SET_TOKEN', loginResponse.data.token)

      dispatch('GetUserInfo')
    },
    async GetUserInfo({ commit }) {
      const infoResponse = await getInfo()
      commit('SET_INFO', infoResponse.data)
    }
  }
}

export default auth
