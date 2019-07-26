import { login, register, getInfo } from '../../api/auth'
import { setToken, removeToken } from '../../utils/auth'

const auth = {
  state: {
    token: '',
    user: {
      name: '',
      email: '',
      gender: null,
      id: '',
      loaded: false
    }
  },
  mutations: {
    'SET_TOKEN': (state, token) => {
      setToken(token)
      state.token = token
    },
    'REMOVE_TOKEN': (state) => {
      removeToken()

      const { token, ...newState } = state
      state = newState
    },
    'SET_INFO': (state, { id, name, email }) => {
      state.user.name = name
      state.user.email = email
      state.user.id = id
      state.user.loaded = true
    }
  },
  actions: {
    async Register({ commit, dispatch }, { name, email, password, gender }) {
      const registerResponse = await register(name, email, password, gender)
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
    },
    Logout({ commit }) {
      commit('REMOVE_TOKEN')
    }
  }
}

export default auth
