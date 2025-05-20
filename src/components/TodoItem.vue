<template>
  <div 
    class="todo-item" 
    :class="{ 'completed': todo.completed }"
    @click="handleItemClick"
  >
    <div class="todo-content" @click.stop>
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="$emit('statusChange', todo.id, !todo.completed)"
      />
      <div class="todo-text">
        <div class="todo-header">
          <h3>{{ todo.title }}</h3>
          <div class="priority-badge" :class="todo.priority">
            {{ priorityText }}
          </div>
        </div>
        <p>{{ todo.description }}</p>
      </div>
    </div>
    <div class="todo-actions" @click.stop>
      <el-button 
        type="primary" 
        size="small" 
        @click="handleEditClick"
      >编辑</el-button>
      <el-button 
        type="danger" 
        size="small" 
        @click="$emit('delete', todo.id)"
      >删除</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Todo } from '@/types'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  (e: 'statusChange', id: number, completed: boolean): void
  (e: 'edit', todo: Todo): void
  (e: 'delete', id: number): void
  (e: 'click', todo: Todo): void
}>()

const handleItemClick = (event: MouseEvent) => {
  // 确保点击不是来自按钮或其他控件
  const target = event.target as HTMLElement
  if (!target.closest('.todo-content') && !target.closest('.todo-actions')) {
    emit('click', props.todo)
  }
}

const handleEditClick = () => {
  console.log('Edit clicked:', props.todo)
  emit('edit', props.todo)
}

const priorityText = computed(() => {
  const priorityMap = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级'
  }
  return priorityMap[props.todo.priority]
})
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
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.todo-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.todo-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
  position: relative;
  z-index: 1;
}

.todo-text {
  flex: 1;
}

.todo-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.todo-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.priority-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
}

.priority-badge.high {
  background-color: #fef2f2;
  color: #ef4444;
}

.priority-badge.medium {
  background-color: #fff7ed;
  color: #f97316;
}

.priority-badge.low {
  background-color: #f0fdf4;
  color: #22c55e;
}

.todo-text p {
  margin: 0.5rem 0 0;
  color: #666;
  font-size: 0.9rem;
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
  z-index: 2;
}

.completed {
  opacity: 0.7;
}

.completed .todo-text h3 {
  text-decoration: line-through;
  color: #888;
}
</style> 