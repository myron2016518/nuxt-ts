import axios from 'axios'
// import { Message } from 'element-ui'
// import qs from 'qs'
import { removeSessionCache } from '@/utils/dom/dom'
import config from './config'

if (process.server) {
  config.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3001}`
}

const service = axios.create(config)

// POST 传参序列化
service.interceptors.request.use(
  config => {
    // if (config.method === 'post') config.data = qs.stringify(config.data)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 返回状态判断
service.interceptors.response.use(
  res => {
    return res.data
  },
  error => {
    if (error.toString().indexOf('401') !== -1) {
      removeSessionCache("userInfo")
      removeSessionCache("userToken")
      // this.$router.push("/signin")
      if (!window.location.origin) {
        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
      }
      window.location.href = window.location.origin + "/signin";
    }

    return Promise.reject(error)
  }
)

export default service
