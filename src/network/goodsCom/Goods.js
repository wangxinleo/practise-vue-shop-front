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
 * @param {*} goodName 商品名称 | 不能为空
 * @param {*} goodCat 以为','分割的分类列表 | 不能为空
 * @param {Number} goodPrice 价格 | 不能为空
 * @param {Number} goodNum 数量 | 不能为空
 * @param {Number} goodWeight 重量 | 不能为空
 * @param {*} goodIntroduce 介绍 | 可以为空
 * @param {Array} pics 上传的图片临时路径（对象）| 可以为空
 * @param {Array} attrs 商品的参数（数组），包含 `动态参数` 和 `静态属性` | 可以为空
 */
export function addGood (goodName, goodCat, goodPrice, goodNum, goodWeight, goodIntroduce, pics, attrs) {
  return request({
    url: 'goods',
    method: 'post',
    data: {
      good_name: goodName,
      good_cat: goodCat,
      good_price: goodPrice,
      good_number: goodNum,
      good_weight: goodWeight,
      good_introduce: goodIntroduce,
      pics: pics,
      attrs: attrs
    }
  })
}
