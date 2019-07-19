import request from '../utils/request'


export async function register(name, email, password) {
  return request({
    url: '/register',
    method: 'post',
    data: {
      name,
      email,
      password
    }
  })
}

export async function login(email, password) {
  return request({
    url: '/authenticate',
    method: 'post',
    data: {
      email,
      password
    }
  })
}
