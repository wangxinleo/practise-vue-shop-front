import { request } from '../request'

export function getMap () {
  return request({
    url: 'reports/type/1',
    method: 'get'
  })
}
