<!--  -->
<template>
  <div class="goodsAdd">
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示文字 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="商品信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form ref="addGoodFormRef" :rules="addGoodRules" :model="addGoodForm"
        label-position="top" label-width="100px">
        <el-tabs tab-position="left" v-model="activeIndex"
          :before-leave="beforeTabsLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodForm.goods_price" type="number">
              </el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <!-- 级联选择器 -->
              <el-cascader v-model="addGoodForm.goods_cat"
                :options="categoriesData" :props="categoriesProps"
                @change="handleChange" clearable>
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData"
              :key="item.attr_id">
              <!-- 多选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="name" v-for="(name, i) in item.attr_vals"
                  :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData"
              :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload :action="uploadURL" :on-preview="handlePreview"
              :on-remove="handleRemove" list-type="picture"
              :headers="headersOBJ" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addBtn" @click="submitAdd">添加商品
            </el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="imgWidth" />
    </el-dialog>
  </div>
</template>

<script>
import { getCategories } from 'network/goodsCom/Categories'
import { getAttributesById } from 'network/goodsCom/Params'
import { addGood } from 'network/goodsCom/Goods'

import _ from 'lodash'
export default {
  name: 'GoodsAdd',
  components: {},
  data () {
    return {
      activeIndex: '0',
      // 商品分类的表单数据对象
      addGoodForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        goods_introduce: '',
        attrs: [],
        pics: []
      },
      addGoodRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      },
      categoriesData: [],
      categoriesProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态数据列表
      manyTableData: [],
      // 静态属性列表
      onlyTableData: [],
      // 图片上传url
      uploadURL: 'http://timemeetyou.com:8889/api/private/v1/upload',
      // 图片上传请求头
      headersOBJ: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片URL
      previewPath: '',
      previewVisible: false
    }
  },
  computed: {
    cateId () {
      if (this.addGoodForm.goods_cat.length === 3) {
        return this.addGoodForm.goods_cat[2]
      }
      return null
    }
  },
  // 监控data中的数据变化
  watch: {},
  methods: {
    // 提交添加商品
    submitAdd () {
      this.$refs.addGoodFormRef.validate(validate => {
        if (!validate) {
          this.$message.error('请填写必要的信息项!')
          return false
        }
        // 深拷贝form表单数据
        const form = _.cloneDeep(this.addGoodForm)
        form.goods_cat = form.goods_cat.join(',')
        // 拼接动态参数
        this.manyTableData.forEach(item => {
          const newAttr = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          form.attrs.push(newAttr)
        })
        // 拼接静态属性
        this.onlyTableData.forEach(item => {
          const newAttr = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          form.attrs.push(newAttr)
        })
        console.log(form)
        // 执行上传
        this.addGood(form)
      })
    },
    // 删除图片
    handleRemove (file) {
      // 获取文件临时路径
      const filePath = file.response.data.tmp_path
      // 找到对应索引值
      const i = this.addGoodForm.pics.findIndex(x => x.pics === filePath)
      // 利用splice函数删除对应记录
      this.addGoodForm.pics.splice(i, 1)
    },
    // 图片预览
    handlePreview (file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 图片上传成功钩子
    handleSuccess (res) {
      // 拼接路径对象
      const temp = { pic: res.data.tmp_path }
      // push进到数组
      this.addGoodForm.pics.push(temp)
    },
    // 点击标签页
    tabClick () {
      console.log(this.activeIndex)
      if (this.activeIndex === '1') {
        this.getAttributesById(this.cateId, 'many')
      } else if (this.activeIndex === '2') {
        this.getAttributesById(this.cateId, 'only')
      }
    },
    // 标签页切换前
    beforeTabsLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // 级联选择器发生变化
    handleChange () {
      console.log(this.addGoodForm.goods_cat)
    },
    // 获取商品分类数据
    getCategories (type = '', pageNum = '', pageSize = '') {
      getCategories(type, pageNum, pageSize)
        .then(res => {
          if (res.data.meta.status !== 200) { return this.$message.error(res.data.meta.msg) }
          this.$message.success(res.data.meta.msg)
          this.categoriesData = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取参数数据
    getAttributesById (id, sel) {
      getAttributesById(id, sel)
        .then(res => {
          if (res.data.meta.status !== 200) { return this.$message.error(res.data.meta.msg) }
          // 动态参数值转为数值
          if (res.data.data.length > 0 && sel === 'many') {
            res.data.data.forEach(item => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
            })
          }
          // 按需渲染
          sel === 'only'
            ? (this.onlyTableData = res.data.data)
            : (this.manyTableData = res.data.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 添加商品
    addGood (form) {
      addGood(form).then(res => {
        console.log(res)
        if (res.data.meta.status !== 201) { return this.$message.error(res.data.meta.msg) }
        this.$message.success(res.data.meta.msg)
        this.$router.push('/goods')
      }).catch(err => {
        console.log(err)
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.getCategories()
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () { },
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
.el-steps {
  margin: 10px auto;
}
.el-cascader {
  width: 50%;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.imgWidth {
  width: 100%;
}
.addBtn {
  margin-top: 10px;
}
</style>
