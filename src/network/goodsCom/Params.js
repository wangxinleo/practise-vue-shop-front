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
export function addParams (id, attrName, attrSel, attrVals) {
  return request({
    url: 'categories/' + id + '/attributes',
    method: 'post',
    data: {
      attr_name: attrName,
      attr_sel: attrSel,
      attr_vals: attrVals
    }
  })
}

export function editParams (id, attrId, attrName, attrSel, attrVals) {
  return request({
    url: 'categories/' + id + '/attributes/' + attrId,
    method: 'put',
    data: {
      attr_name: attrName,
      attr_sel: attrSel,
      attr_vals: attrVals
    }
  })
}

export function deleteByAttrId (id, attrId) {
  return request({
    url: 'categories/' + id + '/attributes/' + attrId,
    method: 'delete'
  })
}
