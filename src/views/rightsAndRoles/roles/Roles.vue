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
              <el-col :span="6">
                <el-tag closable>{{firstItem.authName}}</el-tag>
              </el-col>
              <el-col :span="18">
<!--                二级权限-->
                <el-row v-for="(secItem,index) in firstItem.children" :key="secItem.id" :class="index == 0 ? '':'sec-item-top'">
                  <el-col :span="6">
                    <el-tag closable type="success">{{secItem.authName}}</el-tag>
                  </el-col>
                  <el-col :span="18">
<!--                    三级权限-->
                        <el-tag v-for="thirdItem in secItem.children" :key="thirdItem.id" closable type="warning">{{thirdItem.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <pre>
              {{scope.row.children}}
            </pre>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
import { getRoles } from '../../../network/rightsAndRoles/RightsAndRoles'

export default {
  name: 'Roles',
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.getRoles()
  },
  methods: {
    getRoles () {
      getRoles().then(res => {
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.tableData = res.data.data
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
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
</style>
