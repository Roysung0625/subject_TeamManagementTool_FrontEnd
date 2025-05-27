<template lang="pug">
.dashboard-grid
  //- 상단 사용자 정보
  UserTag(
    :userName="loginUserName"
    :userRole="loginUserRole"
  )

  //- 왼쪽: 팀 목록 (자체 관리)
  TeamList(
    @team-selected="handleTeamSelected"
    @teams-updated="handleTeamsUpdated"
  )

  //- 중앙: 진행률 보드
  ProgressBoard(
    :selectedTeam="selectedTeam"
    :loading="loadingStates.progress"
  )

  //- 오른쪽: 할 일 목록
  TaskList(
    ref="taskListRef"
    :selectedTeam="selectedTeam"
    @task-status-change="handleTaskStatusChange"
    @delete-task="handleDeleteTask"
  )

  //- 하단: 2:1 비율 컨테이너
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

// Router 추가
const router = useRouter()

// Store 초기화
// eslint-disable-next-line no-unused-vars
const userStore = useUserStore()
const teamStore = useTeamStore()
const taskStore = useTaskStore()
const authStore = useAuthStore()

//현재 로그인한 사용자 관련
// eslint-disable-next-line no-unused-vars
const loginUser = computed(() => authStore.user)
// eslint-disable-next-line no-unused-vars
const loginUserName = computed(() => loginUser.value?.name || '사용자')
// eslint-disable-next-line no-unused-vars
const loginUserRole = computed(() => {
  const role = loginUser.value?.role
  if (role === 'Admin') {
    return '관리자'
  } else if (role === 'Employee') {
    return '직원'
  }
  return '직원'
})

// 팀 관련 상태 (TeamList에서 전달받음)
const teams = ref([])
const selectedTeam = ref(null)

// eslint-disable-next-line no-unused-vars
const memberList = ref([])

// 로딩 상태 관리
// eslint-disable-next-line no-unused-vars
const loadingStates = ref({
  progress: false,
  stats: false
})

// 통계 데이터
// eslint-disable-next-line no-unused-vars
const teamStats = ref({})

// eslint-disable-next-line no-unused-vars
const workspaceStats = ref({})

// Template Ref 추가
const taskListRef = ref(null)

// 모달 상태
const showWorkspaceModal = ref(false)

// TeamList에서 전달받는 이벤트 핸들러들
// eslint-disable-next-line no-unused-vars
function handleTeamSelected(team) {
  selectedTeam.value = team
  
  // teamStore에도 선택된 팀 설정
  teamStore.setSelectedTeam(team)
  
  console.log('선택된 팀:', team)
  
  // 선택된 팀에 따라 다른 컴포넌트들 업데이트
  // 예: 해당 팀의 태스크 목록 로드, 멤버 목록 업데이트 등
}

// eslint-disable-next-line no-unused-vars
function handleTeamsUpdated(updatedTeams) {
  teams.value = updatedTeams
  console.log('팀 목록 업데이트됨:', updatedTeams)
  
  // 통계 데이터 업데이트
  workspaceStats.value.전체팀수 = updatedTeams.length
}

// 태스크 관련 이벤트 핸들러들
// eslint-disable-next-line no-unused-vars
async function handleTaskStatusChange(taskId, newStatus) {
  await taskStore.updateTaskStatus(taskId, newStatus)
}

// eslint-disable-next-line no-unused-vars
async function handleDeleteTask(taskId) {
  await taskStore.deleteTask(taskId)
}

// CreateTaskForm에서 오는 이벤트 핸들러
function handleTaskCreated(taskData) {
  console.log('DashBoard에서 받은 새 태스크:', taskData)
  
  // TaskList 컴포넌트의 메서드 직접 호출
  if (taskListRef.value) {
    taskListRef.value.fetchTaskList()
  }
  
  console.log('태스크가 성공적으로 생성되었습니다:', taskData.title)
}

function handleCreateTask(taskData) {
  console.log('DashBoard handleCreateTask 호출됨:', taskData)
}

// 통계 관련 이벤트 핸들러들
// eslint-disable-next-line no-unused-vars
function handleTeamDetails() {
  console.log('팀 상세 정보 보기')
  if(teamStore.selectedTeam){
    router.push(`/teamtasks`)
  }else{
    alert('팀이 선택되지 않았습니다.')
    return
  }
}

// eslint-disable-next-line no-unused-vars
function handleWorkspaceDetails() {
  console.log('작업공간 상세 정보 보기')
  showWorkspaceModal.value = true
}

function handleCloseWorkspaceModal() {
  showWorkspaceModal.value = false
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

/* 첫 행: UserTag */
.dashboard-grid > *:nth-child(1) {
  grid-column: 1 / -1;
  margin-bottom: 16px;
}

/* 중간 행: 팀 목록, 진행률 보드, 할 일 목록 */
.dashboard-grid > TeamList { grid-row: 2; grid-column: 1; }
.dashboard-grid > ProgressBoard { grid-row: 2; grid-column: 2; }
.dashboard-grid > TaskList { grid-row: 2; grid-column: 3; }

/* 하단 컨테이너: 전체 너비 차지 */
.bottom-container {
  grid-row: 3;
  grid-column: 1 / -1;
  display: flex;
  gap: 16px;
}

/* CreateTaskForm: 2/3 너비 */
.bottom-container > CreateTaskForm {
  flex: 1;
}

/* OverviewPanel: 1/3 너비 */
.bottom-container > OverviewPanel {
  flex: 1;
}
</style>