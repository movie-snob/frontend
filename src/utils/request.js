import axios from 'axios'

import { getToken, removeToken } from '../utils/auth'

const service = axios.create({
  baseURL: "/api",
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  }
)

service.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      removeToken()
      location.reload()
    }
    return Promise.reject(error)
  }
)

export default service
