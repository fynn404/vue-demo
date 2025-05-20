<template>
  <div class="profile-container">
    <div class="profile-card">
      <h1>个人信息</h1>
      
      <form @submit.prevent="handleSubmit" class="profile-form">
        <div class="form-group">
          <label for="nickname">昵称</label>
          <input
            id="nickname"
            v-model="form.nickname"
            type="text"
            required
            placeholder="请输入昵称"
          />
        </div>
        
        <div class="form-group">
          <label for="email">邮箱</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="请输入邮箱"
          />
        </div>

        <div class="form-group">
          <label>头像</label>
          <div class="avatar-section">
            <div class="avatar-preview" @click="triggerFileInput">
              <img :src="fullAvatarUrl" alt="用户头像" />
              <div class="avatar-overlay">
                <span>点击更换头像</span>
              </div>
            </div>
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              style="display: none"
              @change="handleFileChange"
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? '保存中...' : '保存修改' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { UpdateProfileForm } from '@/types'
import { ElMessage } from 'element-plus'
import { users } from '@/services/api'

// 获取认证状态管理store
const authStore = useAuthStore()
// 控制加载状态
const loading = ref(false)
// 文件输入框的引用，用于触发文件选择
const fileInput = ref<HTMLInputElement | null>(null)
// 存储头像预览的临时URL
const previewUrl = ref<string>('')

// 计算属性：处理头像完整URL的显示逻辑
const fullAvatarUrl = computed(() => {
  // 如果有预览图片（新上传的图片），优先显示预览图
  if (previewUrl.value) {
    return previewUrl.value
  }
  // 获取用户当前的头像路径
  const avatarPath = authStore.user?.avatar_url
  // 如果没有头像路径，显示默认头像
  if (!avatarPath) {
    return '/default-avatar.png'
  }
  // 如果头像路径已经是完整的URL（以http开头），直接返回
  if (avatarPath.startsWith('http')) {
    return avatarPath
  }
  // 否则，将API基础URL与头像路径拼接，构建完整URL
  return `http://localhost:9527${avatarPath}`
})

// 表单数据，初始化为当前用户信息
const form = ref<UpdateProfileForm>({
  nickname: authStore.user?.nickname || authStore.user?.username || '',
  email: authStore.user?.email || ''
})

// 触发文件选择框点击事件
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 处理文件选择变更事件
const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  // 验证是否为图片文件
  if (!file.type.startsWith('image/')) {
    ElMessage({
      type: 'error',
      message: '请选择图片文件'
    })
    return
  }

  // 创建本地预览URL
  previewUrl.value = URL.createObjectURL(file)

  try {
    loading.value = true
    // 调用上传头像API
    const response = await users.uploadAvatar(file)
    
    if (response.data.code === 200) {
      // 上传成功后更新用户信息中的头像URL
      if (authStore.user) {
        authStore.user = {
          ...authStore.user,
          avatar_url: response.data.data.avatar_url
        }
        // 更新本地存储的用户信息
        localStorage.setItem('user', JSON.stringify(authStore.user))
      }
      ElMessage({
        type: 'success',
        message: '头像上传成功'
      })
    } else {
      throw new Error(response.data.message)
    }
  } catch (error) {
    console.error('Failed to upload avatar:', error)
    ElMessage({
      type: 'error',
      message: '头像上传失败，请重试'
    })
    // 上传失败时清除预览图
    previewUrl.value = ''
  } finally {
    loading.value = false
  }
}

// 处理表单提交
const handleSubmit = async () => {
  loading.value = true
  try {
    // 调用更新个人信息API
    const response = await users.updateProfile(form.value)
    if (response.data.code === 200) {
      // 更新成功后更新本地用户信息
      if (authStore.user) {
        authStore.user = {
          ...authStore.user,
          nickname: response.data.data.nickname,
          email: response.data.data.email,
          avatar_url: response.data.data.avatar_url
        }
        // 更新本地存储
        localStorage.setItem('user', JSON.stringify(authStore.user))
      }
      ElMessage({
        type: 'success',
        message: '个人信息更新成功'
      })
    } else {
      throw new Error(response.data.message)
    }
  } catch (error) {
    console.error('Failed to update profile:', error)
    ElMessage({
      type: 'error',
      message: '个人信息更新失败，请重试'
    })
  } finally {
    loading.value = false
  }
}

// 组件卸载时清理预览URL，释放内存
onMounted(() => {
  return () => {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
  }
})
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-card h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
  text-align: center;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #2c3e50;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #ddd;
  position: relative;
  cursor: pointer;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.avatar-overlay span {
  color: white;
  font-size: 0.8rem;
  text-align: center;
  padding: 0.5rem;
}

.avatar-preview:hover .avatar-overlay {
  opacity: 1;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.btn-submit {
  padding: 0.75rem 2rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background-color: #45a049;
}

.btn-submit:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style> 