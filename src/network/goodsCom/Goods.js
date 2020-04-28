import { request } from '../request'

export function getGoods (query, pagenum, pagesize) {
  return request({
    url: 'goods',
    method: 'get',
    params: {
      query: query,
      pagenum: pagenum,
      pagesize: pagesize
    }
  })
}

export function deleteGoodFromId (id) {
  return request({
    url: 'goods/' + id,
    method: 'delete'
  })
}
