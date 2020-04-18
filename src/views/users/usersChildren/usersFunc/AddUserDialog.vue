<template>
  <!--      添加用户对话框-->
  <el-dialog
    title="添加用户"
    :visible.sync="addUserVisible"
    width="60%"
    @close="addUserCancel">
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
    <span slot="footer">
          <el-button @click="addUserCancel">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
  </el-dialog>
</template>

<script>
import { addUserPost } from '../../../../network/users/Users'

export default {
  name: 'addUserDialog',
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
      addUserVisible: false,
      // 添加用户的表单数据
      addUserForm: {
        username: '',
        password: '',
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
      }
    }
  },
  methods: {
    // 添加用户触发窗口
    addUserClick () {
      this.addUserVisible = true
    },
    // 取消添加用户
    addUserCancel () {
      this.addUserVisible = false
      this.$refs.addUserForm.resetFields()
    },
    // "添加用户"中的确定按钮
    addUser () {
      this.$refs.addUserForm.validate(validate => {
        if (!validate) return false
        this.addUserPost(this.addUserForm.username, this.addUserForm.password, this.addUserForm.email, this.addUserForm.mobile)
        this.addUserVisible = false
      })
    },
    // 添加用户{网络请求}
    addUserPost (username, password, email, mobile) {
      addUserPost(username, password, email, mobile).then(res => {
        console.log(res)
        if (res.data.meta.status !== 201) return this.$message.error(res.data.meta.msg)
        this.$message.success(res.data.meta.msg)
        this.$bus.$emit('freshClick')
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
