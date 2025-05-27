<template lang="pug">
.panel.progress-board
  .panel-header
    span {{ currentTeamName }}
    .loading-indicator(v-if="isLoading") Loading...
  .panel-body(v-if="!isLoading && !error")
    .no-team(v-if="!currentTeamId") チームを選択してください
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
    .no-members(v-else) メンバーがいません
  .error(v-if="error") {{ error }}
</template>

<script setup>
/* eslint-disable */
import { defineProps, onMounted, ref, computed, watch, defineExpose } from 'vue'
// eslint-disable-next-line no-unused-vars
import MemberRow from './MemberRow.vue'
import { useTeamStore } from '@/stores/team'
import teamService from '@/services/teamService'

// props定義（最初に定義）
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

// レスポンシブ状態（明示的初期化）
const teamMembers = ref([])
const error = ref(null)
const isLoading = ref(false)

// 計算されたプロパティ（反応性維持）
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

// APIからメンバーリストを取得する関数
async function fetchMemberList() {
  const teamId = currentTeamId.value
  
  console.log('fetchMemberList呼び出し, teamId:', teamId, 'type:', typeof teamId)
  
  // より厳格なteamId検証
  if (!teamId || teamId === null || teamId === undefined || teamId === 'null' || teamId === 'undefined') {
    console.log('無効なチームIDによりメンバーリスト初期化')
    teamMembers.value = []
    error.value = null
    return
  }

  // 数字でない場合の処理
  const numericTeamId = Number(teamId)
  if (isNaN(numericTeamId) || numericTeamId <= 0) {
    console.log('数字でないチームID:', teamId)
    teamMembers.value = []
    error.value = '無効なチームIDです。'
    return
  }

  isLoading.value = true
  error.value = null
  
  try {
    console.log('チームメンバーリスト読み込み中:', numericTeamId)
    const response = await teamService.getTeamMembers(numericTeamId)
    teamMembers.value = Array.isArray(response) ? response : []
    console.log('チームメンバーリスト読み込み完了:', teamMembers.value)
    
  } catch (err) {
    console.error('メンバーリスト取得中にエラー発生:', err)
    error.value = err.message || 'メンバーリスト取得中にエラーが発生しました。'
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

// 選択されたチームが変更されるたびにメンバーリスト再読み込み
watch(currentTeamId, (newTeamId, oldTeamId) => {
  console.log('チーム変更検知:', { newTeamId, oldTeamId, newType: typeof newTeamId, oldType: typeof oldTeamId })
  
  if (newTeamId && newTeamId !== oldTeamId) {
    fetchMemberList()
  } else if (!newTeamId) {
    console.log('チーム選択解除')
    teamMembers.value = []
    error.value = null
  }
})

onMounted(() => {
  console.log('ProgressBoardマウント')
  console.log('現在のチームID:', currentTeamId.value)
  console.log('現在選択されたチーム:', currentSelectedTeam.value)
  console.log('teamStore状態:', teamStore)
  
  // すでにチームが選択されている場合はメンバーリスト読み込み
  if (currentTeamId.value) {
    fetchMemberList()
  }
})

// 外部で使用できるように関数と状態expose
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