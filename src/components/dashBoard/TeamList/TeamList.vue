<template lang="pug">
.team-list.panel
  .panel-header
    span Team List
    button.add-btn(@click="$emit('add')") + New Team
  .loading(v-if="loading") Loading...
  ul.panel-body(v-else)
    TeamItem(
      v-for="team in teams"
      :key="team.id"
      :team="team"
      :is-active="team.id === currentTeam?.id"
      @select="$emit('select', team)"
      @edit="$emit('edit', $event)"
      @remove="$emit('remove', $event)"
    )
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue'
// eslint-disable-next-line no-unused-vars
import TeamItem from './TeamItem.vue'
import teamService from '@/services/teamService'
import { useAuthStore } from '@/stores/auth'

defineProps({
  teams: {
    type: Array,
    required: true,
    default: () => []
  },
  currentTeam: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add', 'edit', 'remove', 'select', 'teams-loaded'])

// 스토어 사용
const authStore = useAuthStore()

// API 요청 관련 상태
const isLoading = ref(false)
const error = ref(null)

// API에서 팀 목록을 가져오는 함수
async function fetchTeamList() {
  isLoading.value = true
  error.value = null
  
  try {
    // 현재 로그인한 사용자의 정보가 필요합니다.
    // 실제 구현에서는 사용자 ID를 어떻게 가져올지 결정해야 합니다.
    // 예시: const currentUser = getCurrentUser()
    // const teams = await teamService.getEmployeeTeams(currentUser.id)
    
    // 임시로 하드코딩된 사용자 ID 사용 (실제로는 로그인한 사용자 정보에서 가져와야 함)
    const employeeId = authStore.user?.id || 1 // authStore에서 사용자 ID 가져오기
    const teams = await teamService.getEmployeeTeams(employeeId)
    
    // 부모 컴포넌트에 팀 데이터 전달
    emit('teams-loaded', teams)
    
  } catch (err) {
    error.value = err.message
    console.error('팀 목록을 가져오는 중 오류 발생:', err)
    
    // 인증 오류인 경우 로그인 페이지로 리다이렉트 등의 처리 필요
    if (err.status === 401) {
      console.warn('인증이 필요합니다. 로그인 페이지로 이동해야 합니다.')
      // 토큰이 만료되었을 수 있으므로 인증 데이터 정리
      authStore.clearAuthData()
    }
  } finally {
    isLoading.value = false
  }
}

// 컴포넌트 마운트 시 팀 목록 로드
onMounted(() => {
  // 인증된 사용자만 팀 목록 조회
  if (authStore.isAuthenticated) {
    fetchTeamList()
  } else {
    console.warn('로그인이 필요합니다.')
    error.value = '로그인이 필요합니다.'
  }
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
</style>