import { request } from '../request'

export function getUsersList (pagenum, pagesize, query) {
  return request({
    url: '/users',
    method: 'get',
    params: {
      query: query,
      pagenum: pagenum,
      pagesize: pagesize
    }
  })
}

export function changeRowState (uId, type) {
  return request({
    url: 'users/' + uId + '/state/' + type,
    method: 'put'
  })
}

export function addUserPost (username, password, email, mobile) {
  return request({
    url: 'users',
    method: 'post',
    data: {
      username: username,
      password: password,
      email: email,
      mobile: mobile
    }
  })
}

export function getUserFromId (id) {
  return request({
    url: 'users/' + id,
    method: 'get'
  })
}

export function updateUserSub (id, email, mobile) {
  return request({
    url: 'users/' + id,
    method: 'put',
    data: {
      email: email,
      mobile: mobile
    }
  })
}

export function deleteUserById (id) {
  return request({
    url: 'users/' + id,
    method: 'delete'
  })
}
