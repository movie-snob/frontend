import axios from 'axios'

import store from '../store'

import { getToken } from '../utils/auth'

const service = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  }
)

service.interceptors.response.use(
  response => response,
  // error => {
  //   console.log('err' + error)
  //   Message({
  //     message: error.message,
  //     type: 'error',
  //     duration: 5 * 1000
  //   })
  //   return Promise.reject(error)
  // }
)

export default service
