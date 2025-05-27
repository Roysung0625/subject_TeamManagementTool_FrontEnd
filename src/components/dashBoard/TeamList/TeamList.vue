/* eslint-disable */
<template lang="pug">
.team-list.panel
  .panel-header
    span Team List
    button.add-btn(@click="handleAddTeam") + New Team
  .loading(v-if="isLoading") Loading...
  .error(v-else-if="error") {{ error }}
  ul.panel-body(v-else)
    TeamItem(
      v-for="team in teams"
      :key="team.id"
      :team="team"
      @select="handleSelectTeam"
      @edit="handleEditTeam"
      @remove="handleDeleteTeam"
    )
</template>

<script setup>
/* eslint-disable */
import { ref, onMounted } from 'vue'
// eslint-disable-next-line no-unused-vars
import TeamItem from './TeamItem.vue'
import teamService from '@/services/teamService'
import { useAuthStore } from '@/stores/auth'
import { useTeamStore } from '@/stores/team'

// Props (외부에서 받을 데이터가 있다면)
const props = defineProps({
  // 선택된 팀 정보를 부모에게 전달하기 위한 prop (선택사항)
})

// Emits (부모 컴포넌트에 이벤트 전달)
const emit = defineEmits(['team-selected', 'teams-updated'])

// 스토어 사용
const authStore = useAuthStore()
const teamStore = useTeamStore()

// 팀 관련 상태 관리
const teams = ref([])
const selectedTeam = ref(null)
const isLoading = ref(false)
const error = ref(null)
const currentEmployeeId = authStore.userId

// API에서 팀 목록을 가져오는 함수
async function fetchTeamList() {
  isLoading.value = true
  error.value = null
  
  try {
    //현재 로그인한 사용자의 Id
    const response = await teamService.getEmployeeTeams(currentEmployeeId)
    teams.value = response
    
  } catch (err) {
    error.value = err.message || '팀 목록을 가져오는 중 오류가 발생했습니다.'
    console.error('팀 목록을 가져오는 중 오류 발생:', err)
    
    // 인증 오류인 경우
    if (err.status === 401) {
      console.warn('인증이 필요합니다.')
      authStore.clearAuthData()
    }
  } finally {
    isLoading.value = false
  }
}

// 팀 추가
async function handleAddTeam() {
  try {
    // 예시: 간단한 prompt로 팀 이름 입력받기 (실제로는 모달 사용)
    const teamName = prompt('새 팀 이름을 입력하세요:')
    if (!teamName) return
    
    isLoading.value = true
    const newTeamData = {
      name: teamName
    }
    
    const newTeam = await teamService.createTeam(newTeamData)
    teams.value.push(newTeam)
    
  } catch (err) {
    error.value = err.message || '팀 추가 중 오류가 발생했습니다.'
    console.error('팀 추가 실패:', err)
  } finally {
    isLoading.value = false
  }
}

// 팀 수정
async function handleEditTeam(team) {
  try {
    isLoading.value = true
    
    const newName = prompt('팀 이름을 수정하세요:', team.name)
    if (!newName || newName === team.name) return
    
    const updatedData = { ...team, name: newName }
    const updatedTeam = await teamService.updateTeam(team.id, updatedData)
    
    // 로컬 상태 업데이트
    const index = teams.value.findIndex(t => t.id === team.id)
    if (index !== -1) {
      teams.value[index] = updatedTeam
    }
    
    // 선택된 팀도 업데이트
    if (selectedTeam.value?.id === team.id) {
      selectedTeam.value = updatedTeam
      emit('team-selected', updatedTeam)
    }
    
    emit('teams-updated', teams.value)
    
  } catch (err) {
    error.value = err.message || '팀 수정 중 오류가 발생했습니다.'
    console.error('팀 수정 실패:', err)
  } finally {
    isLoading.value = false
  }
}

// 팀 삭제
async function handleDeleteTeam(team) {
  try {
    if (!confirm(`'${team.name}' 팀을 정말 삭제하시겠습니까?`)) return
    
    isLoading.value = true
    await teamService.deleteTeam(team.id)
    
    // 로컬 상태에서 제거
    teams.value = teams.value.filter(t => t.id !== team.id)
    
    // 선택된 팀이 삭제된 팀이라면 선택 해제
    if (selectedTeam.value?.id === team.id) {
      selectedTeam.value = null
      emit('team-selected', null)
    }
    
    emit('teams-updated', teams.value)
    
  } catch (err) {
    error.value = err.message || '팀 삭제 중 오류가 발생했습니다.'
    console.error('팀 삭제 실패:', err)
  } finally {
    isLoading.value = false
  }
}

// 팀 선택
function handleSelectTeam(team) {
  teamStore.selectedTeam = team
}

// 컴포넌트 마운트 시 팀 목록 로드
onMounted(() => {
  fetchTeamList()
})

</script>

<style scoped>
.team-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.add-btn {
  padding: 6px 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background-color: #2563eb;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  list-style: none;
  margin: 0;
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
  margin: 16px;
  border-radius: 4px;
}
</style>