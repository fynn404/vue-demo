import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Todo, CreateTodoForm, UpdateTodoForm } from '@/types'
import { todos } from '@/services/api'
import { ElMessage } from 'element-plus'

export const useTodoStore = defineStore('todo', () => {
  const todoList = ref<Todo[]>([])
  const currentTodo = ref<Todo | null>(null)
  const loading = ref(false)

  // Get all todos
  const fetchTodos = async () => {
    loading.value = true
    try {
      const { data } = await todos.getAll()
      todoList.value = data
    } catch (error) {
      console.error('Failed to fetch todos:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Get single todo
  const fetchTodo = async (id: number) => {
    loading.value = true
    try {
      const { data } = await todos.getOne(id)
      currentTodo.value = data
      return data
    } catch (error) {
      console.error(`Failed to fetch todo ${id}:`, error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Create todo
  const createTodo = async (form: CreateTodoForm) => {
    try {
      const response = await todos.create(form)
      if (response.data.code === 200) {
        const todo = response.data.data.todo
        todoList.value.push(todo)
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
      const response = await todos.update(id, form)
      if (response.data.code === 200) {
        const todo = response.data.data.todo
        const index = todoList.value.findIndex(t => t.id === id)
        if (index !== -1) {
          todoList.value[index] = todo
        }
        if (currentTodo.value?.id === id) {
          currentTodo.value = todo
        }
        ElMessage({
          type: 'success',
          message: '任务更新成功！'
        })
        return todo
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error(`Failed to update todo ${id}:`, error)
      ElMessage({
        type: 'error',
        message: '任务更新失败，请重试'
      })
      throw error
    }
  }

  // Delete todo
  const deleteTodo = async (id: number) => {
    try {
      const response = await todos.delete(id)
      if (response.data.code === 200) {
        todoList.value = todoList.value.filter(todo => todo.id !== id)
        if (currentTodo.value?.id === id) {
          currentTodo.value = null
        }
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
  const updateTodoStatus = async (id: number, status: 'pending' | 'completed') => {
    try {
      const response = await todos.updateStatus(id, status)
      if (response.data.code === 200) {
        const todo = response.data.data.todo
        const index = todoList.value.findIndex(t => t.id === id)
        if (index !== -1) {
          todoList.value[index] = todo
        }
        if (currentTodo.value?.id === id) {
          currentTodo.value = todo
        }
        ElMessage({
          type: 'success',
          message: status === 'completed' ? '任务已完成！' : '任务已重新开始！'
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
    fetchTodos,
    fetchTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    updateTodoStatus
  }
}) 