/*
 * @Author: wangxin.leo
 * @Date: 2020-05-27 10:02:10
 * @Last Modified by: wangxin.leo
 * @Last Modified time: 2020-05-27 14:49:13
 */
<!-- Order.vue -->
<template>
  <div class='Order'>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderList" style="width: 100%" border>
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80px">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="80px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '0'" type="danger">未付款
            </el-tag>
            <el-tag v-else-if="scope.row.pay_status === '1'" type="success">已付款
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80px">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="200px">
          <template slot-scope="scope">
            {{scope.row.create_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              @click="showEdit(scope.row)"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location"
              @click="showLocation(scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页选择器 -->
      <el-pagination @size-change="pageSizeChange"
        @current-change="pagenumChange" :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 修改对话框 -->
    <el-dialog title="修改地址" :visible.sync="editOrderVisible" width="50%"
      :before-close="editOrderClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef"
        label-width="100px">
        <el-form-item label="省市区/县" prop="address">
          <el-cascader :options="cityOptions" v-model="editForm.address">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit()">确 定
        </el-button>
      </span>
    </el-dialog>
    <!-- 快递查询对话框 -->
    <el-dialog title="查看物流进度" :visible.sync="showLocationVisible" width="50%"
      :before-close="showLocationClose">
      <el-timeline :reverse="true">
        <el-timeline-item v-for="(activity, index) in kuaidiList" :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrdersList, getKuaidiList } from 'network/order/order.js'

import cityOptions from 'common/city_data2017_element.js'

export default {
  name: 'Order',
  components: {},
  data () {
    return {
      // 订单信息属性
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      // 订单修改窗口
      editOrderVisible: false,
      editForm: {
        address: '',
        address2: ''
      },
      editFormRules: {
        address: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      // 中国省份数据
      cityOptions: cityOptions,
      // 快递查询窗口
      showLocationVisible: false,
      kuaidiList: []
    }
  },
  computed: {},
  // 监控data中的数据变化
  watch: {},
  methods: {
    // 打开快递查询窗口
    showLocation (row) {
      this.getKuaidiList()
      this.showLocationVisible = true
    },
    // 快递查询窗口关闭
    showLocationClose () {
      this.showLocationVisible = false
    },
    // 提交修改
    submitEdit () {
      this.$refs.editFormRef.validate(validate => {
        if (!validate) {
          return false
        }
        this.editOrderVisible = false
      })
    },
    // 打开修改窗口
    showEdit (row) {
      this.editOrderVisible = true
    },
    // 关闭修改窗口
    editOrderClose () {
      this.editOrderVisible = false
    },
    // 选择第几页
    pagenumChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrdersList()
    },
    // 每页最大呈现数
    pageSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    // 获得列表数据
    getOrdersList () {
      getOrdersList(this.queryInfo).then(res => {
        // console.log(res)
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.total = res.data.data.total
        this.orderList = res.data.data.goods
      }).catch(err => {
        console.log(err)
      })
    },
    // 获得物流信息
    getKuaidiList (id = '1106975712662') {
      getKuaidiList(id).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.kuaidiList = [
          {
            time: '2018-05-10 09:39:00',
            ftime: '2018-05-10 09:39:00',
            context: '已签收,感谢使用顺丰,期待再次为您服务',
            location: ''
          },
          {
            time: '2018-05-10 08:23:00',
            ftime: '2018-05-10 08:23:00',
            context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
            location: ''
          },
          {
            time: '2018-05-10 07:32:00',
            ftime: '2018-05-10 07:32:00',
            context: '快件到达 [北京海淀育新小区营业点]',
            location: ''
          },
          {
            time: '2018-05-10 02:03:00',
            ftime: '2018-05-10 02:03:00',
            context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
            location: ''
          },
          {
            time: '2018-05-09 23:05:00',
            ftime: '2018-05-09 23:05:00',
            context: '快件到达 [北京顺义集散中心]',
            location: ''
          },
          {
            time: '2018-05-09 21:21:00',
            ftime: '2018-05-09 21:21:00',
            context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
            location: ''
          },
          {
            time: '2018-05-09 13:07:00',
            ftime: '2018-05-09 13:07:00',
            context: '顺丰速运 已收取快件',
            location: ''
          },
          {
            time: '2018-05-09 12:25:03',
            ftime: '2018-05-09 12:25:03',
            context: '卖家发货',
            location: ''
          },
          {
            time: '2018-05-09 12:22:24',
            ftime: '2018-05-09 12:22:24',
            context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
            location: ''
          },
          {
            time: '2018-05-08 21:36:04',
            ftime: '2018-05-08 21:36:04',
            context: '商品已经下单',
            location: ''
          }
        ]
      }).catch(err => {
        console.log(err)
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.getOrdersList()
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  },
  beforeCreate () { }, // 生命周期 - 创建之前
  beforeMount () { }, // 生命周期 - 挂载之前
  beforeUpdate () { }, // 生命周期 - 更新之前
  updated () { }, // 生命周期 - 更新之后
  beforeDestroy () { }, // 生命周期 - 销毁之前
  destroyed () { }, // 生命周期 - 销毁完成
  activated () { } // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
