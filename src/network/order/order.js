import { request } from '../request.js'

export function getOrdersList (form) {
  return request({
    url: 'orders',
    method: 'get',
    params: form
  })
}

export function getKuaidiList (id) {
  return request({
    url: '/kuaidi/' + id,
    method: 'get'
  })
}
