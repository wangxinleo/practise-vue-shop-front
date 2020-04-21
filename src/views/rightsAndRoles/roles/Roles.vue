<template>
  <div class="Roles">
<!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    角色列表主体-->
    <el-card>
      <el-row>
        <el-col :span="5"><el-button type="primary">添加角色</el-button></el-col>
      </el-row>
      <el-table :data="tableData" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
<!--            一级权限-->
            <el-row v-for="(firstItem,index) in scope.row.children" :key="firstItem.id" :class="['first-item-bottom',index == 0 ? 'first-item-top':'']">
              <el-col :span="5">
                <el-tag closable @close="deleteRightFromRoleIdRightId(scope.row, firstItem.id)">{{firstItem.authName}}</el-tag>
                <i class="el-icon-caret-right" style="margin-left: 10px"></i>
              </el-col>
              <el-col :span="19">
<!--                二级权限-->
                <el-row v-for="(secItem,index) in firstItem.children" :key="secItem.id" :class="index == 0 ? '':'sec-item-top'">
                  <el-col :span="6">
                    <el-tag closable type="success"
                            @close="deleteRightFromRoleIdRightId(scope.row, secItem.id)">{{secItem.authName}}</el-tag>
                    <i class="el-icon-caret-right" style="margin-left: 10px"></i>
                  </el-col>
                  <el-col :span="18">
