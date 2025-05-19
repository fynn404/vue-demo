# Vue Todo Application

这是一个使用 Vue 3 + TypeScript 开发的现代化待办事项应用。该应用实现了用户认证、待办事项管理等功能，并采用了最新的 Vue 生态系统技术栈。

## 技术栈

- Vue 3
- TypeScript
- Vue Router
- Pinia (状态管理)
- Vite (构建工具)

## 功能特性

- 用户认证系统
  - 登录
  - 注册
  - 角色管理 (管理员/普通用户)
- 待办事项管理
  - 创建待办事项
  - 查看待办事项列表
  - 更新待办事项状态
  - 删除待办事项
- 个性化主页
  - 用户欢迎界面
  - 待办事项统计
  - 快速导航
- 响应式设计

## 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 可复用组件
├── router/          # 路由配置
├── services/        # API 服务
├── stores/          # Pinia 状态管理
├── types/           # TypeScript 类型定义
└── views/           # 页面组件
```

## 开发步骤

1. **项目初始化**
   ```bash
   npm create vue@latest
   # 选择 TypeScript, Vue Router, Pinia 等功能
   ```

2. **安装依赖**
   ```bash
   cd vue-demo
   npm install
   ```

3. **配置类型系统**
   - 在 `src/types` 中定义接口
   ```typescript
   // 用户相关类型
   interface User {
     id: number
     username: string
     email: string
     role: 'user' | 'admin'
   }

   // 待办事项相关类型
   interface Todo {
     id: number
     title: string
     description: string
     status: 'pending' | 'completed'
   }
   ```

4. **实现状态管理**
   - 使用 Pinia 创建 store
   ```typescript
   // auth store
   export const useAuthStore = defineStore('auth', () => {
     const user = ref<User | null>(null)
     const token = ref<string | null>(null)
     
     // 登录、注册、登出等功能
   })

   // todo store
   export const useTodoStore = defineStore('todo', () => {
     const todoList = ref<Todo[]>([])
     
     // 待办事项的 CRUD 操作
   })
   ```

5. **创建视图组件**
   - 登录/注册页面
   - 待办事项列表页面
   - 个性化主页
   - 用户资料页面

6. **实现路由系统**
   ```typescript
   const routes = [
     {
       path: '/',
       component: HomeView,
       meta: { requiresAuth: true }
     },
     {
       path: '/login',
       component: LoginView
     },
     // 其他路由...
   ]
   ```

7. **添加导航守卫**
   - 实现身份验证
   - 路由权限控制

8. **样式设计**
   - 使用 CSS 实现响应式设计
   - 添加过渡动画
   - 实现主题定制

## 运行项目

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **构建生产版本**
   ```bash
   npm run build
   ```

## 开发注意事项

1. **TypeScript 类型检查**
   - 确保所有组件和函数都有适当的类型注解
   - 使用接口定义数据结构

2. **状态管理**
   - 使用 Pinia 进行集中式状态管理
   - 保持 store 的单一职责原则

3. **组件设计**
   - 遵循 Vue 3 组合式 API 的最佳实践
   - 合理拆分组件，提高复用性

4. **路由管理**
   - 实现适当的路由守卫
   - 处理权限和认证逻辑

5. **API 调用**
   - 集中管理 API 请求
   - 实现适当的错误处理

## 部署

1. **构建应用**
   ```bash
   npm run build
   ```

2. **部署静态文件**
   - 将 `dist` 目录部署到 Web 服务器
   - 配置服务器以支持 SPA 路由

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
