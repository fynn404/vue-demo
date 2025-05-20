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
    <div v-else>
      <div class="todo-items">
        <TodoItem
          v-for="todo in sortedTodos"
          :key="todo.id"
          :todo="todo"
          @status-change="handleStatusChange"
          @edit="handleEdit"
          @delete="handleDelete"
          @click="handleTodoClick"
        />
      </div>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="todoStore.currentPage"
          v-model:page-size="todoStore.pageSize"
          :total="todoStore.total"
          :page-sizes="[5, 10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <el-dialog
      v-model="showCreateModal"
      :title="editingTodo ? '编辑任务' : '新建任务'"
      width="50%"
      :close-on-click-modal="false"
      @close="closeModal"
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
            <el-button @click="closeModal">取消</el-button>
            <el-button type="primary" native-type="submit">
              {{ editingTodo ? '保存' : '创建' }}
            </el-button>
          </div>
        </form>
      </div>
    </el-dialog>

    <!-- Detail Modal -->
    <TodoDetailModal
      v-model:visible="showDetailModal"
      :todo="selectedTodo"
      @close="closeDetailModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todo'
import TodoItem from '@/components/TodoItem.vue'
import TodoDetailModal from '@/components/TodoDetailModal.vue'
import type { Todo, CreateTodoForm } from '@/types'
import { ElMessage } from 'element-plus'

const todoStore = useTodoStore()
const showCreateModal = ref(false)
const showDetailModal = ref(false)
const editingTodo = ref<Todo | null>(null)
const selectedTodo = ref<Todo | null>(null)
const form = ref<CreateTodoForm>({
  title: '',
  description: '',
  priority: 'medium' // 默认中优先级
})

// 按优先级排序的计算属性
const sortedTodos = computed(() => {
  const priorityOrder = { high: 3, medium: 2, low: 1 }
  return [...todoStore.todoList].sort((a, b) => {
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
})

onMounted(async () => {
  await todoStore.fetchTodos()
})

const handleStatusChange = async (id: number, completed: boolean) => {
  await todoStore.updateTodoStatus(id, completed)
}

const handleTodoClick = async (todo: Todo) => {
  try {
    // 获取最新的todo详情
    const updatedTodo = await todoStore.fetchTodo(todo.id)
    if (updatedTodo) {
      selectedTodo.value = updatedTodo
      showDetailModal.value = true
    }
  } catch (error) {
    console.error('Failed to fetch todo details:', error)
    ElMessage({
      type: 'error',
      message: '获取任务详情失败，请重试'
    })
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedTodo.value = null
}

const handleEdit = (todo: Todo) => {
  console.log('Handling edit for todo:', todo)
  editingTodo.value = todo
  form.value = {
    title: todo.title,
    description: todo.description,
    priority: todo.priority
  }
  // 如果是从详情页点击编辑，先关闭详情弹窗
  showDetailModal.value = false
  // 显示编辑弹窗
  showCreateModal.value = true
}

const handleDelete = async (id: number) => {
  if (confirm('确定要删除这个任务吗？')) {
    await todoStore.deleteTodo(id)
    // 如果正在显示被删除的todo的详情，关闭详情弹窗
    if (selectedTodo.value?.id === id) {
      closeDetailModal()
    }
  }
}

const handleSubmit = async () => {
  try {
    if (editingTodo.value) {
      await todoStore.updateTodo(editingTodo.value.id, form.value)
      // 如果正在显示被编辑的todo的详情，更新详情数据
      if (selectedTodo.value?.id === editingTodo.value.id) {
        const updatedTodo = await todoStore.fetchTodo(editingTodo.value.id)
        if (updatedTodo) {
          selectedTodo.value = updatedTodo
        }
      }
    } else {
      await todoStore.createTodo(form.value)
    }
    closeModal()
  } catch (error) {
    console.error('Failed to save todo:', error)
    ElMessage({
      type: 'error',
      message: editingTodo.value ? '更新任务失败，请重试' : '创建任务失败，请重试'
    })
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingTodo.value = null
  form.value = {
    title: '',
    description: '',
    priority: 'medium'
  }
}

const handleSizeChange = async (size: number) => {
  await todoStore.fetchTodos({ page: 1, size })
}

const handleCurrentChange = async (page: number) => {
  await todoStore.fetchTodos({ page, size: todoStore.pageSize })
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
  margin-bottom: 2rem;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
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
.form-group textarea,
.form-group :deep(.el-select) {
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
</style> 