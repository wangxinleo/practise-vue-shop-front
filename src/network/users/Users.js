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
