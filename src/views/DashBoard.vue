<template lang="pug">
.dashboard-grid
  //- 上部ユーザー情報
  UserTag(
    :username="loginUserName"
    :role="loginUserRole"
  )

  //- 左側：チームリスト（自己管理）
  TeamList(
    ref="teamListRef"
    @team-selected="handleTeamSelected"
    @teams-updated="handleTeamsUpdated"
  )

  //- 中央：進捗ボード
  ProgressBoard(
    ref="progressBoardRef"
    :selectedTeam="selectedTeam"
    :loading="loadingStates.progress"
  )

  //- 右側：ToDoリスト
  TaskList(
    :selectedTeam="selectedTeam"
    @task-status-change="handleTaskStatusChange"
    @delete-task="handleDeleteTask"
  )

  //- 下部：2:1比率コンテナ
  .bottom-container
    CreateTaskForm(
      :selectedTeam="selectedTeam"
      @task-created="handleTaskCreated"
      @create-task="handleCreateTask"
    )
    OverviewPanel(
      :teamStats="teamStats"
      :workspaceStats="workspaceStats"
      :loading="loadingStates.stats"
      @team-details="handleTeamDetails"
      @workspace-details="handleWorkspaceDetails"
    )

  //- Workspace Modal
  WorkspaceModal(
    :isVisible="showWorkspaceModal"
    @close="handleCloseWorkspaceModal"
  )
</template>

<script setup>
/* eslint-disable */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useTeamStore } from '@/stores/team'
import { useTaskStore } from '@/stores/task'
import { useAuthStore } from '@/stores/auth'

// eslint-disable-next-line no-unused-vars
import TeamList from '@/components/dashBoard/TeamList/TeamList.vue'
// eslint-disable-next-line no-unused-vars
import ProgressBoard from '@/components/dashBoard/ProgressBoard/ProgressBoard.vue'
// eslint-disable-next-line no-unused-vars
import TaskList from '@/components/dashBoard/TaskList/TaskList.vue'
// eslint-disable-next-line no-unused-vars
import CreateTaskForm from '@/components/dashBoard/CreateTaskForm/CreateTaskForm.vue'
// eslint-disable-next-line no-unused-vars
import OverviewPanel from '@/components/dashBoard/OverviewPanel/OverviewPanel.vue'
// eslint-disable-next-line no-unused-vars
import UserTag from '@/components/dashBoard/UserTag.vue'
// eslint-disable-next-line no-unused-vars
import WorkspaceModal from '@/components/dashBoard/WorkspaceModal.vue'

// Router追加
const router = useRouter()

// Store初期化
// eslint-disable-next-line no-unused-vars
const userStore = useUserStore()
const teamStore = useTeamStore()
const taskStore = useTaskStore()
const authStore = useAuthStore()

// 現在ログインしたユーザー関連
// eslint-disable-next-line no-unused-vars
const loginUser = computed(() => authStore.user)
// eslint-disable-next-line no-unused-vars
const loginUserName = computed(() => loginUser.value?.name || 'ユーザー')
// eslint-disable-next-line no-unused-vars
const loginUserRole = computed(() => {
  const role = loginUser.value?.role
  if (role === 'Admin') {
    return '管理者'
  } else if (role === 'Employee') {
    return '従業員'
  }
  return '従業員'
})

// チーム関連状態（TeamListから受け取り）
const teams = ref([])
const selectedTeam = ref(null)

// eslint-disable-next-line no-unused-vars
const memberList = ref([])

// ローディング状態管理
// eslint-disable-next-line no-unused-vars
const loadingStates = ref({
  progress: false,
  stats: false
})

// 統計データ
// eslint-disable-next-line no-unused-vars
const teamStats = ref({})

// eslint-disable-next-line no-unused-vars
const workspaceStats = ref({})

// Template Ref追加
const taskListRef = ref(null)
const progressBoardRef = ref(null)

// モーダル状態
const showWorkspaceModal = ref(false)

// TeamListから受け取るイベントハンドラー
// eslint-disable-next-line no-unused-vars
function handleTeamSelected(team) {
  selectedTeam.value = team
  
  // teamStoreにも選択されたチーム設定
  teamStore.setSelectedTeam(team)
  
  console.log('選択されたチーム:', team)
  
  // 選択されたチームに応じて他のコンポーネント更新
  // 例：該当チームのタスクリスト読み込み、メンバーリスト更新など
}

// eslint-disable-next-line no-unused-vars
function handleTeamsUpdated(updatedTeams) {
  teams.value = updatedTeams
  console.log('チームリスト更新:', updatedTeams)
  
  // 統計データ更新
  workspaceStats.value.全体チーム数 = updatedTeams.length
}

// タスク関連イベントハンドラー
// eslint-disable-next-line no-unused-vars
async function handleTaskStatusChange(taskId, newStatus) {
  await taskStore.updateTaskStatus(taskId, newStatus)
}

// eslint-disable-next-line no-unused-vars
async function handleDeleteTask(taskId) {
  await taskStore.deleteTask(taskId)
}

// CreateTaskFormから来るイベントハンドラー
function handleTaskCreated(taskData) {
  console.log('DashBoardで受け取った新しいタスク:', taskData)
  
  // TaskListコンポーネントのメソッド直接呼び出し
  if (taskListRef.value) {
    taskListRef.value.fetchTaskList()
  }
  
  console.log('タスクが正常に作成されました:', taskData.title)
}

function handleCreateTask(taskData) {
  console.log('DashBoard handleCreateTask呼び出し:', taskData)
}

// 統計関連イベントハンドラー
// eslint-disable-next-line no-unused-vars
function handleTeamDetails() {
  console.log('チーム詳細情報表示')
  if(teamStore.selectedTeam){
    router.push(`/teamtasks`)
  }else{
    alert('チームが選択されていません。')
    return
  }
}

// eslint-disable-next-line no-unused-vars
function handleWorkspaceDetails() {
  console.log('ワークスペース詳細情報表示')
  showWorkspaceModal.value = true
}

function handleCloseWorkspaceModal() {
  showWorkspaceModal.value = false
  progressBoardRef.value.fetchMemberList()
}
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: 240px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  padding: 16px;
  height: 100vh;
  box-sizing: border-box;
  background-color: #f9fafb;
}

/* 最初の行：UserTag */
.dashboard-grid > *:nth-child(1) {
  grid-column: 1 / -1;
  margin-bottom: 16px;
}

/* 中間行：チームリスト、進捗ボード、ToDoリスト */
.dashboard-grid > TeamList { grid-row: 2; grid-column: 1; }
.dashboard-grid > ProgressBoard { grid-row: 2; grid-column: 2; }
.dashboard-grid > TaskList { grid-row: 2; grid-column: 3; }

/* 下部コンテナ：全体幅占有 */
.bottom-container {
  grid-row: 3;
  grid-column: 1 / -1;
  display: flex;
  gap: 16px;
}

/* CreateTaskForm：2/3幅 */
.bottom-container > CreateTaskForm {
  flex: 1;
}

/* OverviewPanel：1/3幅 */
.bottom-container > OverviewPanel {
  flex: 1;
}
</style>