import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 从环境变量读取基础API地址
  timeout: 10000, // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求前添加token到请求头
    const token = localStorage.getItem('token') // 或从Vuex store中获取
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据进行处理，根据后端返回结构调整
    const res = response.data
    // 假设业务成功码为200（请根据实际情况调整）
    if (res.code === 200) {
      return res // 或者 return res.data，如果有效数据在res.data里
    } else {
      // 业务逻辑错误
      console.error(res.message || '请求错误')
      return Promise.reject(new Error(res.message || 'Error'))
    }
  },
  (error) => {
    // 对响应错误做统一处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('未授权，请重新登录')
          // 可以在此处跳转至登录页，例如：router.push('/login')
          break
        case 404:
          console.error('请求的资源不存在')
          break
        case 500:
          console.error('服务器内部错误')
          break
        default:
          console.error('网络错误')
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('请求超时')
    } else {
      console.error('网络连接异常')
    }
    return Promise.reject(error)
  }
)

export default service