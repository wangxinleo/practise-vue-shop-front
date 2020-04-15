<template>
    <div class="users">
<!--      面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
<!--      卡片视图区域-->
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="8">
<!--            搜索框-->
            <el-input placeholder="请输入内容" v-model="query" clearable @clear="queryClick">
              <el-button slot="append" icon="el-icon-search" @click="queryClick"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary">添加用户</el-button>
          </el-col>
        </el-row>
<!--        用户列表区域-->
        <el-table :data="usersList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="changeRowStateListen(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template>
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
              <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
<!--        分页区域-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
    </div>
</template>

<script>
import { getUsersList, changeRowState } from '../../network/users/Users'

export default {
  name: 'Users',
  data () {
    return {
      usersList: [],
      query: '',
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
  },
  created () {
    this.getUsersList(this.pageNum, this.pageSize, this.query)
  },
  methods: {
    // 显示多少条
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.getUsersList(this.pageNum, this.pageSize, this.query)
    },
    // 跳到第几页
    handleCurrentChange (pageNum) {
      this.pageNum = pageNum
      this.getUsersList(this.pageNum, this.pageSize, this.query)
    },
    // 改变用户行状态
    changeRowStateListen (row) {
      this.changeRowState(row)
    },
    // 搜索
    queryClick () {
      this.getUsersList(1, 10, this.query)
    },
    // 获取用户列表
    getUsersList (pageNum, pageSize, query) {
      getUsersList(pageNum, pageSize, query).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.usersList = res.data.data.users
        this.total = res.data.data.total
      })
    },
    // 更改用户状态
    changeRowState (row) {
      changeRowState(row.id, row.mg_state).then(res => {
        if (res.data.meta.status !== 200) {
          row.mg_state = !row.mg_state
          return this.$message.error(res.data.meta.msg)
        }
        this.$message.success(res.data.meta.msg)
      }).catch(err => {
        row.mg_state = !row.mg_state
        return this.$message.error(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
