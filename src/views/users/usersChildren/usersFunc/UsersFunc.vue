<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <!--搜索框-->
      <el-input placeholder="请输入内容" v-model="query" clearable @clear="queryClick">
        <el-button slot="append" icon="el-icon-search" @click="queryClick"></el-button>
      </el-input>
    </el-col>
    <el-col :span="4">
      <!--添加用户-->
      <el-button type="primary" @click="addUserClick">添加用户</el-button>
    </el-col>
    <!--添加用户弹出框-->
    <add-user-dialog ref="addUserDialog" @addUserCancel = "addUserCancel"></add-user-dialog>
  </el-row>
</template>

<script>
import addUserDialog from './addUserDialog'
export default {
  name: 'UsersFunc',
  components: {
    addUserDialog
  },
  data () {
    return {
      query: '',
      // 添加用户对话框状态
      addUserVisible: false
    }
  },
  methods: {
    // 搜索按钮
    queryClick () {
      this.$emit('queryClick', this.query)
    },
    // 添加用户按钮
    addUserClick () {
      // 调用子组件方法
      this.$refs.addUserDialog.addUserClick()
    },
    // 取消添加用户
    addUserCancel () {
      this.addUserVisible = false
    }
  }
}
</script>

<style scoped>

</style>
