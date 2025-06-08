import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

// 用户信息接口
export interface User {
  id: number
  username: string
  email: string
  avatar_url?: string
  profile?: string
  phone?: string
  created_at?: string
  last_login?: string
}

// 登录响应接口
interface LoginResponse {
  message: string
  user: User
  token: string
  sessionToken: string
}

// 注册请求接口
interface RegisterRequest {
  username: string
  email: string
  password: string
}

// 登录请求接口
interface LoginRequest {
  identifier: string  // 用户名或邮箱
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const sessionToken = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const userName = computed(() => user.value?.username || '')
  const userEmail = computed(() => user.value?.email || '')

  // API基础URL
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  // 配置axios拦截器
  const setupAxiosInterceptors = () => {
    // 请求拦截器 - 自动添加认证头
    axios.interceptors.request.use(
      (config) => {
        if (token.value) {
          config.headers.Authorization = `Bearer ${token.value}`
        }
        if (sessionToken.value) {
          config.headers['X-Session-Token'] = sessionToken.value
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // 响应拦截器 - 处理认证错误
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          // 令牌过期或无效，清除认证信息
          await logout()
        }
        return Promise.reject(error)
      }
    )
  }

  // 从本地存储恢复认证状态
  const restoreAuth = async () => {
    try {
      const storedToken = localStorage.getItem('auth_token')
      const storedSessionToken = localStorage.getItem('session_token')
      const storedUser = localStorage.getItem('user_info')

      if (storedToken && storedUser) {
        token.value = storedToken
        sessionToken.value = storedSessionToken
        user.value = JSON.parse(storedUser)
        
        // 验证令牌是否仍然有效
        await verifyToken()
      }
    } catch (error) {
      console.error('恢复认证状态失败:', error)
      clearAuth()
    }
  }

  // 保存认证信息到本地存储
  const saveAuth = (authData: LoginResponse) => {
    token.value = authData.token
    sessionToken.value = authData.sessionToken
    user.value = authData.user

    localStorage.setItem('auth_token', authData.token)
    localStorage.setItem('session_token', authData.sessionToken)
    localStorage.setItem('user_info', JSON.stringify(authData.user))
  }

  // 清除认证信息
  const clearAuth = () => {
    user.value = null
    token.value = null
    sessionToken.value = null
    error.value = null

    localStorage.removeItem('auth_token')
    localStorage.removeItem('session_token')
    localStorage.removeItem('user_info')
  }

  // 用户注册
  const register = async (registerData: RegisterRequest): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await axios.post(`${API_BASE}/api/auth/register`, registerData)
      
      if (response.data) {
        saveAuth(response.data)
        return true
      }
      return false
    } catch (err: any) {
      console.error('注册失败:', err)
      error.value = err.response?.data?.error || '注册失败，请稍后重试'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 用户登录
  const login = async (loginData: LoginRequest): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await axios.post(`${API_BASE}/api/auth/login`, loginData)
      
      if (response.data) {
        saveAuth(response.data)
        return true
      }
      return false
    } catch (err: any) {
      console.error('登录失败:', err)
      error.value = err.response?.data?.error || '登录失败，请检查用户名和密码'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 用户退出
  const logout = async () => {
    try {
      if (sessionToken.value) {
        await axios.post(`${API_BASE}/api/auth/logout`, {}, {
          headers: {
            'X-Session-Token': sessionToken.value
          }
        })
      }
    } catch (error) {
      console.error('退出登录请求失败:', error)
    } finally {
      clearAuth()
    }
  }

  // 验证令牌
  const verifyToken = async (): Promise<boolean> => {
    try {
      if (!token.value) return false

      const response = await axios.get(`${API_BASE}/api/auth/verify`)
      
      if (response.data.valid) {
        // 更新用户信息
        user.value = { ...user.value, ...response.data.user }
        return true
      } else {
        clearAuth()
        return false
      }
    } catch (error) {
      console.error('令牌验证失败:', error)
      clearAuth()
      return false
    }
  }

  // 刷新令牌
  const refreshToken = async (): Promise<boolean> => {
    try {
      if (!sessionToken.value) return false

      const response = await axios.post(`${API_BASE}/api/auth/refresh`, {}, {
        headers: {
          'X-Session-Token': sessionToken.value
        }
      })
      
      if (response.data.token) {
        token.value = response.data.token
        localStorage.setItem('auth_token', response.data.token)
        return true
      }
      return false
    } catch (error) {
      console.error('刷新令牌失败:', error)
      return false
    }
  }

  // 获取用户信息
  const fetchProfile = async (): Promise<boolean> => {
    try {
      if (!token.value) return false

      const response = await axios.get(`${API_BASE}/api/auth/profile`)
      
      if (response.data.user) {
        user.value = response.data.user
        localStorage.setItem('user_info', JSON.stringify(response.data.user))
        return true
      }
      return false
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return false
    }
  }

  // 更新用户信息
  const updateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await axios.put(`${API_BASE}/api/auth/profile`, profileData)
      
      if (response.data.user) {
        user.value = response.data.user
        localStorage.setItem('user_info', JSON.stringify(response.data.user))
        return true
      }
      return false
    } catch (err: any) {
      console.error('更新用户信息失败:', err)
      error.value = err.response?.data?.error || '更新用户信息失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 修改密码
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null

      await axios.put(`${API_BASE}/api/auth/password`, {
        currentPassword,
        newPassword
      })
      
      return true
    } catch (err: any) {
      console.error('修改密码失败:', err)
      error.value = err.response?.data?.error || '修改密码失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 清除错误
  const clearError = () => {
    error.value = null
  }

  // 初始化
  const init = async () => {
    setupAxiosInterceptors()
    await restoreAuth()
  }

  return {
    // 状态
    user,
    token,
    sessionToken,
    isLoading,
    error,
    
    // 计算属性
    isAuthenticated,
    userName,
    userEmail,
    
    // 方法
    register,
    login,
    logout,
    verifyToken,
    refreshToken,
    fetchProfile,
    updateProfile,
    changePassword,
    clearError,
    clearAuth,
    init
  }
}) 