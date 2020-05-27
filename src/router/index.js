import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../views/login/Login')
const Home = () => import('../views/home/Home')
const HomeWelcome = () => import('../views/home/homeChildren/HomeWelcome')
const Users = () => import('../views/users/Users')
const Rights = () => import('../views/rightsAndRoles/rights/Rights')
const Roles = () => import('../views/rightsAndRoles/roles/Roles')
const Goods = () => import('../views/goodsCom/goods/Goods')
const Params = () => import('../views/goodsCom/params/Params')
const Categories = () => import('../views/goodsCom/categories/Categories')
const Add = () => import('../views/goodsCom/goods/Add')
const Order = () => import('../views/order/Order')

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
