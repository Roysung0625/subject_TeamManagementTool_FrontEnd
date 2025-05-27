import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import teamService from '@/services/teamService'

/**
 * チーム関連状態管理ストア
 * Composition APIスタイルで実装
 */
export const useTeamStore = defineStore('team', () => {
  // 状態
  const teams = ref([])
  const selectedTeam = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 計算されたプロパティ
  const getTeams = computed(() => teams.value)
  const isLoading = computed(() => loading.value)
  const teamCount = computed(() => teams.value.length)
  const getSelectedTeam = computed(() => selectedTeam.value)

  // アクション
  /**
   * 全体チームリスト照会
   */
  async function fetchTeams() {
    loading.value = true
    error.value = null
    
    try {
      const response = await teamService.getTeams()
      teams.value = response
    } catch (err) {
      error.value = err.message || 'チームリスト取得中にエラーが発生しました。'
      console.error('チームリスト取得失敗:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 選択されたチーム設定
   * @param {Object} team - 選択するチーム
   */
  function setSelectedTeam(team) {
    selectedTeam.value = team
  }

  /**
   * ローディング状態設定
   * @param {boolean} isLoading - ローディング状態
   */
  function setLoading(isLoading) {
    loading.value = isLoading
  }

  /**
   * エラー設定
   * @param {string} errorMessage - エラーメッセージ
   */
  function setError(errorMessage) {
    error.value = errorMessage
  }

  /**
   * エラー初期化
   */
  function clearError() {
    error.value = null
  }

  // ストア返却
  return {
    // 状態
    teams,
    selectedTeam,
    loading,
    error,
    
    // 計算されたプロパティ
    getTeams,
    getSelectedTeam,
    isLoading,
    teamCount,
    
    // アクション
    fetchTeams,
    setSelectedTeam,
    setLoading,
    setError,
    clearError,
  }
}) 