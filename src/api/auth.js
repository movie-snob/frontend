import request from '../utils/request'

export const register = async (name, email, password, gender) => {
  return request({
    url: '/register',
    method: 'post',
    data: {
      name,
      email,
      password,
      gender
    }
  })
}

export const login = async (email, password) => {
  return request({
    url: '/authenticate',
    method: 'post',
    data: {
      email,
      password
    }
  })
}

export const getInfo = async () => {
  return request({
    url: '/users/me',
    method: 'get'
  })
}
