import { request } from '../request'

export function getRights (type = 'list') {
  return request({
    url: 'rights/' + type,
    method: 'get'
  })
}

export function getRoles () {
  return request({
    url: 'roles',
    method: 'get'
  })
}

export function deleteRightFromRoleIdRightId (roleId, rightId) {
  return request({
    url: 'roles/' + roleId + '/rights/' + rightId,
    method: 'delete'
  })
}

export function updateRightsNet (roleId, rids) {
  return request({
    url: 'roles/' + roleId + '/rights',
    method: 'post',
    data: {
      rids: rids
    }
  })
}

export function deleteRoleFromId (roleId) {
  return request({
    url: 'roles/' + roleId,
    method: 'delete'
  })
}

export function updateRoleFromId (roleId, roleName, roleDesc) {
  return request({
    url: 'roles/' + roleId,
    method: 'put',
    data: {
      roleName: roleName,
      roleDesc: roleDesc
    }
  })
}
