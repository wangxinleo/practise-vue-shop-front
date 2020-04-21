<template>
  <div class="rights">
<!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    权限列表主体-->
    <el-card>
      <el-table
        :data="tableData" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag v-else-if="scope.row.level == 1" type="success">二级</el-tag>
            <el-tag v-else-if="scope.row.level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>

</template>

<script>
import { getRights } from 'network/rightsAndRoles/RightsAndRoles'

export default {
  name: 'Rights',
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    getRightsList () {
      getRights('list').then(res => {
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.tableData = res.data.data
        // console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
