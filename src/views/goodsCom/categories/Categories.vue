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
                  index-text="#" border>
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
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="addCategoryForm.categoryName"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="categoryParent">
          <el-input v-model="addCategoryForm.categoryParent"></el-input>
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
import { getCategories } from '../../../network/goodsCom/Categories'

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
        categoryName: '',
        categoryParent: ''
      },
      addCategoryRules: {
        categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        categoryParent: [{ required: true, message: '请选择有效的父级分类', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getCategories()
  },
  methods: {
    // "添加分类"关闭
    addCategoryClose () {
      this.addCategoryVisible = false
    },
    // 提交“添加分类”
    addCategorySubmit () {
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
      console.log('addCategoryClick')
    },
    // 获取分类数据(网络请求)
    getCategories (type = this.type, pageNum = this.pageNum, pageSize = this.pageSize) {
      getCategories(type, pageNum, pageSize).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.categoriesData = res.data.data.result
        this.total = res.data.data.total
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
</style>
