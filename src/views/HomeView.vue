<template>
  <div class="home-container">
    <div class="welcome-section">
      <h1>欢迎回来！</h1>
      <div class="user-info" v-if="authStore.user">
        <p class="username">{{ authStore.user.username }}</p>
        <p class="role-badge" :class="authStore.user.role">{{ authStore.user.role === 'admin' ? '管理员' : '普通用户' }}</p>
      </div>
    </div>

    <div class="quick-stats">
      <div class="stat-card">
        <h3>待办事项</h3>
        <p class="stat-number">{{ pendingTodos }}</p>
        <router-link to="/todos" class="view-all">查看全部</router-link>
      </div>
      <div class="stat-card">
        <h3>已完成</h3>
        <p class="stat-number">{{ completedTodos }}</p>
        <router-link to="/todos" class="view-all">查看全部</router-link>
      </div>
    </div>

    <div class="quick-actions">
      <h2>快速操作</h2>
      <div class="action-buttons">
        <router-link to="/todos" class="action-button">
          <span class="icon">📝</span>
          查看待办事项
        </router-link>
        <router-link to="/profile" class="action-button">
          <span class="icon">👤</span>
          个人资料
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todo'
import { ElMessage } from 'element-plus'

const authStore = useAuthStore()
const todoStore = useTodoStore()
const pendingTodos = ref(0)
const completedTodos = ref(0)

onMounted(async () => {
  try {
    await todoStore.fetchTodos()
    pendingTodos.value = todoStore.todoList.filter(todo => !todo.completed).length
    completedTodos.value = todoStore.todoList.filter(todo => todo.completed).length
  } catch (error) {
    console.error('Failed to fetch todos:', error)
    ElMessage({
      type: 'error',
      message: '获取任务统计失败'
    })
  }
})
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-section h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.username {
  font-size: 1.2rem;
  color: #666;
}

.role-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: white;
}

.role-badge.admin {
  background-color: #e74c3c;
}

.role-badge.user {
  background-color: #3498db;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  color: #666;
  margin-bottom: 1rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.view-all {
  color: #3498db;
  text-decoration: none;
}

.view-all:hover {
  text-decoration: underline;
}

.quick-actions {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.quick-actions h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  color: #2c3e50;
  text-decoration: none;
  transition: all 0.3s ease;
}

.action-button:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
}

.icon {
  font-size: 1.2rem;
}
</style>
