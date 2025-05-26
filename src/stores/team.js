import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 팀 관련 상태 관리 스토어
 * Composition API 스타일로 구현
 */
export const useTeamStore = defineStore('team', () => {
  // 상태
  const teams = ref([])
  const selectedTeam = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 계산된 속성
  const getTeams = computed(() => teams.value)
  const isLoading = computed(() => loading.value)
  const teamCount = computed(() => teams.value.length)
  const getSelectedTeam = computed(() => selectedTeam.value)

  // 액션
  /**
   * 선택된 팀 설정
   * @param {Object} team - 선택할 팀
   */
  function setSelectedTeam(team) {
    selectedTeam.value = team
  }

  /**
   * 로딩 상태 설정
   * @param {boolean} isLoading - 로딩 상태
   */
  function setLoading(isLoading) {
    loading.value = isLoading
  }

  /**
   * 에러 설정
   * @param {string} errorMessage - 에러 메시지
   */
  function setError(errorMessage) {
    error.value = errorMessage
  }

  /**
   * 에러 초기화
   */
  function clearError() {
    error.value = null
  }

  // 스토어 반환
  return {
    // 상태
    teams,
    selectedTeam,
    loading,
    error,
    
    // 계산된 속성
    getTeams,
    getSelectedTeam,
    isLoading,
    teamCount,
    
    // 액션
    setSelectedTeam,
    setLoading,
    setError,
    clearError,
  }
}) 