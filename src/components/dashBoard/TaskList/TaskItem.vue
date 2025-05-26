<template lang="pug">
li.task-item(:class="task.status")
  .task-content
    h4 {{ task.title }}
    .task-details
      span.due-date Due: {{ formatDate(task.due) }}
  .task-actions
    select(
      :value="taskStatus"
      @change="handleStatusChange"
    )
      option(value="todo") To Do
      option(value="in-progress") In Progress 
      option(value="done") Done
</template>

<script setup>
/* eslint-disable */
import { defineProps, computed } from 'vue'
import { taskService } from '@/services/taskService'

const props = defineProps({
  task: {
    type: Object,
    required: true,
    validator: (task) => {
      //every 메서드는 배열의 각 요소에 대해 콜백 함수를 한 번씩 실행
      //어떤 요소에 대해서라도 false를 반환하면, every는 즉시 실행을 멈추고 false를 반환
      return ['employee_id', 'title', 'due', 'status', 'category', 'detail'].every(
        //여기서는 key가 배열의 요소
        key => key in task
      )
    }
  }
})
const taskStatus = computed(() => props.task.status)

async function updateTask(taskId, newTask) {
  console.log('fetchTaskList in TaskList.vue 호출됨')
  const numericMemberId = Number(memberId.value)
  
  try {
    console.log('update Task in TaskList.vue 로드 중:', numericMemberId)
    const response = await taskService.updateTask(taskId, newTask)
    taskStatus.value = response.status
    console.log('update Task in TaskList.vue 로드 완료:', numericMemberId)
  } catch (err) {
    console.error('update Task in TaskList.vue 가져오는 중 오류 발생:', err)
    error.value = err.message || 'update Task in TaskList.vue 가져오는 중 오류가 발생했습니다.'
    taskStatus.value = props.task.status
  }
}

// eslint-disable-next-line no-unused-vars
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function handleStatusChange(event) {
  const newStatus = event.target.value
  console.log('Status changed:', newStatus)
  const newTask = {
    ...props.task,
    status: newStatus
  }
  updateTask(props.task.id, newTask)
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