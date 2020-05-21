/*
 * @Author: wangxin.leo
 * @Date: 2020-05-21 11:35:25
 * @Last Modified by: wangxin.leo
 * @Last Modified time: 2020-05-21 23:00:40
 */
<template>
  <div class="params">
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片主体-->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning"></el-alert>
      <el-row>
        <el-col :span="12">
          <span>选择商品分类：</span>
          <!--            级联选择器-->
          <el-cascader v-model="selectKeys" :options="categoriesData"
            :props="categoriesProps" @change="categoriesChange" clearable>
          </el-cascader>
        </el-col>
      </el-row>
      <!--        标签页-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="dynamic">
          <el-row>
            <el-col :span="4">
              <el-button type="primary" size="mini" class="add-attr"
                :disabled="isBtnDisplay" @click="openAdd">
                {{ "添加" + paramsOrAttr }}
              </el-button>
            </el-col>
            <el-table :data="dynamicData" border stripe>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag :key="i" v-for="(tag, i) in scope.row.attr_vals"
                    closable :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{ tag }}
                  </el-tag>
                  <el-input v-if="scope.row.inputVisible" class="inputTag"
                    v-model="scope.row.inputValue" ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <el-button v-else size="small" @click="showInput(scope.row)">+
                    New Tag
                  </el-button>
                  <div>{{ scope.row }}</div>
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column prop="attr_name" label="属性名称">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button icon="el-icon-edit" type="primary"
                    @click="openEdit(scope.row)" size="mini">修改
                  </el-button>
                  <el-button icon="el-icon-delete" type="danger"
                    @click="deleteByAttrId(scope.row)" size="mini">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="static">
          <el-row>
            <el-col :span="4">
              <el-button type="primary" size="mini" class="add-attr"
                :disabled="isBtnDisplay" @click="openAdd">
                {{ "添加" + paramsOrAttr }}
              </el-button>
            </el-col>
            <el-table :data="dynamicData" border stripe>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  {{ scope.row }}
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column prop="attr_name" label="属性名称"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button icon="el-icon-edit" type="primary"
                    @click="openEdit(scope.row)" size="mini">修改
                  </el-button>
                  <el-button icon="el-icon-delete" type="danger"
                    @click="deleteByAttrId(scope.row)" size="mini">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--      添加窗口-->
    <el-dialog :title="'添加' + paramsOrAttr" :visible.sync="addParamsVisible"
      @close="addParamsClose" width="50%">
      <el-form :model="addForm" :rules="addrules" ref="addForm"
        label-width="80px">
        <el-form-item :label="paramsOrAttr" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFormSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!--      修改窗口-->
    <el-dialog :title="'修改' + paramsOrAttr" :visible.sync="editParamsVisible"
      @close="editParamsClose" width="50%">
      <el-form :model="editForm" :rules="editrules" ref="editForm"
        label-width="80px">
        <el-form-item :label="paramsOrAttr" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategories } from '../../../network/goodsCom/Categories'
import {
  getAttributesById,
  getParamsByAttrId,
  addParams,
  editParams,
  deleteByAttrId
} from '../../../network/goodsCom/Params'

