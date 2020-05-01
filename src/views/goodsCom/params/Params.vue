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
        实在是五一放假没啥好提交的啦，就这样吧
        没错，今天也没啥好说的
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'Params'
}
</script>

<style scoped>

</style>
