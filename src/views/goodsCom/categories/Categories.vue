<template>
  <div class="Categories">
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片主体-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="addCategoryClick" >添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table :data="categoriesData"
                  :columns="columns"
                  :selection-type="false"
                  :expand-type="false"
                  :show-index="true"
                  index-text="#"
                  :show-row-hover="false"
                  border>
<!--        是否有效-->
        <template slot="isOk" slot-scope="scope">
          <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color: lightgreen"></i>
          <i v-if="scope.row.cat_deleted === true" class="el-icon-error" style="color: red"></i>
        </template>
<!--        排序-->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == 1" type="success" size="mini">二级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == 2" type="warning" size="mini">三级</el-tag>
        </template>
<!--        操作-->
        <template slot="option" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="update(scope.row.id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)">删除</el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="categoriesSizeChange"
        @current-change="categoriesCurrentChange"
        :current-page="pageNum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--      添加分类对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoryVisible"
      width="60%"
      @close="addCategoryClose">
      <el-form :model="addCategoryForm" :rules="addCategoryRules" ref="addCategoryForm" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoryForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectKeys"
            :options="categoriesParentData"
            :props="categoriesProps"
            @change="parentCateChange"
            clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
          <el-button @click="addCategoryVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCategorySubmit">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategories, addCategories } from '../../../network/goodsCom/Categories'

export default {
  name: 'Categories',
  data () {
    return {
      categoriesData: [],
      // tree-table列属性
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        prop: 'cat_deleted',
        type: 'template',
        template: 'isOk'
      }, {
        label: '排序',
        prop: 'cat_level',
        type: 'template',
        template: 'order'
      }, {
        label: '操作',
        width: '200px',
        minwidth: '200px',
        type: 'template',
        template: 'option'
      }],
      // categoriesData结构层数
      type: 3,
      // 数据参数
      pageNum: 1,
      pageSize: 10,
      total: 0,
      // 添加分类对话框
      addCategoryVisible: false,
      addCategoryForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addCategoryRules: {
        categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 父级分类的列表
      categoriesParentData: [],
      // 制定级联选择器的配置对象
      categoriesProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 选中的父级分类的Id数组
      selectKeys: []
    }
  },
  created () {
    this.getCategories()
  },
  methods: {
    // 选择项发生变化触发这个函数
    parentCateChange () {
      console.log(this.selectKeys)
      if (this.selectKeys.length > 0) {
        this.addCategoryForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.addCategoryForm.cat_level = this.selectKeys.length
      } else {
        this.addCategoryForm.cat_pid = 0
        this.addCategoryForm.cat_level = 0
      }
    },
    // "添加分类"关闭
    addCategoryClose () {
      this.addCategoryForm.cat_name = ''
      this.selectKeys = ''
      this.addCategoryVisible = false
    },
    // 提交“添加分类”
    addCategorySubmit () {
      this.addCategories()
      this.addCategoryVisible = false
    },
    // 分页
    categoriesSizeChange (val) {
      this.pageSize = val
      this.getCategories()
    },
    // 跳转页码
    categoriesCurrentChange (val) {
      this.pageNum = val
      this.getCategories()
    },
    // 添加分类按钮
    addCategoryClick () {
      this.addCategoryVisible = true
      this.getCategories(2, '', '')
    },
    // 获取分类数据(网络请求)
    getCategories (type = this.type, pageNum = this.pageNum, pageSize = this.pageSize) {
      getCategories(type, pageNum, pageSize).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        if (type === 2) {
          console.log(res)
          this.categoriesParentData = res.data.data
        } else {
          console.log(res)
          this.categoriesData = res.data.data.result
          this.total = res.data.data.total
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 创建分类(网络请求)
    addCategories (
      catPid = this.addCategoryForm.cat_pid,
      catName = this.addCategoryForm.cat_name,
      catLevel = this.addCategoryForm.cat_level) {
      addCategories(catPid, catName, catLevel).then(res => {
        console.log(res)
        if (res.data.meta.status !== 201) return this.$message.error(res.data.meta.msg)
        this.$message.success(res.data.meta.msg)
        this.getCategories()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.el-row{
  margin-bottom: 15px;
}
.el-cascader{
  width: 100%;
}
</style>
