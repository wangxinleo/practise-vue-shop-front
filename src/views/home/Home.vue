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
      <el-aside width="200px" >
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item index="1-1"><i class="el-icon-location"></i>选项1</el-menu-item>
            <el-menu-item index="1-2"><i class="el-icon-location"></i>选项1</el-menu-item>
            <el-menu-item index="1-3"><i class="el-icon-location"></i>选项1</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航二</span>
            </template>
            <el-menu-item index="2-1"><i class="el-icon-location"></i>选项1</el-menu-item>
            <el-menu-item index="2-2"><i class="el-icon-location"></i>选项1</el-menu-item>
            <el-menu-item index="2-3"><i class="el-icon-location"></i>选项1</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航三</span>
            </template>
            <el-menu-item index="3-1"><i class="el-icon-location"></i>选项1</el-menu-item>
            <el-menu-item index="3-2"><i class="el-icon-location"></i>选项1</el-menu-item>
            <el-menu-item index="3-3"><i class="el-icon-location"></i>选项1</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航三</span>
            </template>
            <el-menu-item index="4-1"><i class="el-icon-location"></i>选项1</el-menu-item>
            <el-menu-item index="4-2"><i class="el-icon-location"></i>选项1</el-menu-item>
            <el-menu-item index="4-3"><i class="el-icon-location"></i>选项1</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
<!--      主界面-->
      <el-main >Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
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
</style>
