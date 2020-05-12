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
<!--            级联选择器-->
            <el-cascader
              v-model="selectKeys"
              :options="categoriesData"
              :props="categoriesProps"
              @change="categoriesChange"
              clearable></el-cascader>
          </el-col>
        </el-row>
<!--        标签页-->
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="dynamic">
            <el-row>
              <el-col :span="4">
                <el-button type="primary" size="mini" class="add-attr">添加属性</el-button>
              </el-col>
              <el-table
                :data="dynamicData"
                style="width: 100%"
                @expand-change="openRow" border stripe>
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-tag
                      :key="tag"
                      v-for="tag in dynamicTags"
                      closable
                      :disable-transitions="false"
                      @close="handleClose(tag)">
                      {{tag}}
                    </el-tag>
                    <el-input
                      v-if="inputVisible"
                      v-model="inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm"
                      @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else size="small" @click="showInput">+ New Tag</el-button>
                    <div>{{scope.row}}</div>
                  </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="attr_name" label="属性名称"></el-table-column>
                <el-table-column label="操作">
                  <template>
                    <el-button icon="el-icon-edit" type="primary" size="mini">修改</el-button>
                    <el-button icon="el-icon-delete" type="danger" size="mini">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="静态参数" name="static">
            <el-row>
              <el-col :span="4">
                <el-button type="primary" size="mini" class="add-attr">添加属性</el-button>
              </el-col>
              <el-table
                :data="staticData"
                style="width: 100%" border stripe>
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    {{scope.row}}
                  </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="attr_name" label="属性名称"></el-table-column>
                <el-table-column label="操作">
                  <template>
                    <el-button icon="el-icon-edit" type="primary" size="mini">修改</el-button>
                    <el-button icon="el-icon-delete" type="danger" size="mini">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
</template>

<script>
import { getCategories } from '../../../network/goodsCom/Categories'
import { getAttributesById, getParamsByAttrId } from '../../../network/goodsCom/Params'

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
      // 静态属性数据
      staticData: [],
      // 动态数据标签
      dynamicTags: ['标签一', '标签二', '333333'],
      inputVisible: false,
      inputValue: ''
    }
  },
  created () {
    this.getCategories()
  },
  methods: {
    // 选中标签页改变
    handleClick () {
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
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // input标签提交
    handleInputConfirm () {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    // 展开列触发
    openRow (row, expandedRows) {
      if (expandedRows.length === 0) return false
      console.log(expandedRows[0].attr_id)
    },
    // 获取分类数据(网络请求)
    getCategories (type = '', pageNum = '', pageSize = '') {
      getCategories(type, pageNum, pageSize).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.categoriesData = res.data.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 根据id获取分类详细参数(网络请求)
    getAttributesById (id, sel) {
      getAttributesById(id, sel).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        sel === 'only' ? this.staticData = res.data.data : this.dynamicData = res.data.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 根据id和attrId获取参数数据(网络请求)
    getParamsByAttrId (id, attrId, attrSel, attrVals = '') {
      getParamsByAttrId(id, attrId, attrSel, attrVals).then(res => {
        console.log(res)
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
.add-attr{
  margin-bottom: 15px;
}
</style>
