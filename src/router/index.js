import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login" */ '../views/login/Login')
const Home = () => import(/* webpackChunkName: "login" */ '../views/home/Home')
const HomeWelcome = () => import(/* webpackChunkName: "login" */ '../views/home/homeChildren/HomeWelcome')
const Users = () => import(/* webpackChunkName: "users" */ '../views/users/Users')
const Rights = () => import(/* webpackChunkName: "rightsAndRoles" */ '../views/rightsAndRoles/rights/Rights')
const Roles = () => import(/* webpackChunkName: "rightsAndRoles" */ '../views/rightsAndRoles/roles/Roles')
const Goods = () => import(/* webpackChunkName: "goodsCom" */ '../views/goodsCom/goods/Goods')
const Params = () => import(/* webpackChunkName: "goodsCom" */ '../views/goodsCom/params/Params')
const Categories = () => import(/* webpackChunkName: "goodsCom" */ '../views/goodsCom/categories/Categories')
const Add = () => import(/* webpackChunkName: "goodsCom" */ '../views/goodsCom/goods/Add')
const Order = () => import(/* webpackChunkName: "order" */ '../views/order/Order')
const Report = () => import(/* webpackChunkName: "report" */ '../views/report/Report')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: HomeWelcome
      },
      {
        path: '/users',
        name: 'users',
        component: Users
      },
      {
        path: '/rights',
        name: 'rights',
        component: Rights
      },
      {
        path: '/roles',
        name: 'roles',
        component: Roles
      },
      {
        path: '/goods',
        name: 'goods',
        component: Goods
      },
      {
        path: '/goods/add',
        name: 'add',
        component: Add
      },
      {
        path: '/params',
        name: 'params',
        component: Params
      },
      {
        path: '/categories',
        name: 'categories',
        component: Categories
      },
      {
        path: '/orders',
        name: 'order',
        component: Order
      },
      {
        path: '/reports',
        name: 'report',
        component: Report
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
