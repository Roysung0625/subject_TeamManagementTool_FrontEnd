<template>
  <div class="dashboard-grid">
    <UserTag :username="username" />

    <TeamList :teams="teams"
              @add="openAddModal"
              @edit="openEditModal"
              @remove="deleteTeam" />

    <ProgressBoard :members="members" />
    <TaskList :tasks="tasks" />

    <CreateTaskForm @create="createTask" />
    <OverviewPanel @team-details="viewTeamDetails"
                   @workspace-details="viewWorkspaceDetails" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TeamList from '@/components/TeamList/TeamList.vue'
import ProgressBoard from '@/components/ProgressBoard/ProgressBoard.vue'
import TaskList from '@/components/TaskList/TaskList.vue'
import CreateTaskForm from '@/components/CreateTaskForm/CreateTaskForm.vue'
import OverviewPanel from '@/components/OverviewPanel/OverviewPanel.vue'
import UserTag from '@/components/UserTag.vue'

const username = ref('유저명')
const teams = ref([{ id: 1, name: '팀 A' }, { id: 2, name: '팀 B' }])
const members = ref([{ id: 1, name: '홍길동', progress: 75 }, { id: 2, name: '김철수', progress: 40 }])
const tasks = ref([{ id: 1, title: 'API 개발', due: '2025-05-20' }, { id: 2, title: 'UI 디자인', due: '2025-05-21' }])

function openAddModal() { /* ... */ }
function openEditModal(team) { /* ... */ }
function deleteTeam(team) { /* ... */ }
function createTask(task) { /* ... */ }
function viewTeamDetails() { /* ... */ }
function viewWorkspaceDetails() { /* ... */ }
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: 240px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  padding: 16px;
  position: relative;
  height: 100vh;
  box-sizing: border-box;
}
/* 첫 행: user-tag 절대 위치, 다른 컴포넌트는 grid 배치 */
.dashboard-grid > *:nth-child(1) { grid-column: 1 / -1; }
.dashboard-grid > UserTag { z-index: 10; }
/* 상단 열 */
.dashboard-grid > TeamList { grid-row: 2; grid-column: 1; }
.dashboard-grid > ProgressBoard { grid-row: 2; grid-column: 2; }
.dashboard-grid > TaskList { grid-row: 2; grid-column: 3; }
/* 하단 열 */
.dashboard-grid > CreateTaskForm { grid-row: 3; grid-column: 1 / 3; }
.dashboard-grid > OverviewPanel { grid-row: 3; grid-column: 3; }
</style>