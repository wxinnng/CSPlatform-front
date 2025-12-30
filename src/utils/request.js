// utils/request.js
import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:8080/', // 确保这是你后端API的正确基础地址
  timeout: 10000, // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 (修复核心逻辑)
service.interceptors.response.use(
  (response) => {
    const res = response.data
    console.log("API响应数据:", res) // 调试用，可后续移除
    
    // 根据你的后端约定，判断业务请求是否成功
    if (res.code === 200) {
      return res // 直接返回后端数据，或根据结构返回 res.data
    } else {
      // 重要：业务逻辑错误时，也必须返回一个 rejected Promise
      return Promise.reject(new Error(res.message || '请求错误'))
    }
  },
  (error) => {
    // 网络或HTTP错误处理
    let errorMessage = '网络连接异常，请检查网络设置'
    
    if (error.response) {
      // 服务器有响应，但状态码不在2xx范围内
      const status = error.response.status
      const message = error.response.data?.message || errorMessage
      
      switch (status) {
        case 401:
          errorMessage = message || '未授权，请重新登录'
          // 可在此触发跳转登录页逻辑，例如：router.push('/login')
          break
        case 403:
          errorMessage = message || '权限不足'
          break
        case 404:
          errorMessage = message || '请求的资源不存在'
          break
        case 422:
          errorMessage = message || '身份验证失败'
          break
        case 429:
          errorMessage = message || '请求过于频繁，请稍后再试'
          break
        case 500:
          errorMessage = message || '服务器内部错误'
          break
        default:
          errorMessage = message || `网络错误 (${status})`
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = '请求超时，请检查网络'
    } else if (error.message === 'Network Error') {
      errorMessage = '网络连接异常，请检查网络设置或后端服务是否启动'
    }
    
    console.error('请求失败详情:', error) // 输出详细错误利于调试
    return Promise.reject(new Error(errorMessage))
  }
)

export default service