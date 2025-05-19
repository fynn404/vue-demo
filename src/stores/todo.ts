import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Todo, CreateTodoForm, UpdateTodoForm } from '@/types'
import { todos } from '@/services/api'

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
      const { data } = await todos.create(form)
      todoList.value.push(data)
      return data
    } catch (error) {
      console.error('Failed to create todo:', error)
      throw error
    }
  }

  // Update todo
  const updateTodo = async (id: number, form: UpdateTodoForm) => {
    try {
      const { data } = await todos.update(id, form)
      const index = todoList.value.findIndex(todo => todo.id === id)
      if (index !== -1) {
        todoList.value[index] = data
      }
      if (currentTodo.value?.id === id) {
        currentTodo.value = data
      }
      return data
    } catch (error) {
      console.error(`Failed to update todo ${id}:`, error)
      throw error
    }
  }

  // Delete todo
  const deleteTodo = async (id: number) => {
    try {
      await todos.delete(id)
      todoList.value = todoList.value.filter(todo => todo.id !== id)
      if (currentTodo.value?.id === id) {
        currentTodo.value = null
      }
    } catch (error) {
      console.error(`Failed to delete todo ${id}:`, error)
      throw error
    }
  }

  // Update todo status
  const updateTodoStatus = async (id: number, status: 'pending' | 'completed') => {
    try {
      const { data } = await todos.updateStatus(id, status)
      const index = todoList.value.findIndex(todo => todo.id === id)
      if (index !== -1) {
        todoList.value[index] = data
      }
      if (currentTodo.value?.id === id) {
        currentTodo.value = data
      }
      return data
    } catch (error) {
      console.error(`Failed to update todo ${id} status:`, error)
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