# vue_shop

## 介绍

跟着[2019 黑马前端 element 课程](https://www.bilibili.com/video/BV1EE411B7SU?from=search&seid=17690394498499497084)学习的代码项目。
<br/>
本项目使用的后台 API 接口是 [洛天依保护协会](https://space.bilibili.com/132108522?spm_id_from=333.788.b_636f6d6d656e74.26)提供的公用后台 API 接口
<br/>
黑马前端官方课程地址：
前端项目地址：[http://shop.liulongbin.top/](http://shop.liulongbin.top/)
后端接口地址：[https://www.liulongbin.top:8888/api/private/v1/](https://www.liulongbin.top:8888/api/private/v1/)
<br/>
API 接口文档：链接：[https://pan.baidu.com/s/1KJPfaFaPadW4JdGjCt54NQ](https://pan.baidu.com/s/1KJPfaFaPadW4JdGjCt54NQ) 提取码：mgbr
<br/>
全套课程下载：链接：[https://pan.baidu.com/s/1\_-Ve1ceCsvPuXDtieeyVEA](https://pan.baidu.com/s/1_-Ve1ceCsvPuXDtieeyVEA) ，提取码是 q8ln
<br/>
_注：后端接口地址必须带有 token 才能正常发送和接收请求，请跟着项目课程了解学习_

> 请不要乱删数据，删了请加回去，删的时候请留个一两条在列表里。特别是角色权限部分，删光了权限数据那做到这部分的同学就没法继续做下去了
> 另外给个提示，遇到没有数据的情况，可以去到项目网站里加一些数据进去.

### 鸣谢

b 站用户 : [洛天依保护协会](https://space.bilibili.com/132108522?spm_id_from=333.788.b_636f6d6d656e74.26)提供的公用后台 API 接口
<br/>
用户名 : admin 密码 : 123456
<br/>
[洛天依保护协会](https://space.bilibili.com/132108522?spm_id_from=333.788.b_636f6d6d656e74.26)的项目示例地址 : [http://gl.timemeetyou.com](http://gl.timemeetyou.com)
<br/>
**万一接口失效了或者用户被删了可以私聊其恢复数据库**

### 安装

```
# 克隆项目
git clone https://github.com/wangxinleo/learnVue_shop.git

# 进入项目目录
cd learnVue_shop

# 安装依赖
npm install

# 本地开发 启动项目
npm run serve
```

### 分支

- master 分支为本项目源码分支
- server 分支为项目编译后的代码分支，且包含运行脚本

### 源码部署

```
# 克隆项目
git clone https://github.com/wangxinleo/learnVue_shop.git

# 进入项目目录
cd learnVue_shop

# 切换到server分支
git checkout -b server origin/server

# 拉取server分支代码
git pull

# 安装依赖
npm install

# 源码部署
node ./app.js
```

### 本项目部分编码优化

- 项目中各类文件根据目前互联网公司的通用模块化习惯划分成了 6 个大模块，分别存放各类所属文件

```js
- src //开发目录
  - asset // 存放静态文件
    - css
    - font
    - img
  - common // 公用js文件
  - network // api请求文件
    - goodsCom
    - home
    - login
    - order
    - report
    - rightsAndRoles
    - users
    - request.js // 封装axios请求
  - router // 动态路由
  - store // Vuex
  - view // 视图文件
  - App.vue
  - main-dev.js //用于开发环境的入口文件
  - main-prod.js //用于生产环境的入口文件
  - main.js // main模板文件

- .browserslistrc // 指定打包的代码对哪些浏览器支持
- .editorconfig // 代码规范
- .eslintrc.js // eslint配置文件
- babel.config.js // 插件配置
- package.json //项目信息文件
- vue.config.js //用户自定义webpack配置文件
```

- 本项目中的所有 API 请求都封装在 network 文件夹下，不再在.vue 文件中进行 axios 请求，vue 中只处理返回数据，符合 Vue 的封装思想。

```js
// 以login.vue 为例
执行 login() 方法
--> 到network/login下找到login请求
--> 引用 request.js 封装的axios 方法
--> 请求到数据返回到login.vue 中继续处理
--> 登陆成功
```

> **为什么要这样使用？**
> 比如后台 API 接口临时发生变化，我们只需要修改 network 文件夹下的 request.js 文件的 url 变量，即可全局变更 API 接口，符合模块化的思想，更方便代码管理。也更方便 API 方法的复用。

- 在 user 模块中，我尝试抽取了部分复用的组件变成子组件，加入了父子组件通信和兄弟组件通信的概念。这个在正常开发中非常多的用到，usersChildren 中的兄弟组件关系和 userCildren 和 Users 父子组件的通信可以好好琢磨琢磨，下下功夫

```js
// 加入了$bus的应用，用于跨组件通信

// main.js
Vue.prototype.$bus = new Vue()

// usersChildren/usersFunc/addUserDialog.vue
this.$bus.$emit('freshClick') //很像父子之间传值的方法

// Users.vue
this.$bus.$on('freshClick', () => {
  console.log(this)
  this.getUsersList()
})

// 父子组件通信

// 子组件代码实例
<template>
    <div @click="open"></div>
</template>

methods: {
   open() {
        this.$emit('showbox','the msg'); //触发showbox方法，'the msg'为向父组件传递的数据
    }
}

// 父组件代码实例
<child @showbox="toshow" :msg="msg"></child> //监听子组件触发的showbox事件,然后调用toshow方法

methods: {
    toshow(msg) {
        this.msg = msg;
    }
}
```

### 开发工具

下载地址：[vscode](https://code.visualstudio.com/)

- prettier
  > 这个工具会自动为您格式化整理代码，
  > vscode 去插件商店下载【Prettier - Code formatter 】这个插件.
  > 安装完成后 vscode 打开[文件]-->[首选项]-->[设置],找到 json
  > **在设置页右上角有个小图标点击即可切换至 json 配置模式，
  > 如果你有其他项目 eslint 配置不想替换本规则，
  > 可以拷贝到【工作区】的配置文件下，就不用替换到【用户】配置下了）**
  > 拷贝下方 json 到配置文件

```json
{
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.quickSuggestions": {
    "strings": true
  },
  "workbench.colorTheme": "One Monokai",
  "editor.tabSize": 2,
  "editor.detectIndentation": false,
  "emmet.triggerExpansionOnTab": true,
  "editor.formatOnSave": true,
  "javascript.format.enable": true,
  "stylelint.enable": true,
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false,
  "stylelint.autoFixOnSave": true,
  "git.enableSmartCommit": true,
  "git.autofetch": true,
  "git.confirmSync": false,
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "liveServer.settings.donotShowInfoMsg": true,
  "explorer.confirmDelete": false,
  "javascript.updateImportsOnFileMove.enabled": "always",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "files.exclude": {
    "**/.idea": true
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

- stylelint
  <br/>
  > 这个工具会自动格式化整理 CSS、sass、less 代码，自动排序 css 的顺序
  > vscode 需要去插件商店下载【stylelint-plus】这个插件
  > 具体的 JSON 配置如下

```json
{
  "stylelint.enable": true,
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false,
  "stylelint.autoFixOnSave": true
}
```

- 其他插件
  [Import Cost] 查看你引入的依赖模块大小
  [Auto Close Tag] 自动补全 html 标签，如输入`<a>`将自动补全`</a>`
  [Auto Rename Tag] 自动重命名 html 标签，如修改`<a>`为`<b>`，将自动修改结尾标签`</a>`为`</b>`
