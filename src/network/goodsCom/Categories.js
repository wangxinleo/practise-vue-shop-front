import { request } from '../request'

export function getCategories (type, pageNum, pageSize) {
  return request({
    url: 'categories',
    method: 'get',
    params: {
      type: type,
      pagenum: pageNum,
      pagesize: pageSize
    }
  })
}
