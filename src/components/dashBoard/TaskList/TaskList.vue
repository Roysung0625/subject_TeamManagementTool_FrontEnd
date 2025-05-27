<template lang="pug">
.panel.task-list
  .panel-header
    span Task List
  .loading(v-if="isLoading") Loading...
  .error(v-else-if="error") {{ error }}
  ul.panel-body(v-else)
    TaskItem(
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @open-modal="openTaskModal"
    )

// 분리된 TaskModal 컴포넌트 사용
TaskModal(
  :task="selectedTask"
  :isVisible="showModal"
  @close="closeModal"
  @task-updated="handleTaskUpdated"
  @task-deleted="handleTaskDeleted"
)
</template>

<script setup>
/* eslint-disable */
import { ref, computed, watch, onMounted } from 'vue'
// eslint-disable-next-line no-unused-vars
import TaskItem from './TaskItem.vue'
import {useAuthStore} from '@/stores/auth'
import { taskService } from '@/services/taskService'
import TaskModal from './TaskModal.vue'

const authStore = useAuthStore()

// 반응형 상태 정의
const tasks = ref([])
const isLoading = ref(false)
const error = ref(null)
const showModal = ref(false)
const selectedTask = ref(null)

defineEmits(['statusChange', 'delete'])

async function fetchTaskList() {
  console.log('fetchTaskList in TaskList.vue 호출됨')
  
  // authStore에서 사용자 정보 가져오기
  const currentUser = authStore.user
  if (!currentUser || !currentUser.id) {
    console.log('사용자 정보가 없습니다.')
    return
  }
  
  const numericMemberId = Number(currentUser.id)
  
  isLoading.value = true
  error.value = null
  
  try {
    console.log('멤버 태스크 today 목록 in TaskList.vue 로드 중:', numericMemberId)
    const response = await taskService.getEmployeeTodayTasks(numericMemberId)
    //배열 형태로 제대로 오는지 검증
    tasks.value = Array.isArray(response) ? response : []
    console.log('멤버 태스크 today 목록 in TaskList.vue 로드 완료:', tasks.value)
    if (tasks.value.length === 0) {
      // ['employee_id', 'title', 'due', 'status', 'category', 'detail']
      tasks.value.push({
        employee_id: numericMemberId,
        title: 'No tasks assigned',
        due_at: '',
        status: 'pending',
        category: '',
        detail: ''
      })
    }
  } catch (err) {
    console.error('멤버 태스크 today 목록을 in TaskList.vue 가져오는 중 오류 발생:', err)
    error.value = err.message || '멤버 태스크 today 목록을 in TaskList.vue 가져오는 중 오류가 발생했습니다.'
    tasks.value = []
  } finally {
    isLoading.value = false
  }
  // status가 done인 작업들을 뒤로 정렬
  tasks.value = sortTasksByStatus(tasks.value)
}

// status가 done인 작업들을 뒤로 정렬하는 함수
function sortTasksByStatus(tasks) {
  if (!Array.isArray(tasks)) {
    return []
  }
  
  // done이 아닌 작업들과 done인 작업들을 분리
  const notDoneTasks = tasks.filter(task => task.status !== 'done')
  const doneTasks = tasks.filter(task => task.status === 'done')
  
  // done이 아닌 작업들을 앞에, done인 작업들을 뒤에 배치
  return [...notDoneTasks, ...doneTasks]
}

function openTaskModal(task) {
  console.log('openTaskModal() in TaskList.vue:', task)
  selectedTask.value = task
  showModal.value = true
  console.log('openTaskModal() in TaskList.vue: ', )
}

function closeModal() {
  showModal.value = false
  selectedTask.value = null
}

function handleTaskUpdated(updatedTask) {
  const taskIndex = tasks.value.findIndex(task => task.id === updatedTask.id)
  if (taskIndex !== -1) {
    tasks.value[taskIndex] = updatedTask
  }
  closeModal()
}

function handleTaskDeleted(taskId) {
  tasks.value = tasks.value.filter(task => task.id !== taskId)
  closeModal()
}

// 부모 컴포넌트에서 호출할 수 있는 메서드들을 expose
defineExpose({
  fetchTaskList
})

onMounted(() => {
  fetchTaskList()
})
</script>

<style scoped>
.panel-body { 
  list-style: none; 
  margin: 0; 
  padding: 8px; 
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
}

.filter-controls {
  display: flex;
  gap: 8px;
}

.filter-controls select {
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  text-align: center;
  padding: 20px;
  color: #dc3545;
  background-color: #f8d7da;
  margin: 8px;
  border-radius: 4px;
}

.no-tasks {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}

.test-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.test-modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  text-align: center;
}

.test-modal-content button {
  margin-top: 10px;
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: white;
  width: 500px;
  max-width: 90vw;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  background-color: #f3f4f6;
  padding: 16px;
  text-align: center;
  border-radius: 8px 8px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
}

.modal-body {
  padding: 20px;
}

.field-group {
  margin-bottom: 12px;
}

.field-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 4px;
}

.modal-actions {
  padding: 16px;
  text-align: center;
  border-top: 1px solid #e5e7eb;
}

.btn-close {
  padding: 8px 16px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-close:hover {
  background: #4b5563;
}
</style>