import { request } from '../request'
/**
 *
 * @param {*} type
 * @param {*} pageNum
 * @param {*} pageSize
 */
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
/**
 *
 * @param {*} catPid
 * @param {*} catName
 * @param {*} catLevel
 */
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

export function deleteCategoriesById (id) {
  return request({
    url: 'categories/' + id,
    method: 'delete'
  })
}

export function updateCategories (id, name) {
  return request({
    url: 'categories/' + id,
    method: 'put',
    data: {
      cat_name: name
    }
  })
}
