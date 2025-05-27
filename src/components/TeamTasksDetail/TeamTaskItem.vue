<template lang="pug">
  tr.task-item(@click="handleClick")
    td.status-cell(:class="getStatusClass(task.status)") {{ getStatusText(task.status) }}
    td {{ task.category }}
    td {{ task.title }}
    td.detail-cell {{ task.detail }}
    td {{ formatDate(task.due_at) }}
    td {{ getAssigneeName(task.employee_id) }}
</template>

<script setup>
/* eslint-disable */

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  teamMembers: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click', props.task)
}

function getStatusText(status) {
  const statusMap = {
    'pending': '待機',
    'in_progress': '進行中',
    'done': '完了'
  }
  return statusMap[status] || status
}

function getStatusClass(status) {
  return `status-${status}`
}

function getAssigneeName(employeeId) {
  const member = props.teamMembers.find(m => m.id === employeeId)
  return member ? member.name : '未指定'
}

function formatDate(dateString) {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'
    
    return date.toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  } catch (error) {
    return '-'
  }
}
</script>

<style scoped>
.task-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.task-item:hover {
  background-color: #f8f9fa !important;
}

.task-item td {
  border: 1px solid #000;
  padding: 8px;
  text-align: center;
  background-color: white;
}

.status-cell {
  font-weight: bold;
}

.status-pending {
  background-color: #fff3cd !important;
  color: #856404;
}

.status-in_progress {
  background-color: #d1ecf1 !important;
  color: #0c5460;
}

.status-completed {
  background-color: #d4edda !important;
  color: #155724;
}

.status-cancelled {
  background-color: #f8d7da !important;
  color: #721c24;
}

.detail-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style> 