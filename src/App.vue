<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
}

onMounted(() => {
  authStore.initializeAuth()
})
</script>

<template>
  <header v-if="authStore.token">
    <nav>
      <router-link to="/" class="logo">Todo App</router-link>
      <div class="nav-links">
        <router-link to="/todos">任务列表</router-link>
        <router-link to="/profile">个人信息</router-link>
        <a href="#" @click.prevent="handleLogout">登出</a>
      </div>
    </nav>
  </header>

  <main>
    <router-view></router-view>
  </main>
</template>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}

header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4CAF50;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

.nav-links a:hover {
  color: #4CAF50;
}

.nav-links a.router-link-active {
  color: #4CAF50;
}

main {
  min-height: calc(100vh - 64px);
}
</style>
