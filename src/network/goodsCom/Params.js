import { request } from '../request'

export function getAttributesById (id, sel) {
  return request({
    url: 'categories/' + id + '/attributes',
    method: 'get',
    params: {
      sel: sel
    }
  })
}

export function getParamsByAttrId (id, attrId, attrSel, attrVals) {
  return request({
    url: 'categories/' + id + '/attributes/' + attrId,
    method: 'get',
    params: {
      attr_sel: attrSel,
      attr_vals: attrVals
    }
  })
}
