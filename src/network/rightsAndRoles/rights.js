import { request } from '../request'

export function getRights (type = 'list') {
  return request({
    url: 'rights/' + type,
    method: 'get'
  })
}
