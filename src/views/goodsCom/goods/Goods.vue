<template>
  <div class="goods">
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片主体-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!--搜索框-->
          <el-input placeholder="请输入内容" v-model="query" clearable @clear="queryClick">
            <el-button slot="append" icon="el-icon-search" @click="queryClick"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!--添加商品-->
          <el-button type="primary" @click="addGoodClick">添加商品</el-button>
        </el-col>
        <!--添加商品弹出框-->
      </el-row>
      <el-table :data="goodsData" style="width: 100%" stripe border>
        <el-table-column type="index" label="#" ></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" ></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="100" ></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="150"></el-table-column>
        <el-table-column label="操作" width="120">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="update(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getGoods } from '../../../network/goodsCom/Goods'

export default {
  name: 'Goods',
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 10,
      total: 0,
      goodsData: []
    }
  },
  created () {
    this.getGoods()
  },
  methods: {
    // 清空搜索栏
    queryClick () {
      console.log('queryClick')
    },
    addGoodClick () {
      console.log('addGoodClick')
    },
    // 获取商品数据(网络请求)
    getGoods (query = this.query, pagenum = this.pagenum, pagesize = this.pagesize) {
      getGoods(query, pagenum, pagesize).then(res => {
        console.log(res)
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.status)
        this.goodsData = res.data.data.goods
        this.pagenum = res.data.data.pagenum
        this.total = res.data.data.total
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
