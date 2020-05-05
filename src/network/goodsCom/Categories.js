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

export function addCategories (catPid, catName, catLevel) {
  return request({
    url: 'categories',
    method: 'post',
    data: {
      cat_pid: catPid,
      cat_name: catName,
      cat_level: catLevel
    }
  })
}
