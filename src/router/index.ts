import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/todos',
      name: 'todos',
      component: () => import('../views/TodoListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/todos/:id',
      name: 'todo-detail',
      component: () => import('../views/TodoDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth store if not already initialized
  if (!authStore.isInitialized) {
    authStore.initializeAuth()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !authStore.token) {
    next('/login')
  } else if ((to.name === 'login' || to.name === 'register') && authStore.token) {
    next('/')
  } else {
    next()
  }
})

export default router
