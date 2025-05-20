<template>
  <el-dialog
    :model-value="visible"
    :title="todo?.title"
    width="50%"
    :close-on-click-modal="true"
    @update:model-value="$emit('update:visible', $event)"
    @close="$emit('close')"
  >
    <div class="todo-detail">
      <div class="detail-header">
        <div class="priority-badge" :class="todo?.priority">
          {{ getPriorityText(todo?.priority) }}
        </div>
        <div class="status-badge" :class="{ completed: todo?.completed }">
          {{ todo?.completed ? '已完成' : '进行中' }}
        </div>
      </div>

      <div class="detail-section">
        <h3>描述</h3>
        <p>{{ todo?.description }}</p>
      </div>

      <div class="detail-section">
        <h3>时间信息</h3>
        <div class="time-info">
          <p>
            <span class="label">创建时间：</span>
            {{ formatDate(todo?.createdAt) }}
          </p>
          <p>
            <span class="label">更新时间：</span>
            {{ formatDate(todo?.updatedAt) }}
          </p>
          <p v-if="todo?.dueDate">
            <span class="label">截止时间：</span>
            {{ formatDate(todo?.dueDate) }}
          </p>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="$emit('close')">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Todo } from '@/types'

// 组件属性定义
const props = defineProps<{
  visible: boolean  // 控制弹窗显示/隐藏
  todo: Todo | null // 要显示的任务详情
}>()

// 定义组件可以触发的事件
const emit = defineEmits<{
  // 关闭事件
  (e: 'close'): void
  // 更新visible属性的事件（用于v-model绑定）
  (e: 'update:visible', value: boolean): void
}>()

// 获取优先级的显示文本
const getPriorityText = (priority?: 'low' | 'medium' | 'high') => {
  const priorityMap = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级'
  }
  return priority ? priorityMap[priority] : ''
}

// 格式化日期显示
const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
/* 详情内容容器 */
.todo-detail {
  padding: 1rem;
}

/* 详情头部区域 */
.detail-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

/* 优先级标签样式 */
.priority-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* 不同优先级的颜色 */
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

/* 状态标签样式 */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  background-color: #f3f4f6;
  color: #4b5563;
}

/* 已完成状态样式 */
.status-badge.completed {
  background-color: #f0fdf4;
  color: #22c55e;
}

/* 详情区块样式 */
.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h3 {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.detail-section p {
  color: #4b5563;
  line-height: 1.5;
  margin: 0;
}

/* 时间信息样式 */
.time-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.time-info .label {
  color: #6b7280;
  font-size: 0.9rem;
}

/* 弹窗底部按钮区域 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
}
</style> 