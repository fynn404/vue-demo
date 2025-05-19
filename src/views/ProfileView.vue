<template>
  <div class="profile-container">
    <div class="profile-card">
      <h1>个人信息</h1>
      <div class="profile-info">
        <div class="info-group">
          <label>用户名</label>
          <p>{{ authStore.user?.username }}</p>
        </div>
        <div class="info-group">
          <label>邮箱</label>
          <p>{{ authStore.user?.email }}</p>
        </div>
        <div class="info-group">
          <label>角色</label>
          <p>{{ authStore.user?.role === 'admin' ? '管理员' : '普通用户' }}</p>
        </div>
      </div>
      <div class="profile-actions">
        <button @click="handleLogout" class="btn-logout">退出登录</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 4rem;
  background-color: #f5f5f5;
}

.profile-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.profile-info {
  margin-bottom: 2rem;
}

.info-group {
  margin-bottom: 1.5rem;
}

.info-group label {
  display: block;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.info-group p {
  color: #333;
  font-size: 1.1rem;
  margin: 0;
}

.profile-actions {
  display: flex;
  justify-content: center;
}

.btn-logout {
  padding: 0.75rem 2rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.btn-logout:hover {
  background-color: #d32f2f;
}
</style> 