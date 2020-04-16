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
            <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
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
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="update(scope.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
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
<!--      添加用户对话框-->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="60%"
        @close="handleClose">
        <el-form :model="addUserForm" :rules="addUserrules" ref="addUserForm" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
<!--      修改用户对话框-->
      <el-dialog
        title="修改用户"
        :visible.sync="updateUserVisible"
        width="60%"
        @close="updateUserClose">
        <el-form :model="updateUserForm" :rules="updateUserrules" ref="updateUserForm" label-width="70px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="updateUserForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="updateUserForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
              <el-input v-model="updateUserForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="updateUserVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateUser">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import { getUsersList, changeRowState, addUserPost, getUserFromId, updateUserSub, deleteUserById } from '../../network/users/Users'

export default {
  name: 'Users',
  data () {
    var checkEmail = (rule, value, cb) => {
      // 验证邮件的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入一个合法的邮箱地址'))
    }

    var checkMobile = (rule, value, cb) => {
      // 验证邮件的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入一个合法的手机号码'))
    }

    return {
      usersList: [],
      // 查询服务基础参数
      query: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      // 添加用户对话框状态
      dialogVisible: false,
      updateUserVisible: false,
      // 添加用户的表单数据
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户的表单数据
      updateUserForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 添加用户的input验证
      addUserrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户数据的input验证
      updateUserrules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUsersList()
  },
  methods: {
    // 显示多少条
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.getUsersList()
    },
    // 跳到第几页
    handleCurrentChange (pageNum) {
      this.pageNum = pageNum
      this.getUsersList()
    },
    // 状态按钮
    changeRowStateListen (row) {
      this.changeRowState(row)
    },
    // 搜索按钮
    queryClick () {
      this.getUsersList(1, 10)
    },
    // 修改用户按钮
    update (id) {
      console.log(id)
      this.getUserFromId(id)
      this.updateUserVisible = true
    },
    // 删除用户按钮
    deleteUser (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteUserById(id)
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // "添加用户"弹出框关闭监听
    handleClose () {
      this.$refs.addUserForm.resetFields()
    },
    // "修改用户"弹出框关闭监听
    updateUserClose () {
      this.$refs.updateUserForm.resetFields()
    },
    // "添加用户"中的确定按钮
    addUser () {
      this.$refs.addUserForm.validate(validate => {
        if (!validate) return false
        this.addUserPost(this.addUserForm.username, this.addUserForm.password, this.addUserForm.email, this.addUserForm.mobile)
        this.dialogVisible = false
      })
    },
    // "修改用户"中的确定按钮
    updateUser () {
      this.$refs.updateUserForm.validate(validate => {
        if (!validate) return false
        this.updateUserSub(this.updateUserForm.id, this.updateUserForm.email, this.updateUserForm.mobile)
      })
    },
    // 获取用户列表{网络请求}
    getUsersList (pageNum = this.pageNum, pageSize = this.pageSize, query = this.query) {
      getUsersList(pageNum, pageSize, query).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.usersList = res.data.data.users
        this.total = res.data.data.total
      }).catch(err => {
        console.log(err)
      })
    },
    // 更新用户状态{网络请求}
    changeRowState (row) {
      changeRowState(row.id, row.mg_state).then(res => {
        if (res.data.meta.status !== 200) {
          row.mg_state = !row.mg_state
          return this.$message.error(res.data.meta.msg)
        }
        this.$message.success(res.data.meta.msg)
      }).catch(err => {
        console.log(err)
      })
    },
    // 添加用户{网络请求}
    addUserPost (username, password, email, mobile) {
      addUserPost(username, password, email, mobile).then(res => {
        console.log(res)
        if (res.data.meta.status !== 201) return this.$message.error(res.data.meta.msg)
        this.$message.success(res.data.meta.msg)
        this.getUsersList()
      }).catch(err => {
        console.log(err)
      })
    },
    // 更新用户{网络请求}
    updateUserSub (id, email, mobile) {
      updateUserSub(id, email, mobile).then(res => {
        console.log(res)
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.$message.success(res.data.meta.msg)
        this.updateUserVisible = false
        this.getUsersList()
      }).catch(err => {
        console.log(err)
      })
    },
    // 根据id查询用户{网络请求}
    getUserFromId (id) {
      getUserFromId(id).then(res => {
        console.log(res)
        this.updateUserForm = res.data.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 根据id删除用户{网络请求}
    deleteUserById (id) {
      deleteUserById(id).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.$message.success(res.data.meta.msg)
        this.getUsersList()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
