import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Todo, CreateTodoForm, UpdateTodoForm, PaginationParams } from '@/types'
import { todos } from '@/services/api'
import { ElMessage } from 'element-plus'

export const useTodoStore = defineStore('todo', () => {
  const todoList = ref<Todo[]>([])
  const currentTodo = ref<Todo | null>(null)
  const loading = ref(false)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)

  // Get all todos with pagination
  const fetchTodos = async (params?: Partial<PaginationParams>) => {
    loading.value = true
    try {
      console.log('Fetching todos with params:', params)
      const response = await todos.getAll({
        page: params?.page || currentPage.value,
        size: params?.size || pageSize.value
      })
      console.log('Fetch todos response:', response.data)
      if (response.data.code === 200) {
        todoList.value = response.data.data.todos || []
        total.value = response.data.data.total
        if (params?.page) currentPage.value = params.page
        if (params?.size) pageSize.value = params.size
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error)
      ElMessage({
        type: 'error',
        message: '获取任务列表失败，请重试'
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  // Get single todo
  const fetchTodo = async (id: number) => {
    loading.value = true
    try {
      console.log('Fetching single todo:', id)
      const response = await todos.getOne(id)
      console.log('Fetch single todo response:', response.data)
      if (response.data.code === 200) {
        currentTodo.value = response.data.data.todo
        return response.data.data.todo
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error(`Failed to fetch todo ${id}:`, error)
      ElMessage({
        type: 'error',
        message: '获取任务详情失败，请重试'
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  // Create todo
  const createTodo = async (form: CreateTodoForm) => {
    try {
      console.log('Creating todo with form:', form)
      const response = await todos.create(form)
      console.log('Create todo response:', response.data)
      if (response.data.code === 200) {
        const todo = response.data.data.todo
        await fetchTodos({ page: currentPage.value, size: pageSize.value })
        ElMessage({
          type: 'success',
          message: '任务创建成功！'
        })
        return todo
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('Failed to create todo:', error)
      ElMessage({
        type: 'error',
        message: '任务创建失败，请重试'
      })
      throw error
    }
  }

  // Update todo
  const updateTodo = async (id: number, form: UpdateTodoForm) => {
    try {
      console.log('Updating todo:', id, 'with form:', form)
      const response = await todos.update(id, form)
      console.log('Update todo response:', response.data)
      if (response.data.code === 200) {
        const todo = response.data.data.todo
        // Update the todo in the list
        const index = todoList.value.findIndex(t => t.id === id)
        if (index !== -1) {
          todoList.value[index] = todo // Use the complete todo from response
        }
        // Update current todo if it's the one being edited
        if (currentTodo.value?.id === id) {
          currentTodo.value = todo
        }
        ElMessage({
          type: 'success',
          message: form.priority ? '优先级更新成功！' : '任务更新成功！'
        })
        return todo
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error(`Failed to update todo ${id}:`, error)
      ElMessage({
        type: 'error',
        message: form.priority ? '优先级更新失败，请重试' : '任务更新失败，请重试'
      })
      throw error
    }
  }

  // Delete todo
  const deleteTodo = async (id: number) => {
    try {
      console.log('Deleting todo:', id)
      const response = await todos.delete(id)
      console.log('Delete todo response:', response.data)
      if (response.data.code === 200) {
        // 从本地列表中移除
        todoList.value = todoList.value.filter(todo => todo.id !== id)
        // 如果是当前选中的todo，清除它
        if (currentTodo.value?.id === id) {
          currentTodo.value = null
        }
        // 重新获取列表以确保数据同步
        await fetchTodos({ page: currentPage.value, size: pageSize.value })
        ElMessage({
          type: 'success',
          message: '任务删除成功！'
        })
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error(`Failed to delete todo ${id}:`, error)
      ElMessage({
        type: 'error',
        message: '任务删除失败，请重试'
      })
      throw error
    }
  }

  // Update todo status
  const updateTodoStatus = async (id: number, completed: boolean) => {
    try {
      console.log('Updating todo status:', id, completed)
      const response = await todos.updateStatus(id, completed)
      console.log('Update todo status response:', response.data)
      if (response.data.code === 200) {
        const todo = response.data.data.todo
        // 更新本地列表中的对应项
        const index = todoList.value.findIndex(t => t.id === id)
        if (index !== -1) {
          todoList.value[index] = { ...todoList.value[index], completed }
        }
        // 如果是当前选中的todo，也更新它
        if (currentTodo.value?.id === id) {
          currentTodo.value = { ...currentTodo.value, completed }
        }
        // 重新获取列表以确保数据同步
        await fetchTodos({ page: currentPage.value, size: pageSize.value })
        ElMessage({
          type: 'success',
          message: completed ? '任务已完成！' : '任务已重新开始！'
        })
        return todo
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error(`Failed to update todo ${id} status:`, error)
      ElMessage({
        type: 'error',
        message: '状态更新失败，请重试'
      })
      throw error
    }
  }

  return {
    todoList,
    currentTodo,
    loading,
    total,
    currentPage,
    pageSize,
    fetchTodos,
    fetchTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    updateTodoStatus
  }
}) 