import { login, register } from '../../api/auth'
import { setToken } from '../../utils/auth'

const auth = {
  state: {
    token: '',
    user: {
      name: '',
      email: ''
    }
  },
  mutations: {
    'SET_TOKEN': (state, token) => {
      setToken(token)
      state.token = token
    }
  },
  actions: {
    async Register({ commit }, { name, email, password }) {
      const response = await register(name, email, password)

      commit('SET_TOKEN', response.data.token)
    },
    async Login({ commit }, { email, password }) {
      const response = await login(email, password)

      commit('SET_TOKEN', response.data.token)
    }
  }
}

export default auth