<!--                    三级权限-->
                        <el-tag v-for="thirdItem in secItem.children"
                                :key="thirdItem.id"
                                closable type="warning"
                                class="third-item"
                                @close="deleteRightFromRoleIdRightId(scope.row, thirdItem.id)">{{thirdItem.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateRoleBtn(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoleFromId(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="clickRightsBtn(scope.row)">分配权限</el-button>
<!--            <pre>-->
<!--              {{scope.row.children}}-->
<!--            </pre>-->
          </template>
        </el-table-column>
      </el-table>
    </el-card>
<!--      修改权限对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="updateRightsVisible"
      width="60%"
      @close="updateRightsClose">
      <el-tree :data="rightsData"
               :props="defaultProps"
               ref="rightsTree"
               node-key="id"
               :default-checked-keys="defaultCheckedKeys"
               show-checkbox default-expand-all></el-tree>
      <span slot="footer">
          <el-button @click="updateRightsVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateRights">确 定</el-button>
        </span>
    </el-dialog>
<!--    编辑角色信息对话框-->
    <el-dialog title="编辑角色" :visible.sync="updateRoleVisible" width="60%" @close="updateRoleClose">
      <el-form :model="updateRoleForm" :rules="updateRoleRules" ref="updateRoleForm" label-width="80px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="updateRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="updateRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="updateRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRights, getRoles, deleteRightFromRoleIdRightId, updateRightsNet, deleteRoleFromId, updateRoleFromId } from '../../../network/rightsAndRoles/RightsAndRoles'

export default {
  name: 'Roles',
  data () {
    return {
      // 角色表
      tableData: [],
      // 权限树弹出框
      updateRightsVisible: false,
      // 权限树
      rightsData: [],
      // el-tree 子树遍历规则
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 当前角色已有的权限
      defaultCheckedKeys: [],
      // 当前操作角色
      defaultCheckedRole: 0,
      // 编辑角色弹出框
      updateRoleVisible: false,
      updateRoleForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      updateRoleRules: {
        roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' }]
      }
    }
  },
  created () {
    // 初始加载
    this.getRolesList()
  },
  methods: {
    // 编辑角色
    updateRoleBtn (row) {
      this.updateRoleForm.id = row.id
      this.updateRoleForm.roleName = row.roleName
      this.updateRoleForm.roleDesc = row.roleDesc
      this.updateRoleVisible = true
    },
    // 关闭编辑角色
    updateRoleClose () {
      this.updateRoleVisible = false
    },
    // 提交修改角色信息
    updateRole () {
      console.log('提交修改角色信息')
      this.$refs.updateRoleForm.validate(validate => {
        if (!validate) return false
        this.updateRoleFromId(this.updateRoleForm.id, this.updateRoleForm.roleName, this.updateRoleForm.roleDesc)
      })
    },
    // 权限管理
    clickRightsBtn (row) {
      // 加载所有权限列表
      this.getRolesTree()
      // 获取当前角色已有的权限
      this.getRightsInRoles(row.children)
      // 获取当前操作角色
      this.defaultCheckedRole = row.id
      // 显示弹出框
      this.updateRightsVisible = true
    },
    // 关闭权限管理
    updateRightsClose () {
      // 还原初始状态
      this.rightsData = []
      this.defaultCheckedKeys = []
      this.defaultCheckedRole = 0
    },
    // 角色授权确定按钮
    updateRights () {
      // 组装已选中和半选中的权限成数组
      let keys = [
        ...this.$refs.rightsTree.getCheckedKeys(),
        ...this.$refs.rightsTree.getHalfCheckedKeys()
      ]
      // 转换成后台可识别的字符串参数
      keys = keys.join(',')
      // 提交角色授权
      this.updateRightsNet(this.defaultCheckedRole, keys)
    },
    // 取消对应角色对应ID权限（网络请求）
    deleteRightFromRoleIdRightId (role, rightId) {
      deleteRightFromRoleIdRightId(role.id, rightId).then(res => {
        // 弹窗确认
        this.$confirm('此操作将永久取消该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 确定
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          this.$message.success(res.data.meta.msg)
          role.children = res.data.data
          console.log(res)
        }).catch(() => {
          // 取消
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }).catch(err => {
        console.log(err)
      })
    },
    // 递归加载角色已有权限的id
    getRightsInRoles (parent) {
      parent.forEach((item) => {
        const child = item.children
        if (child) {
          this.getRightsInRoles(child)
        } else {
          this.defaultCheckedKeys.push(item.id)
        }
      })
    },
    // 加载数据（网络请求）
    getRolesList () {
      getRoles().then(res => {
        // 请求结果弹窗
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.tableData = res.data.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 加载所有权限列表-Tree(网络请求)
    getRolesTree () {
      getRights('tree').then(res => {
        // 请求结果弹窗
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.rightsData = res.data.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 角色授权(网络请求)
    updateRightsNet (roleId, rids) {
      updateRightsNet(roleId, rids).then(res => {
        // 弹窗确认
        this.$confirm('此操作将永久给予角色选中的权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 确定
          // 请求结果弹窗
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          this.$message.success(res.data.meta.msg)
          // 关闭角色授权页
          this.updateRightsVisible = false
          // 刷新列表
          this.getRolesList()
        }).catch(() => {
          // 取消
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }).catch(err => {
        console.log(err)
      })
    },
    // 删除角色(网络请求)
    deleteRoleFromId (roleId) {
      deleteRoleFromId(roleId).then(res => {
        // 弹窗确认
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 确定
          // 请求结果弹窗
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          this.$message.success(res.data.meta.msg)
          // 刷新列表
          this.getRolesList()
        }).catch(() => {
          // 取消
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }).catch(err => {
        console.log(err)
      })
    },
    // 编辑角色(网络请求)
    updateRoleFromId (id, roleName, roleDesc = '') {
      updateRoleFromId(id, roleName, roleDesc).then(res => {
        // 请求结果弹窗
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.$message.success(res.data.meta.msg)
        // 刷新列表
        this.updateRoleVisible = false
        this.getRolesList()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.el-row{
  display: flex;
  align-items: center;
}
.first-item-bottom{
  border-bottom: 1px solid #eee;
}
.first-item-top{
  border-top: 1px solid #eee;
}
.sec-item-top{
  border-top: 1px solid #eee;
}
.el-tag{
  margin: 10px 0;
}
.third-item{
  margin-right: 10px;
}
</style>
