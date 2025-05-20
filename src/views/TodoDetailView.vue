<template>
  <div class="todo-detail">
    <div v-if="todoStore.loading" class="loading">
      加载中...
    </div>
    <div v-else-if="!todoStore.currentTodo" class="not-found">
      未找到该任务
    </div>
    <div v-else class="todo-content">
      <div class="todo-header">
        <h1>{{ todoStore.currentTodo.title }}</h1>
        <div class="todo-status">
          状态：
          <span :class="todoStore.currentTodo.status">
            {{ todoStore.currentTodo.status === 'completed' ? '已完成' : '进行中' }}
          </span>
        </div>
      </div>
      <div class="todo-description">
        <h2>描述</h2>
        <p>{{ todoStore.currentTodo.description }}</p>
      </div>
      <div class="todo-meta">
        <p>创建时间：{{ new Date(todoStore.currentTodo.createdAt).toLocaleString() }}</p>
        <p>更新时间：{{ new Date(todoStore.currentTodo.updatedAt).toLocaleString() }}</p>
      </div>
      <div class="todo-actions">
        <button @click="router.push('/todos')" class="btn-back">返回列表</button>
        <button
          @click="handleStatusToggle"
          :class="['btn-status', todoStore.currentTodo.status]"
        >
          {{ todoStore.currentTodo.status === 'completed' ? '标记为进行中' : '标记为已完成' }}
        </button>
        <button @click="handleEdit" class="btn-edit">编辑</button>
        <button @click="handleDelete" class="btn-delete">删除</button>
      </div>
    </div>

    <!-- Edit Modal -->
    <el-dialog
      v-model="showEditModal"
      title="编辑任务"
      width="50%"
      :close-on-click-modal="false"
      @close="showEditModal = false"
    >
      <div class="modal-content">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="title">标题</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              placeholder="请输入任务标题"
            />
          </div>
          <div class="form-group">
            <label for="description">描述</label>
            <textarea
              id="description"
              v-model="form.description"
              required
              placeholder="请输入任务描述"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="priority">优先级</label>
            <el-select v-model="form.priority" placeholder="请选择优先级">
              <el-option label="高优先级" value="high" />
              <el-option label="中优先级" value="medium" />
              <el-option label="低优先级" value="low" />
            </el-select>
          </div>
          <div class="modal-actions">
            <el-button @click="showEditModal = false">取消</el-button>
            <el-button type="primary" native-type="submit">保存</el-button>
          </div>
        </form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTodoStore } from '@/stores/todo'
import type { CreateTodoForm } from '@/types'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const todoStore = useTodoStore()
const showEditModal = ref(false)
const form = ref<CreateTodoForm>({
  title: '',
  description: '',
  priority: 'medium'
})

onMounted(async () => {
  const todoId = Number(route.params.id)
  if (!isNaN(todoId)) {
    await todoStore.fetchTodo(todoId)
    if (todoStore.currentTodo) {
      form.value = {
        title: todoStore.currentTodo.title,
        description: todoStore.currentTodo.description,
        priority: todoStore.currentTodo.priority
      }
    }
  }
})

const handleStatusToggle = async () => {
  if (!todoStore.currentTodo) return
  const newStatus = todoStore.currentTodo.status === 'completed' ? 'pending' : 'completed'
  await todoStore.updateTodoStatus(todoStore.currentTodo.id, newStatus)
}

const handleEdit = () => {
  if (!todoStore.currentTodo) return
  form.value = {
    title: todoStore.currentTodo.title,
    description: todoStore.currentTodo.description,
    priority: todoStore.currentTodo.priority
  }
  showEditModal.value = true
}

const handleDelete = async () => {
  if (!todoStore.currentTodo) return
  if (confirm('确定要删除这个任务吗？')) {
    await todoStore.deleteTodo(todoStore.currentTodo.id)
    router.push('/todos')
  }
}

const handleSubmit = async () => {
  if (!todoStore.currentTodo) return
  try {
    await todoStore.updateTodo(todoStore.currentTodo.id, form.value)
    showEditModal.value = false
    ElMessage({
      type: 'success',
      message: '任务更新成功！'
    })
  } catch (error) {
    console.error('Failed to update todo:', error)
    ElMessage({
      type: 'error',
      message: '任务更新失败，请重试'
    })
  }
}
</script>

<style scoped>
.todo-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.loading,
.not-found {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.todo-status {
  font-size: 1.1rem;
}

.todo-status span {
  font-weight: 500;
}

.todo-status span.completed {
  color: #4CAF50;
}

.todo-status span.pending {
  color: #FFA000;
}

.todo-description {
  margin-bottom: 2rem;
}

.todo-description h2 {
  color: #333;
  margin-bottom: 1rem;
}

.todo-description p {
  color: #666;
  line-height: 1.6;
}

.todo-meta {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

.todo-actions {
  display: flex;
  gap: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-back {
  background-color: #f5f5f5;
  color: #333;
}

.btn-status {
  background-color: #FFA000;
  color: white;
}

.btn-status.completed {
  background-color: #4CAF50;
}

.btn-edit {
  background-color: #2196F3;
  color: white;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group textarea {
  height: 100px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #333;
}

.btn-submit {
  background-color: #4CAF50;
  color: white;
}
</style> 