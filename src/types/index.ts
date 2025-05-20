/**
 * 用户相关类型定义
 */

/** 用户信息接口 */
export interface User {
  id: number            // 用户ID
  username: string      // 用户名
  email: string        // 电子邮箱
  role: 'user' | 'admin' // 用户角色：普通用户或管理员
  nickname?: string     // 昵称（可选）
  avatar_url?: string   // 头像URL（可选）
  has_change_password?: boolean // 是否已修改密码（可选）
}

/**
 * 认证相关类型定义
 */

/** 登录表单接口 */
export interface LoginForm {
  username: string      // 用户名
  password: string      // 密码
  role: 'user' | 'admin' // 登录角色
}

/** 注册表单接口（继承登录表单） */
export interface RegisterForm extends LoginForm {
  email: string         // 电子邮箱
  confirmPassword: string // 确认密码
}

/**
 * 任务相关类型定义
 */

/** 任务详情接口 */
export interface Todo {
  id: number           // 任务ID
  title: string        // 任务标题
  description: string  // 任务描述
  completed: boolean   // 完成状态
  createdAt: string    // 创建时间
  updatedAt: string    // 更新时间
  userId: number       // 所属用户ID
  priority: 'low' | 'medium' | 'high' // 优先级：低、中、高
  dueDate?: string     // 截止时间（可选）
}

/** 创建任务的表单接口 */
export interface CreateTodoForm {
  title: string        // 任务标题
  description: string  // 任务描述
  priority: 'low' | 'medium' | 'high' // 优先级
}

/** 更新任务的表单接口（部分属性可选） */
export interface UpdateTodoForm extends Partial<CreateTodoForm> {
  completed?: boolean  // 完成状态（可选）
  priority?: 'low' | 'medium' | 'high' // 优先级（可选）
}

/** 分页响应接口 */
export interface PaginatedResponse<T> {
  total: number        // 总记录数
  todos: T[]           // 分页数据列表
}

/** 分页参数接口 */
export interface PaginationParams {
  page: number         // 当前页码
  size: number         // 每页大小
}

/** 更新用户资料表单接口 */
export interface UpdateProfileForm {
  nickname?: string    // 昵称（可选）
  email?: string       // 电子邮箱（可选）
  password?: string    // 新密码（可选）
  oldPassword?: string // 旧密码（可选，修改密码时必需）
} 