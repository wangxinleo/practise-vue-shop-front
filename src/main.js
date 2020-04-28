import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './common/element.js'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
