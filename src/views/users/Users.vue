<template>
    <div class="users">
<!--      面包屑导航-->
      <users-breadcrumb></users-breadcrumb>
<!--      卡片视图区域-->
      <el-card class="box-card">
<!--        顶部功能栏-->
        <users-func @queryClick = "queryClick"></users-func>
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
import UsersBreadcrumb from './usersChildren/usersBreadcrumb/UsersBreadcrumb'
import UsersFunc from './usersChildren/usersFunc/UsersFunc'
// 网络接口
import { changeRowState, deleteUserById, getUserFromId, getUsersList, updateUserSub } from '../../network/users/Users'

export default {
  name: 'Users',
  components: {
    UsersBreadcrumb,
    UsersFunc
  },
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
      updateUserVisible: false,
      // 修改用户的表单数据
      updateUserForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
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
    // 搜索按钮
    queryClick (query) {
      this.query = query
      // 修正页码定位，防止修改后页码乱窜
      this.pageNum = 1
      this.pageSize = 10
      this.getUsersList(1, 10)
    },
    // "修改用户"弹出框关闭监听
    updateUserClose () {
      this.$refs.updateUserForm.resetFields()
    },
    // "修改用户"中的确定按钮
    updateUser () {
      this.$refs.updateUserForm.validate(validate => {
        if (!validate) return false
        this.updateUserSub(this.updateUserForm.id, this.updateUserForm.email, this.updateUserForm.mobile)
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
    // 根据id删除用户{网络请求}
    deleteUserById (id) {
      deleteUserById(id).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.$message.success(res.data.meta.msg)
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
    }
  }
}
</script>

<style scoped>

</style>
