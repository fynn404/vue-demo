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
  status: 'pending' | 'completed'
  createdAt: string
  updatedAt: string
  userId: number
}

export interface CreateTodoForm {
  title: string
  description: string
}

export interface UpdateTodoForm extends Partial<CreateTodoForm> {
  status?: 'pending' | 'completed'
} 