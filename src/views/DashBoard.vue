<template lang="pug">
.dashboard-grid
  //- 상단 사용자 정보
  UserTag(
    :username="userStore.user.name"
    :role="userStore.user.role"
    :avatar="userStore.user.avatar"
  )

  //- 왼쪽: 팀 목록
  TeamList(
    :teams="teamStore.teams"
    :currentTeam="teamStore.selectedTeam"
    :loading="teamStore.loading"
    @add="handleAddTeam"
    @edit="handleEditTeam"
    @remove="handleDeleteTeam"
    @select="handleSelectTeam"
  )

  //- 중앙: 진행률 보드
  ProgressBoard(
    :members="memberList"
    :loading="loadingStates.progress"
    :teamName="teamStore.selectedTeam?.name"
  )

  //- 오른쪽: 할 일 목록
  TaskList(
    :tasks="taskStore.getFilteredTasks"
    :loading="taskStore.loading"
    :filter="taskStore.filter"
    @statusChange="handleTaskStatusChange"
    @delete="handleDeleteTask"
  )

  //- 하단: 2:1 비율 컨테이너
  .bottom-container
    CreateTaskForm(
      :members="memberList"
      :teams="teamStore.teams"
      :loading="taskStore.loading"
      @create="handleCreateTask"
    )
    OverviewPanel(
      :teamStats="teamStats"
      :workspaceStats="workspaceStats"
      :loading="loadingStates.stats"
      @team-details="handleTeamDetails"
      @workspace-details="handleWorkspaceDetails"
    )
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useTeamStore } from '@/stores/team'
import { useTaskStore } from '@/stores/task'
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

// Store 초기화
// eslint-disable-next-line no-unused-vars
const userStore = useUserStore()
const teamStore = useTeamStore()
const taskStore = useTaskStore()

// 멤버 관련 데이터
// eslint-disable-next-line no-unused-vars
const memberList = ref([
  { 
    id: 1, 
    name: '김철수', 
    progress: 75,
    role: '프론트엔드 개발자',
    tasks: ['UI 개발', 'API 연동']
  },
  { 
    id: 2, 
    name: '이영희', 
    progress: 40,
    role: '백엔드 개발자',
    tasks: ['API 개발']
  }
])

// 로딩 상태 관리
// eslint-disable-next-line no-unused-vars
const loadingStates = ref({
  progress: false,
  stats: false
})

// 통계 데이터
// eslint-disable-next-line no-unused-vars
const teamStats = ref({
  완료된할일: 15,
  진행중할일: 8,
  다가오는마감일: 3,
  평균진행률: 65
})

// eslint-disable-next-line no-unused-vars
const workspaceStats = ref({
  전체팀수: 5,
  전체멤버수: 25,
  진행중프로젝트: 8,
  월간진행률: 70
})

// 이벤트 핸들러 함수들
// eslint-disable-next-line no-unused-vars
async function handleAddTeam() {
  // TODO: 팀 추가 모달 열기
  console.log('팀 추가하기 클릭됨')
}

// eslint-disable-next-line no-unused-vars
async function handleEditTeam(team) {
  await teamStore.updateTeam(team.id, team)
}

// eslint-disable-next-line no-unused-vars
async function handleDeleteTeam(team) {
  await teamStore.deleteTeam(team.id)
}

// eslint-disable-next-line no-unused-vars
function handleSelectTeam(team) {
  teamStore.setSelectedTeam(team)
}

// eslint-disable-next-line no-unused-vars
async function handleTaskStatusChange(taskId, newStatus) {
  await taskStore.updateTaskStatus(taskId, newStatus)
}

// eslint-disable-next-line no-unused-vars
async function handleDeleteTask(taskId) {
  await taskStore.deleteTask(taskId)
}

// eslint-disable-next-line no-unused-vars
async function handleCreateTask(newTask) {
  await taskStore.addTask(newTask)
}

// eslint-disable-next-line no-unused-vars
function handleTeamDetails() {
  console.log('팀 상세 정보 보기')
}

// eslint-disable-next-line no-unused-vars
function handleWorkspaceDetails() {
  console.log('작업공간 상세 정보 보기')
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
  flex: 2;
}

/* OverviewPanel: 1/3 너비 */
.bottom-container > OverviewPanel {
  flex: 1;
}
</style>