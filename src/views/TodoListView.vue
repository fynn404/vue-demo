<template>
  <div class="todo-list">
    <div class="todo-header">
      <h1>我的任务</h1>
      <button @click="showCreateModal = true" class="btn-add">新建任务</button>
    </div>

    <div v-if="todoStore.loading" class="loading">
      加载中...
    </div>
    <div v-else-if="todoStore.todoList.length === 0" class="empty-state">
      暂无任务，点击"新建任务"按钮创建新的任务
    </div>
    <div v-else class="todo-items">
      <TodoItem
        v-for="todo in todoStore.todoList"
        :key="todo.id"
        :todo="todo"
        @status-change="handleStatusChange"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || editingTodo" class="modal">
      <div class="modal-content">
        <h2>{{ editingTodo ? '编辑任务' : '新建任务' }}</h2>
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
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-cancel">取消</button>
            <button type="submit" class="btn-submit">{{ editingTodo ? '保存' : '创建' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todo'
import TodoItem from '@/components/TodoItem.vue'
import type { Todo, CreateTodoForm } from '@/types'

const todoStore = useTodoStore()
const showCreateModal = ref(false)
const editingTodo = ref<Todo | null>(null)
const form = ref<CreateTodoForm>({
  title: '',
  description: ''
})

onMounted(async () => {
  await todoStore.fetchTodos()
})

const handleStatusChange = async (id: number, status: 'pending' | 'completed') => {
  await todoStore.updateTodoStatus(id, status)
}

const handleEdit = (todo: Todo) => {
  editingTodo.value = todo
  form.value = {
    title: todo.title,
    description: todo.description
  }
}

const handleDelete = async (id: number) => {
  if (confirm('确定要删除这个任务吗？')) {
    await todoStore.deleteTodo(id)
  }
}

const handleSubmit = async () => {
  try {
    if (editingTodo.value) {
      await todoStore.updateTodo(editingTodo.value.id, form.value)
    } else {
      await todoStore.createTodo(form.value)
    }
    closeModal()
  } catch (error) {
    console.error('Failed to save todo:', error)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingTodo.value = null
  form.value = {
    title: '',
    description: ''
  }
}
</script>

<style scoped>
.todo-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-add {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.loading,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.todo-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.btn-cancel,
.btn-submit {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
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