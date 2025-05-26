<template lang="pug">
.panel.task-list
  .panel-header
    span Task List
  .loading(v-if="loading") Loading...
  ul.panel-body(v-else)
    TaskItem(
      v-for="task in tasks"
      :key="task.id"
      :task="task"
    )
</template>

<script setup>
/* eslint-disable */
import { ref, computed, watch, onMounted } from 'vue'
// eslint-disable-next-line no-unused-vars
import TaskItem from './TaskItem.vue'
import {useAuthStore} from '@/stores/auth'
import { taskService } from '@/services/taskService'

const authStore = useAuthStore()
const memberId = authStore.memberId

const tasks = ref([])


defineEmits(['statusChange', 'delete'])

async function fetchTaskList() {
  console.log('fetchTaskList in TaskList.vue 호출됨')
  const numericMemberId = Number(memberId.value)
  
  isLoading.value = true
  
  try {
    console.log('멤버 태스크 today 목록 in TaskList.vue 로드 중:', numericMemberId)
    const response = await taskService.getEmployeeTodayTasks(numericMemberId)
    //배열 형태로 제대로 오는지 검증
    tasks.value = Array.isArray(response) ? response : []
    console.log('멤버 태스크 today 목록 in TaskList.vue 로드 완료:', numericMemberId)
  } catch (err) {
    console.error('멤버 태스크 today 목록을 in TaskList.vue 가져오는 중 오류 발생:', err)
    error.value = err.message || '멤버 태스크 today 목록을 in TaskList.vue 가져오는 중 오류가 발생했습니다.'
    tasks.value = []
  } finally {
    isLoading.value = false
  }
}

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
</style>