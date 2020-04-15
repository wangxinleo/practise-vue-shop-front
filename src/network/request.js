import axios from 'axios'

export function request (config) {
  const instance = axios.create({
    baseURL: 'http://timemeetyou.com:8889/api/private/v1',
    timeout: 5000
  })

  instance.interceptors.request.use((config) => {
    // 添加验证请求头
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
    // eslint-disable-next-line handle-callback-err
  }, error => {

  })

  instance.interceptors.response.use((config) => {
    return config
    // eslint-disable-next-line handle-callback-err
  }, error => {

  })

  return instance(config)
}
