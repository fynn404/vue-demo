import axios from 'axios'
import type { LoginForm, RegisterForm, User, Todo, CreateTodoForm, UpdateTodoForm, PaginatedResponse, PaginationParams, UpdateProfileForm } from '@/types'

/**
 * API响应接口
 * @template T 响应数据的类型
 */
interface ApiResponse<T> {
  code: number         // 响应状态码
  message: string      // 响应消息
  data: T             // 响应数据
}

/**
 * 登录响应数据接口
 */
interface LoginResponseData {
  user_id: string      // 用户ID
  username: string     // 用户名
  access_token: string // 访问令牌
}

/**
 * 创建axios实例，配置基础URL和默认选项
 */
const api = axios.create({
  baseURL: 'http://localhost:9527/api/v1', // API基础URL
  timeout: 5000,                           // 请求超时时间
  headers: {
    'Content-Type': 'application/json'     // 默认请求头
  }
})

/**
 * 请求拦截器：添加认证token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * 认证相关API
 */
export const auth = {
  /** 用户注册 */
  register: (data: RegisterForm) => api.post<ApiResponse<User>>('/auth/register', data),
  
  /** 用户登录 */
  login: (data: LoginForm) => api.post<ApiResponse<LoginResponseData>>('/auth/login', data),
  
  /** 用户登出 */
  logout: () => api.post('/auth/logout')
}

/**
 * 用户相关API
 */
export const users = {
  /** 获取所有用户 */
  getAll: () => api.get<ApiResponse<User[]>>('/users'),
  
  /** 获取单个用户 */
  getOne: (id: number) => api.get<ApiResponse<User>>(`/users/${id}`),
  
  /** 更新用户信息 */
  update: (id: number, data: Partial<User>) => api.put<ApiResponse<User>>(`/users/${id}`, data),
  
  /** 删除用户 */
  delete: (id: number) => api.delete(`/users/${id}`),
  
  /** 更新用户资料 */
  updateProfile: (data: UpdateProfileForm) => api.put<ApiResponse<User>>('/users/profile', data),
  
  /** 上传用户头像 */
  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.post<ApiResponse<{ avatar_url: string }>>('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

/**
 * 任务相关API
 */
export const todos = {
  /** 获取任务列表（支持分页） */
  getAll: async (params: PaginationParams) => {
    try {
      console.log('API: Getting all todos with params:', params)
      const response = await api.get<ApiResponse<PaginatedResponse<Todo>>>('/todos', { params })
      console.log('API: Get all todos response:', response.data)
      return response
    } catch (error) {
      console.error('API: Failed to get all todos:', error)
      throw error
    }
  },
  
  /** 获取单个任务详情 */
  getOne: async (id: number) => {
    try {
      console.log('API: Getting todo:', id)
      const response = await api.get<ApiResponse<{ todo: Todo }>>(`/todos/${id}`)
      console.log('API: Get todo response:', response.data)
      return response
    } catch (error) {
      console.error(`API: Failed to get todo ${id}:`, error)
      throw error
    }
  },
  
  /** 创建新任务 */
  create: async (data: CreateTodoForm) => {
    try {
      console.log('API: Creating todo:', data)
      const response = await api.post<ApiResponse<{ todo: Todo }>>('/todos', data)
      console.log('API: Create todo response:', response.data)
      return response
    } catch (error) {
      console.error('API: Failed to create todo:', error)
      throw error
    }
  },
  
  /** 更新任务 */
  update: async (id: number, data: UpdateTodoForm) => {
    try {
      console.log('API: Updating todo:', id, data)
      const response = await api.put<ApiResponse<{ todo: Todo }>>(`/todos/${id}`, data)
      console.log('API: Update todo response:', response.data)
      return response
    } catch (error) {
      console.error(`API: Failed to update todo ${id}:`, error)
      throw error
    }
  },
  
  /** 删除任务 */
  delete: async (id: number) => {
    try {
      console.log('API: Deleting todo:', id)
      const response = await api.delete<ApiResponse<void>>(`/todos/${id}`)
      console.log('API: Delete todo response:', response.data)
      return response
    } catch (error) {
      console.error(`API: Failed to delete todo ${id}:`, error)
      throw error
    }
  },
  
  /** 更新任务状态 */
  updateStatus: async (id: number, completed: boolean) => {
    try {
      console.log('API: Updating todo status:', id, completed)
      const response = await api.patch<ApiResponse<{ todo: Todo }>>(`/todos/${id}/status`, { completed })
      console.log('API: Update todo status response:', response.data)
      return response
    } catch (error) {
      console.error(`API: Failed to update todo status ${id}:`, error)
      throw error
    }
  }
}

export default api 