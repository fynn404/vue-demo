import axios from 'axios'
import type { LoginForm, RegisterForm, User, Todo, CreateTodoForm, UpdateTodoForm, PaginatedResponse, PaginationParams, UpdateProfileForm } from '@/types'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface LoginResponseData {
  user_id: string
  username: string
  access_token: string
}

const api = axios.create({
  baseURL: 'http://localhost:9527/api/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor to add auth token
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

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const auth = {
  register: (data: RegisterForm) => api.post<ApiResponse<User>>('/auth/register', data),
  login: (data: LoginForm) => api.post<ApiResponse<LoginResponseData>>('/auth/login', data),
  logout: () => api.post('/auth/logout')
}

// User APIs
export const users = {
  getAll: () => api.get<ApiResponse<User[]>>('/users'),
  getOne: (id: number) => api.get<ApiResponse<User>>(`/users/${id}`),
  update: (id: number, data: Partial<User>) => api.put<ApiResponse<User>>(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
  updateProfile: (data: UpdateProfileForm) => api.put<ApiResponse<User>>('/users/profile', data),
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

// Todo APIs
export const todos = {
  getAll: (params: PaginationParams) => api.get<ApiResponse<PaginatedResponse<Todo>>>('/todos', { params }),
  create: (data: CreateTodoForm) => api.post<ApiResponse<{ todo: Todo }>>('/todos', data),
  getOne: (id: number) => api.get<ApiResponse<{ todo: Todo }>>(`/todos/${id}`),
  update: (id: number, data: UpdateTodoForm) => api.put<ApiResponse<{ todo: Todo }>>(`/todos/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/todos/${id}`),
  updateStatus: (id: number, completed: boolean) =>
    api.patch<ApiResponse<{ todo: Todo }>>(`/todos/${id}/status`, { completed })
}

export default api 