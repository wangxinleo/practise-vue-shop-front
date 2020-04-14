import axios from 'axios'

export function request (config) {
  const instance = axios.create({
    baseURL: 'http://timemeetyou.com:8889/api/private/v1',
    timeout: 5000
  })

  instance.interceptors.request.use((config) => {
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
