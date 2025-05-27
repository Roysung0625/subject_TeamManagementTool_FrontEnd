<template lang="pug">
li.task-item(:class="currentStatus" @click="openModal")
  .task-content
    h4 {{ `[${task.category}] ${task.title}` }}
    .task-details
      span.due-date(v-if="task.due_at") Due: {{ formatDate(task.due_at) }}
      span.due-date(v-else) Due: Not set
  .task-actions
    select(
      :value="currentStatus"
      @change="handleStatusChange"
      @click.stop
      :disabled="isUpdating"
    )
      option(value="pending") Pending
      option(value="in_progress") In Progress 
      option(value="done") Done
    .error(v-if="error") {{ error }}
</template>

<script setup>
/* eslint-disable */
import { defineProps, defineEmits, ref, watch } from 'vue'
import { taskService } from '@/services/taskService'

const props = defineProps({
  task: {
    type: Object,
    required: true,
    validator: (task) => {
      //every 메서드는 배열의 각 요소에 대해 콜백 함수를 한 번씩 실행
      //어떤 요소에 대해서라도 false를 반환하면, every는 즉시 실행을 멈추고 false를 반환
      return ['employee_id', 'title', 'due_at', 'status', 'category', 'detail'].every(
        //여기서는 key가 배열의 요소
        key => key in task
      )
    }
  }
})

const emit = defineEmits(['open-modal'])

const currentStatus = ref(props.task.status)
const error = ref(null)
const isUpdating = ref(false)

// props 변경 시 로컬 상태 동기화
watch(() => props.task.status, (newStatus) => {
  currentStatus.value = newStatus
}, { immediate: true })

async function updateTask(taskId, newTask) {
  isUpdating.value = true
  error.value = null
  
  try {
    const response = await taskService.updateTask(taskId, newTask)
    console.log('Task 업데이트 완료:', response)
    
    // 성공 시 로컬 상태 즉시 업데이트
    currentStatus.value = newTask.status
    
    error.value = null
    
  } catch (err) {
    console.error('Task 업데이트 실패:', err)
    error.value = err.message || 'Task 업데이트에 실패했습니다.'
    
    // 실패 시 원래 상태로 되돌리기
    currentStatus.value = props.task.status
  } finally {
    isUpdating.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return 'No due date'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid date'
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  } catch (error) {
    return 'Invalid date'
  }
}

function handleStatusChange(event) {
  const newStatus = event.target.value
  console.log('Status 변경:', newStatus)
  
  if (newStatus === currentStatus.value) {
    return
  }
  
  const updatedTask = {
    ...props.task,
    status: newStatus
  }
  
  updateTask(props.task.id, updatedTask)
}

function openModal() {
  console.log('openModal() in TaskItem.vue:', props.task)
  emit('open-modal', props.task)
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
  flex-direction: column;
  gap: 4px;
}

select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error {
  font-size: 0.8rem;
  color: #dc3545;
  background-color: #f8d7da;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
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