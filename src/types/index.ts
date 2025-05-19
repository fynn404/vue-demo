// User related types
export interface User {
  id: number
  username: string
  email: string
  role: 'user' | 'admin'
}

// Auth related types
export interface LoginForm {
  username: string
  password: string
  role: 'user' | 'admin'
}

export interface RegisterForm extends LoginForm {
  email: string
  confirmPassword: string
}

// Todo related types
export interface Todo {
  id: number
  title: string
  description: string
  completed: boolean
  createdAt: string
  updatedAt: string
  userId: number
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
}

export interface CreateTodoForm {
  title: string
  description: string
}

export interface UpdateTodoForm extends Partial<CreateTodoForm> {
  completed?: boolean
}

export interface PaginatedResponse<T> {
  total: number
  todos: T[]
}

export interface PaginationParams {
  page: number
  size: number
} 