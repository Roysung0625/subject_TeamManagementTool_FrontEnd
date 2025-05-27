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

// Props（外部から受け取るデータがある場合）
const props = defineProps({
  // 選択されたチーム情報を親に渡すためのprop（オプション）
})

// Emits（親コンポーネントにイベント送信）
const emit = defineEmits(['team-selected', 'teams-updated'])

// ストア使用
const authStore = useAuthStore()
const teamStore = useTeamStore()

// チーム関連状態管理
const teams = ref([])
const selectedTeam = ref(null)
const isLoading = ref(false)
const error = ref(null)
const currentEmployeeId = authStore.userId

// APIからチームリストを取得する関数
async function fetchTeamList() {
  isLoading.value = true
  error.value = null
  
  try {
    // 現在ログインしたユーザーのId
    const response = await teamService.getEmployeeTeams(currentEmployeeId)
    teams.value = response
    
  } catch (err) {
    error.value = err.message || 'チームリスト取得中にエラーが発生しました。'
    console.error('チームリスト取得中にエラー発生:', err)
    
    // 認証エラーの場合
    if (err.status === 401) {
      console.warn('認証が必要です。')
      authStore.clearAuthData()
    }
  } finally {
    isLoading.value = false
  }
}

// チーム追加
async function handleAddTeam() {
  try {
    // 例：簡単なpromptでチーム名入力受け取り（実際にはモーダル使用）
    const teamName = prompt('新しいチーム名を入力してください:')
    if (!teamName) return
    
    isLoading.value = true
    const newTeamData = {
      name: teamName
    }
    
    const newTeam = await teamService.createTeam(newTeamData)
    teams.value.push(newTeam)
    
  } catch (err) {
    error.value = err.message || 'チーム追加中にエラーが発生しました。'
    console.error('チーム追加失敗:', err)
  } finally {
    isLoading.value = false
  }
}

// チーム修正
async function handleEditTeam(team) {
  try {
    isLoading.value = true
    
    const newName = prompt('チーム名を修正してください:', team.name)
    if (!newName || newName === team.name) return
    
    const updatedData = { ...team, name: newName }
    const updatedTeam = await teamService.updateTeam(team.id, updatedData)
    
    // ローカル状態更新
    const index = teams.value.findIndex(t => t.id === team.id)
    if (index !== -1) {
      teams.value[index] = updatedTeam
    }
    
    // 選択されたチームも更新
    if (selectedTeam.value?.id === team.id) {
      selectedTeam.value = updatedTeam
      emit('team-selected', updatedTeam)
    }
    
    emit('teams-updated', teams.value)
    
  } catch (err) {
    error.value = err.message || 'チーム修正中にエラーが発生しました。'
    console.error('チーム修正失敗:', err)
  } finally {
    isLoading.value = false
  }
}

// チーム削除
async function handleDeleteTeam(team) {
  try {
    if (!confirm(`'${team.name}' チームを本当に削除しますか？`)) return
    
    isLoading.value = true
    await teamService.deleteTeam(team.id)
    
    // ローカル状態から削除
    teams.value = teams.value.filter(t => t.id !== team.id)
    
    // 選択されたチームが削除されたチームなら選択解除
    if (selectedTeam.value?.id === team.id) {
      selectedTeam.value = null
      emit('team-selected', null)
    }
    
    emit('teams-updated', teams.value)
    
  } catch (err) {
    error.value = err.message || 'チーム削除中にエラーが発生しました。'
    console.error('チーム削除失敗:', err)
  } finally {
    isLoading.value = false
  }
}

// チーム選択
function handleSelectTeam(team) {
  selectedTeam.value = team
  emit('team-selected', team)
}

// コンポーネントマウント時チームリスト読み込み
onMounted(() => {
  fetchTeamList()
})

// 外部で使用できるように関数expose
defineExpose({
  fetchTeamList
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