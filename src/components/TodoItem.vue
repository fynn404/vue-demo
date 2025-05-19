<template>
  <div class="todo-item" :class="{ 'completed': todo.status === 'completed' }">
    <div class="todo-content">
      <input
        type="checkbox"
        :checked="todo.status === 'completed'"
        @change="$emit('statusChange', todo.id, todo.status === 'completed' ? 'pending' : 'completed')"
      />
      <div class="todo-text">
        <h3>{{ todo.title }}</h3>
        <p>{{ todo.description }}</p>
      </div>
    </div>
    <div class="todo-actions">
      <button @click="$emit('edit', todo)" class="btn-edit">编辑</button>
      <button @click="$emit('delete', todo.id)" class="btn-delete">删除</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '@/types'

defineProps<{
  todo: Todo
}>()

defineEmits<{
  (e: 'statusChange', id: number, status: 'pending' | 'completed'): void
  (e: 'edit', todo: Todo): void
  (e: 'delete', id: number): void
}>()
</script>

<style scoped>
.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.todo-text {
  flex: 1;
}

.todo-text h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.todo-text p {
  margin: 0.5rem 0 0;
  color: #666;
  font-size: 0.9rem;
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-edit {
  background-color: #4CAF50;
  color: white;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.completed {
  opacity: 0.7;
}

.completed .todo-text h3 {
  text-decoration: line-through;
  color: #888;
}
</style> 