export default {
  name: 'Params',
  data () {
    return {
      // 级联选择器选中id
      selectKeys: [],
      // 级联选择器数据
      categoriesData: [],
      // 级联选择器属性
      categoriesProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 标签页默认
      activeName: 'dynamic',
      // 动态属性数据
      dynamicData: [],
      // 添加对话框
      addParamsVisible: false,
      addForm: {
        name: ''
      },
      addrules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      // 修改对话框
      editParamsVisible: false,
      editForm: {
        attrId: '',
        name: ''
      },
      editrules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getCategories()
  },
  computed: {
    paramsOrAttr () {
      if (this.activeName === 'dynamic') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
    isBtnDisplay () {
      if (this.selectKeys.length !== 3) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    // 选中标签页改变
    handleClick () {
      if (this.isBtnDisplay === true) return false
      const id = this.selectKeys[this.selectKeys.length - 1]
      const sel = this.activeName === 'dynamic' ? 'many' : 'only'
      this.getAttributesById(id, sel)
    },
    // 级联选择器数据改变
    categoriesChange () {
      const id = this.selectKeys[this.selectKeys.length - 1]
      const sel = this.activeName === 'dynamic' ? 'many' : 'only'
      this.getAttributesById(id, sel)
    },
    // 删除tag标签
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    // tag标签展示input标签
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // input标签提交
    handleInputConfirm (row) {
      // 校验输入是否有效
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return ，做后续处理
      row.attr_vals.push(row.inputValue.trim())
      // TODO:更新修改后的数据到数据库
      row.inputVisible = false
      row.inputValue = ''
    },
    // 打开"添加"对话框
    openAdd () {
      this.addParamsVisible = true
    },
    // 关闭"添加"对话框
    addParamsClose () {
      this.addForm.name = ''
      this.addParamsVisible = false
    },
    // 提交表单
    addFormSubmit () {
      this.$refs.addForm.validate(validate => {
        if (!validate) return false
        const id = this.selectKeys[this.selectKeys.length - 1]
        const name = this.addForm.name
        const sel = this.activeName === 'dynamic' ? 'many' : 'only'
        this.addParams(id, name, sel)
        this.addParamsVisible = false
      })
    },
    // 打开"修改"对话框
    openEdit (row) {
      this.editForm.name = row.attr_name
      this.editForm.attrId = row.attr_id
      this.editParamsVisible = true
    },
    // 关闭"修改"对话框
    editParamsClose () {
      this.editForm.name = ''
      this.editForm.attrId = ''
      this.editParamsVisible = false
    },
    // 提交"修改"表单
    editFormSubmit () {
      this.$refs.editForm.validate(validate => {
        if (!validate) return false
        const id = this.selectKeys[this.selectKeys.length - 1]
        const attrId = this.editForm.attrId
        const name = this.editForm.name
        const sel = this.activeName === 'dynamic' ? 'many' : 'only'
        this.editParams(id, attrId, name, sel)
        this.editParamsVisible = false
      })
    },
    // 获取分类数据(网络请求)
    getCategories (type = '', pageNum = '', pageSize = '') {
      getCategories(type, pageNum, pageSize)
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error(res.data.meta.msg)
          }
          // 存放数据
          this.categoriesData = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 根据id获取分类详细参数(网络请求)
    getAttributesById (id, sel) {
      getAttributesById(id, sel)
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error(res.data.meta.msg)
          }
          console.log(res)
          // 将详细参数信息变为数组
          res.data.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            // 控制文本显示与隐藏
            item.inputVisible = false
            // 文本内容
            item.inputValue = ''
          })
          this.dynamicData = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 根据id和attrId获取参数数据(网络请求)
    getParamsByAttrId (id, attrId, attrSel, attrVals = '') {
      getParamsByAttrId(id, attrId, attrSel, attrVals)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 添加动态参数或者静态属性(网络请求)
    addParams (id, attrName, attrSel, attrVals = '') {
      addParams(id, attrName, attrSel, attrVals)
        .then(res => {
          console.log(res)
          if (res.data.meta.status !== 201) {
            return this.$message.error(res.data.meta.msg)
          }
          this.$message.success(res.data.meta.msg)
          // 更新分区
          this.getAttributesById(id, attrSel)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 修改动态参数或者静态属性(网络请求)
    editParams (id, attrId, attrName, attrSel, attrVals = '') {
      editParams(id, attrId, attrName, attrSel, attrVals)
        .then(res => {
          console.log(res)
          if (res.data.meta.status !== 200) {
            return this.$message.error(res.data.meta.msg)
          }
          this.$message.success(res.data.meta.msg)
          // 更新分区
          this.getAttributesById(id, attrSel)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 根据id删除参数(网络请求)
    deleteByAttrId (row) {
      const id = this.selectKeys[this.selectKeys.length - 1]
      const attrId = row.attr_id
      const attrSel = this.activeName === 'dynamic' ? 'many' : 'only'
      deleteByAttrId(id, attrId).then(res => {
        console.log(res)
        // 弹窗确认
        this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 确定
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          this.$message.success(res.data.meta.msg)
          this.getAttributesById(id, attrSel)
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
    }
  }
}
</script>

<style scoped>
.el-alert {
  margin-bottom: 15px;
}
.el-cascader {
  width: 70%;
}
.add-attr {
  margin-bottom: 15px;
}
.el-tag {
  margin-right: 15px;
}
.inputTag {
  max-width: 150px;
}
</style>
