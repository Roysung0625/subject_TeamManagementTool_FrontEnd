<template lang="pug">
.panel.progress-board
  .panel-header
    span {{ currentTeamName }}
    .loading-indicator(v-if="isLoading") Loading...
  .panel-body(v-if="!isLoading && !error")
    .no-team(v-if="!currentTeamId") 팀을 선택해주세요
    table(v-else-if="teamMembers && teamMembers.length > 0")
      thead
        tr
          th Member
          th Progress
      tbody
        MemberRow(
          v-for="member in teamMembers"
          :key="member.id"
          :member="member"
        )
    .no-members(v-else) 멤버가 없습니다
  .error(v-if="error") {{ error }}
</template>

<script setup>
/* eslint-disable */
import { defineProps, onMounted, ref, computed, watch, defineExpose } from 'vue'
// eslint-disable-next-line no-unused-vars
import MemberRow from './MemberRow.vue'
import { useTeamStore } from '@/stores/team'
import teamService from '@/services/teamService'

// props 정의 (먼저 정의)
const props = defineProps({
  members: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  teamName: {
    type: String,
    default: null
  }
})

const teamStore = useTeamStore()

// 반응형 상태 (명시적 초기화)
const teamMembers = ref([])
const error = ref(null)
const isLoading = ref(false)

// 계산된 속성 (반응성 유지)
const currentSelectedTeam = computed(() => teamStore.selectedTeam)
const currentTeamName = computed(() => {
  if (currentSelectedTeam.value?.name) {
    return currentSelectedTeam.value.name
  }
  return props.teamName || 'No Team Selected'
})
const currentTeamId = computed(() => {
  return currentSelectedTeam.value?.id || null
})

// API에서 멤버 목록을 가져오는 함수
async function fetchMemberList() {
  const teamId = currentTeamId.value
  
  console.log('fetchMemberList 호출됨, teamId:', teamId, 'type:', typeof teamId)
  
  // 더 엄격한 teamId 검증
  if (!teamId || teamId === null || teamId === undefined || teamId === 'null' || teamId === 'undefined') {
    console.log('유효하지 않은 팀 ID로 인해 멤버 목록 초기화')
    teamMembers.value = []
    error.value = null
    return
  }

  // 숫자가 아닌 경우 처리
  const numericTeamId = Number(teamId)
  if (isNaN(numericTeamId) || numericTeamId <= 0) {
    console.log('숫자가 아닌 팀 ID:', teamId)
    teamMembers.value = []
    error.value = '유효하지 않은 팀 ID입니다.'
    return
  }

  isLoading.value = true
  error.value = null
  
  try {
    console.log('팀 멤버 목록 로드 중:', numericTeamId)
    const response = await teamService.getTeamMembers(numericTeamId)
    teamMembers.value = Array.isArray(response) ? response : []
    console.log('팀 멤버 목록 로드 완료:', teamMembers.value)
    
  } catch (err) {
    console.error('멤버 목록을 가져오는 중 오류 발생:', err)
    error.value = err.message || '멤버 목록을 가져오는 중 오류가 발생했습니다.'
    teamMembers.value = []
  } finally {
    isLoading.value = false
  }
}

// eslint-disable-next-line no-unused-vars
function showMembers(){
  if (teamMembers.value.length > 0) {
    return true
  }
  return false
}

// 선택된 팀이 변경될 때마다 멤버 목록 다시 로드
watch(currentTeamId, (newTeamId, oldTeamId) => {
  console.log('팀 변경 감지:', { newTeamId, oldTeamId, newType: typeof newTeamId, oldType: typeof oldTeamId })
  
  if (newTeamId && newTeamId !== oldTeamId) {
    fetchMemberList()
  } else if (!newTeamId) {
    console.log('팀 선택 해제됨')
    teamMembers.value = []
    error.value = null
  }
})

onMounted(() => {
  console.log('ProgressBoard 마운트됨')
  console.log('현재 팀 ID:', currentTeamId.value)
  console.log('현재 선택된 팀:', currentSelectedTeam.value)
  console.log('teamStore 상태:', teamStore)
  
  // 이미 팀이 선택되어 있다면 멤버 목록 로드
  if (currentTeamId.value) {
    fetchMemberList()
  }
})

// 외부에서 사용할 수 있도록 함수와 상태 expose
defineExpose({
  fetchMemberList
})
</script>

<style scoped>
.progress-board {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.loading-indicator {
  font-size: 0.9rem;
  color: #666;
}

.panel-body {
  padding: 16px;
}

.no-team, .no-members {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-style: italic;
}

.error {
  text-align: center;
  padding: 20px;
  color: #dc3545;
  background-color: #f8d7da;
  margin: 16px;
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 8px;
  border-bottom: 2px solid #eee;
  font-weight: 600;
  color: #374151;
}

th:last-child {
  text-align: right;
}
</style>