import request from '../utils/request'

export const fetchUsers = async () => {
  return request({
    url: '/users',
    method: 'get'
  })
}
