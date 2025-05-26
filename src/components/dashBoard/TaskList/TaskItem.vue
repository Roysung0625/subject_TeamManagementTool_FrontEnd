<template lang="pug">
li.task-item(:class="task.status")
  .task-content
    h4 {{ task.title }}
    .task-details
      span.due-date Due: {{ formatDate(task.due) }}
      span.assignee Assigned: {{ task.assignee }}
      span.priority(:class="task.priority") {{ getPriorityLabel(task.priority) }}
  .task-actions
    select(
      :value="task.status"
      @change="$emit('status-change', $event.target.value)"
    )
      option(value="todo") Todo
      option(value="in-progress") In Progress
      option(value="done") Done
    button.delete-btn(
      @click="$emit('delete')"
    ) Delete
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  task: {
    type: Object,
    required: true,
    validator: (task) => {
      return ['id', 'title', 'due', 'status', 'assignee', 'priority'].every(
        key => key in task
      )
    }
  }
})

defineEmits(['status-change', 'delete'])

// eslint-disable-next-line no-unused-vars
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// eslint-disable-next-line no-unused-vars
function getPriorityLabel(priority) {
  const labels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low'
  }
  return labels[priority] || priority
}
</script>

<style scoped>
.task-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.task-content {
  flex: 1;
}

h4 {
  margin: 0 0 8px 0;
  font-size: 1rem;
}

.task-details {
  display: flex;
  gap: 12px;
  font-size: 0.9rem;
  color: #666;
}

.priority {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.priority.high {
  background-color: #fee2e2;
  color: #dc2626;
}

.priority.medium {
  background-color: #fef3c7;
  color: #d97706;
}

.priority.low {
  background-color: #e0e7ff;
  color: #4f46e5;
}

.task-actions {
  display: flex;
  gap: 8px;
}

select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.delete-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  background-color: #fee2e2;
  color: #dc2626;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #fecaca;
}

.task-item.done {
  opacity: 0.7;
}

.task-item.done h4 {
  text-decoration: line-through;
}
</style>