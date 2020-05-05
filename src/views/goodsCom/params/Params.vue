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
          <el-col :span="6">
            <lable>选择商品分类：</lable>
          </el-col>
        </el-row>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'Params'
}
</script>

<style scoped>
.el-alert{
  margin-bottom: 15px;
}
</style>
