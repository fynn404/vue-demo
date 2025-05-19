<template>
  <div class="login-container">
    <div class="login-card">
      <h1>登录</h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            placeholder="请输入用户名"
          />
        </div>
        <div class="form-group">
          <label>用户角色</label>
          <div class="role-selection">
            <div class="role-option">
              <input
                type="radio"
                id="user"
                value="user"
                v-model="form.role"
                required
              />
              <label for="user">普通用户</label>
            </div>
            <div class="role-option">
              <input
                type="radio"
                id="admin"
                value="admin"
                v-model="form.role"
                required
              />
              <label for="admin">管理员</label>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="请输入密码"
          />
        </div>
        <div class="error-message" v-if="error">{{ error }}</div>
        <button type="submit" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      <div class="register-link">
        还没有账号？
        <router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { LoginForm } from '@/types'

const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')
const form = ref<LoginForm>({
  username: '',
  password: '',
  role: 'user'
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(form.value)
  } catch (err) {
    error.value = '登录失败，请检查用户名和密码'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.login-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #f44336;
  margin-bottom: 1rem;
  text-align: center;
}

.register-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.register-link a {
  color: #4CAF50;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

.role-selection {
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
}

.role-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.role-option input[type="radio"] {
  width: auto;
}

.role-option label {
  margin-bottom: 0;
  cursor: pointer;
}
</style> 