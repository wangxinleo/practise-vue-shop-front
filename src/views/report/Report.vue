/*
 * @Author: wangxin.leo
 * @Date: 2020-05-27 14:58:30
 * @Last Modified by: wangxin.leo
 * @Last Modified time: 2020-05-27 16:32:37
 */
<!-- Report.vue -->
<template>
  <div class='Report'>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'

import { getMap } from '@/network/report/report'
export default {
  name: 'Report',
  components: {},
  data () {
    return {
      // 图表数据流
      oldOption: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  computed: {},
  // 监控data中的数据变化
  watch: {},
  methods: {
    getMap () {
      getMap().then(res => {
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'))
        // 合并配置项和数据
        const result = _.merge(res.data.data, this.oldOption)
        // // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(result)
      }).catch(err => {
        console.log(err)
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    this.getMap()
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
</style>
