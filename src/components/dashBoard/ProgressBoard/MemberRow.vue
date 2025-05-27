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
import { defineProps, computed, onMounted, ref, watch } from 'vue'
// eslint-disable-next-line no-unused-vars
import ProgressBar from './ProgressBar.vue'
import { useTaskStore } from '@/stores/task'
import { taskService } from '@/services/taskService'

// props 정의 (먼저 정의)
const props = defineProps({
  member: {
    type: Object,
    required: true
  }
})

// 상태 변수들 정의
const isLoading = ref(false)
const error = ref(null)
const memberTasks = ref([])
const progress = ref(0)

async function fetchTaskList() {
  console.log('fetchTaskList 호출됨')
  
  if (!props.member || !props.member.id) {
    console.log('멤버 정보가 없습니다.')
    return
  }
  
  const memberId = props.member.id
  const numericMemberId = Number(memberId)
  
  isLoading.value = true
  error.value = null
  
  try {
    console.log('멤버 태스크 today 목록 로드 중:', numericMemberId)
    const response = await taskService.getEmployeeTodayTasks(numericMemberId)
    //배열 형태로 제대로 오는지 검증
    memberTasks.value = Array.isArray(response) ? response : []
    console.log('멤버 태스크 today 목록 로드 완료:', memberTasks.value)
    
    // 태스크 로드 후 진행률 계산
    calculateProgress()
  } catch (err) {
    console.error('멤버 태스크 today 목록을 가져오는 중 오류 발생:', err)
    error.value = err.message || '멤버 태스크 today 목록을 가져오는 중 오류가 발생했습니다.'
    memberTasks.value = []
    progress.value = 0
  } finally {
    isLoading.value = false
  }
}

function calculateProgress() {
  if (memberTasks.value.length === 0) {
    progress.value = 0
    return
  }
  const totalTasks = memberTasks.value.length
  const completedTasks = memberTasks.value.filter(task => task.status === 'done').length
  progress.value = Math.round((completedTasks / totalTasks) * 100)
  console.log(`in MemberRow.vue ${props.member.name} 진행률:`, progress.value, '%')
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