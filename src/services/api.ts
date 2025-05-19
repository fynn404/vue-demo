import axios from 'axios'
import type { LoginForm, RegisterForm, User, Todo, CreateTodoForm, UpdateTodoForm } from '@/types'

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
  delete: (id: number) => api.delete(`/users/${id}`)
}

// Todo APIs
export const todos = {
  getAll: () => api.get<ApiResponse<Todo[]>>('/todos'),
  create: (data: CreateTodoForm) => api.post<ApiResponse<Todo>>('/todos', data),
  getOne: (id: number) => api.get<ApiResponse<Todo>>(`/todos/${id}`),
  update: (id: number, data: UpdateTodoForm) => api.put<ApiResponse<Todo>>(`/todos/${id}`, data),
  delete: (id: number) => api.delete(`/todos/${id}`),
  updateStatus: (id: number, status: 'pending' | 'completed') =>
    api.patch<ApiResponse<Todo>>(`/todos/${id}/status`, { status })
}

export default api 