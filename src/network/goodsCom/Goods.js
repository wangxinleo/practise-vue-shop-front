import { request } from '../request'
/**
 *
 * @param {*} query 查询参数 | 可以为空
 * @param {*} pagenum 当前页码 | 不能为空
 * @param {*} pagesize 每页显示条数 | 不能为空
 */
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
/**
 *
 * @param {Number} id 商品id
 */
export function deleteGoodFromId (id) {
  return request({
    url: 'goods/' + id,
    method: 'delete'
  })
}

/**
 *
 * @param {*} form
 */
export function addGood (form) {
  return request({
    url: 'goods',
    method: 'post',
    data: {
      goods_name: form.goods_name,
      goods_cat: form.goods_cat,
      goods_price: form.goods_price,
      goods_number: form.goods_number,
      goods_weight: form.goods_weight,
      goods_introduce: form.goods_introduce,
      pics: form.pics,
      attrs: form.attrs
    }
  })
}
