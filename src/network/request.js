import axios from 'axios'
// 引入nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // 这个样式必须引入

export function request (config) {
  const instance = axios.create({
    baseURL: 'http://timemeetyou.com:8889/api/private/v1',
    timeout: 5000
  })

  instance.interceptors.request.use((config) => {
    NProgress.start()
    // 添加验证请求头
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  }, error => {
    console.log(error)
  })

  instance.interceptors.response.use((config) => {
    NProgress.done()
    return config
  }, error => {
    console.log(error)
  })

  return instance(config)
}
