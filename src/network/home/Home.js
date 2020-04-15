import { request } from '../request'

export function getHomeList () {
  return request({
    url: '/menus',
    method: 'get'
  })
}
