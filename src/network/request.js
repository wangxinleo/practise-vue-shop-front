import axios from 'axios'
// 引入nprogress
// 进度条插件
import NProgress from 'nprogress'

export function request (config) {
  const instance = axios.create({
    baseURL: 'http://timemeetyou.com:8889/api/private/v1',
    timeout: 5000
  })

  instance.interceptors.request.use((config) => {
    // 请求开始，开始进度条
    NProgress.start()
    // 添加验证请求头
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  }, error => {
    console.log(error)
  })

  instance.interceptors.response.use((config) => {
    // 请求结束，关闭进度条
    NProgress.done()
    return config
  }, error => {
    console.log(error)
  })

  return instance(config)
}
