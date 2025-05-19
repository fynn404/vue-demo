import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, LoginForm, RegisterForm } from '@/types'
import { auth } from '@/services/api'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const router = useRouter()

  // Initialize state from localStorage
  const initializeAuth = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }

  // Login
  const login = async (form: LoginForm) => {
    try {
      const { data } = await auth.login(form)
      token.value = data.token
      user.value = data.user
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  // Register
  const register = async (form: RegisterForm) => {
    try {
      await auth.register(form)
      // After successful registration, login automatically
      await login({ username: form.username, password: form.password })
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  // Logout
  const logout = async () => {
    try {
      await auth.logout()
      user.value = null
      token.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  return {
    user,
    token,
    login,
    register,
    logout,
    initializeAuth
  }
}) 