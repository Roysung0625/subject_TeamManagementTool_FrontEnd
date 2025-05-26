<template lang="pug">
tr
  td.member-name {{ member.name }}
  td.member-progress
    ProgressBar(:progress="progress")
    span.percent {{ progress }}%
    .loading(v-if="isLoading") Loading...
</template>

<script setup>
/* eslint-disable */
import { defineProps, computed, onMounted, ref } from 'vue'
// eslint-disable-next-line no-unused-vars
import ProgressBar from './ProgressBar.vue'
import { useTaskStore } from '@/stores/task'
import { taskService } from '@/services/taskService'

// 상태 변수들 정의
const isLoading = ref(false)
const error = ref(null)
const teamMembers = ref([])
const memberTasks = ref([])
const progress = ref(0)
// props 정의
const props = defineProps({
  member: {
    type: Object,
    required: true
  }
})

async function fetchTaskList() {
  console.log('fetchTaskList 호출됨')
  const memberId = props.member.id
  const numericMemberId = Number(memberId)
  
  isLoading.value = true
  
  try {
    console.log('멤버 태스크 today 목록 로드 중:', numericMemberId)
    const response = await taskService.getEmployeeTodayTasks(numericMemberId)
    //배열 형태로 제대로 오는지 검증
    memberTasks.value = Array.isArray(response) ? response : []
    console.log('멤버 태스크 today 목록 로드 완료:', numericMemberId)
  } catch (err) {
    console.error('멤버 태스크 today 목록을 가져오는 중 오류 발생:', err)
    error.value = err.message || '멤버 태스크 today 목록을 가져오는 중 오류가 발생했습니다.'
    teamMembers.value = []
  } finally {
    isLoading.value = false
  }
}

function calculateProgress() {
  if (memberTasks.value.length === 0) {
    return progress.value = 0
  }
  const totalTasks = memberTasks.value.length
  const completedTasks = memberTasks.value.filter(task => task.status === 'done').length
  progress.value = Math.round((completedTasks / totalTasks) * 100)
}

onMounted(() => {
  fetchTaskList()
})
</script>
  
<style scoped>
.member-name { 
  padding: 6px 4px; 
  width: 30%; 
}

.member-progress { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  padding: 6px 4px; 
}

.percent { 
  width: 40px; 
  text-align: right; 
  font-size: 0.9rem; 
  color: #666;
}
</style>