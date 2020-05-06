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
        <el-alert
          title="注意：只允许为第三级分类设置相关参数！"
          type="warning">
        </el-alert>
        <el-row>
          <el-col :span="12">
            <span>选择商品分类：</span>
            <el-cascader
              v-model="selectKeys"
              :options="categoriesData"
              :props="categoriesProps"
              @change="categoriesChange"
              clearable></el-cascader>
          </el-col>
        </el-row>
      </el-card>
    </div>
</template>

<script>
import { getCategories } from '../../../network/goodsCom/Categories'

export default {
  name: 'Params',
  data () {
    return {
      selectKeys: [],
      categoriesData: [],
      categoriesProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  created () {
    this.getCategories()
  },
  methods: {
    categoriesChange () {
      console.log('改变')
    },
    // 获取分类数据(网络请求)
    getCategories (type = '', pageNum = '', pageSize = '') {
      getCategories(type, pageNum, pageSize).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        console.log(res)
        this.categoriesData = res.data.data
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.el-alert{
  margin-bottom: 15px;
}
.el-cascader{
  width: 70%;
}
</style>
