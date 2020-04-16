<template>
  <el-container class="home">
<!--    顶部导航栏-->
    <el-header class="home-header">
      <div>
        <img src="~assets/img/logo.png" alt="">
        <span>OA辅助管理系统</span>
      </div>
      <div>
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
<!--      左边菜单栏-->
      <el-aside :width="isCollapse ? '64px' : '200px'" >
        <div class="aside-button" @click="isCollapseBtn">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true" :default-active="defaultActive">
<!--          一级菜单栏-->
          <el-submenu :index="'/'+item.path" v-for="item in listData" :key="item.id">
<!--            一级菜单栏模板-->
            <template slot="title">
<!--              图标-->
              <i :class="listIcon[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
<!--            二级菜单栏模板-->
            <el-menu-item :index="'/'+childItem.path" v-for="childItem in item.children" :key="childItem.id" @click="changeDefaultActive('/'+childItem.path)">
<!--              图标-->
              <i class="el-icon-menu"></i>
              <span>{{childItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
<!--      主界面-->
      <el-main >
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getHomeList } from '../../network/home/Home'

export default {
  name: 'Home',
  data () {
    return {
      listData: [],
      listIcon: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      defaultActive: ''
    }
  },
  created () {
    this.getHomeList()
    this.defaultActive = window.sessionStorage.getItem('defaultActive')
  },
  methods: {
    // 退出登录
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 改变菜单栏的伸缩状态
    isCollapseBtn () {
      this.isCollapse = !this.isCollapse
    },
    // 存储菜单栏的选中状态
    changeDefaultActive (Active) {
      window.sessionStorage.setItem('defaultActive', Active)
      this.defaultActive = Active
    },
    // 获取菜单数据
    getHomeList () {
      getHomeList().then(res => {
        // console.log(res)
        if (res.data.meta.status >= 300) return this.$message.error(res.data.meta.msg)
        this.listData = res.data.data
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .home {
    height: 100%;
  }
  .home-header {
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    color: #eee;
    padding-left: 0;
    align-items: center;
    font-size: 25px;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #EAEDF1;
  }
  .iconfont {
    margin-right: 10px;
  }
  .el-menu {
    border-right: 0 ;
  }
  .aside-button {
    background-color: #4A5064;
    text-align: center;
    line-height: 24px;
    color: white;
    font-size: 10px;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
