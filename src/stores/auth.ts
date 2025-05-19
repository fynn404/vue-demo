import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, LoginForm, RegisterForm } from '@/types'
import { auth } from '@/services/api'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

interface LoginResponseData {
  user_id: string
  username: string
  access_token: string
}

interface LoginResponse {
  code: number
  message: string
  data: LoginResponseData
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isInitialized = ref(false)
  const router = useRouter()

  // Initialize state from localStorage
  const initializeAuth = () => {
    if (isInitialized.value) return

    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser && typeof parsedUser === 'object') {
          token.value = storedToken
          user.value = parsedUser as User
        } else {
          // Invalid user data, clear storage
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      } catch (error) {
        console.error('Failed to parse stored user data:', error)
        // Clear invalid data from storage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    
    isInitialized.value = true
  }

  // Login
  const login = async (form: LoginForm) => {
    try {
      const response = await auth.login(form)
      console.log('Login response:', response)

      if (!response.data || !response.data.data) {
        throw new Error('No response data received')
      }

      const responseData = response.data.data
      console.log('Login data:', responseData)

      if (!responseData.access_token) {
        throw new Error('No token received')
      }

      // Construct user object from response
      const userData: User = {
        id: Number(responseData.user_id),
        username: responseData.username,
        role: 'user' as const,
        email: `${responseData.username}@example.com` // 临时邮箱，后续可以从后端获取
      }

      token.value = responseData.access_token
      user.value = userData
      localStorage.setItem('token', responseData.access_token)
      localStorage.setItem('user', JSON.stringify(userData))
      router.push('/')
    } catch (error) {
      console.error('Login failed:', error)
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Response error data:', error.response.data)
          throw new Error(error.response.data.message || 'Login failed')
        } else if (error.request) {
          throw new Error('No response from server')
        } else {
          throw new Error('Request configuration error')
        }
      }
      throw error
    }
  }

  // Register
  const register = async (form: RegisterForm) => {
    try {
      const response = await auth.register(form)
      if (!response.data) {
        throw new Error('Invalid registration response')
      }
      // After successful registration, login automatically
      await login({ username: form.username, password: form.password, role: form.role })
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  // Logout
  const logout = async () => {
    try {
      const response = await auth.logout()
      if (response.data.code === 200) {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
        ElMessage({
          type: 'success',
          message: '退出登录成功'
        })
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('Logout failed:', error)
      ElMessage({
        type: 'error',
        message: '退出登录失败，请重试'
      })
      throw error
    }
  }

  return {
    user,
    token,
    isInitialized,
    login,
    register,
    logout,
    initializeAuth
  }
}) 