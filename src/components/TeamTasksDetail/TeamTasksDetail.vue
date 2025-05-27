<template lang="pug">
    .team-details-container
      .header-section
        .filter-section
          .filter-group
            label 担当者フィルター
            select(v-model="selectedEmployee" :disabled="disableFilter" @change="applyEmployeeFilter")
              option(value="") 全担当者
              option(
                v-for="member in teamMembers"
                :key="member.id"
                :value="member.id"
              ) {{ member.name }}
          
          .filter-group
            label カテゴリ検索
            .search-container
              input(
                v-model="selectedCategory"
                :disabled="disableFilter"
                type="text"
                placeholder="カテゴリ検索"
              )
              button.search-btn(@click="applyCategorySearch" :disabled="disableFilter") 検索
          .filter-group
            
          
          .filter-group
            label ステータスフィルター
            select(v-model="selectedStatus" :disabled="disableFilter" @change="applyStatusFilter")
              option(value="") 全ステータス
              option(value="pending") 待機
              option(value="in_progress") 進行中
              option(value="done") 完了
          
          .filter-actions
            button.reset-btn(@click="resetFilters") フィルター初期化

        .team-info-section
          h2.team-name {{ `チーム名: ${selectedTeam?.name}` || 'チームが選択されていません' }}
        .close-section
          button.close-btn(@click="goToDashboard") ダッシュボードに戻る
      
      .content-section
        .table-container
          table.details-table
            thead
              tr
                th ステータス
                th カテゴリ
                th タイトル
                th 詳細内容
                th 期限
                th 担当者
            tbody
              TeamTaskItem(
                v-for="task in teamTasks"
                :key="task.id"
                :task="task"
                :team-members="teamMembers"
                @click="openTaskModal"
              )
              
              // ページ移動ボタン行
              tr.pagination-row
                td(colspan="6")
                  .pagination-controls
                    button.page-btn(:disabled="currentPage <= 1" @click="previousPage") ◀ 前へ
                    span.page-info {{ currentPage }} / {{ totalPages }}
                    button.page-btn(:disabled="currentPage >= totalPages" @click="nextPage") 次へ ▶

    // TaskModal 追加
    TeamTaskModal(
      :task="selectedTask"
      :is-visible="isModalVisible"
      :team-members="teamMembers"
      :team-name="selectedTeam?.name || ''"
      @close="closeTaskModal"
      @task-updated="handleTaskUpdated"
      @task-deleted="handleTaskDeleted"
    )
</template>

<script setup>
/* eslint-disable */

import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { taskService } from '@/services/taskService'
import { teamService } from '@/services/teamService'
import TeamTaskItem from './TeamTaskItem.vue'
import TeamTaskModal from './TeamTaskModal.vue'

import { useTeamStore } from '@/stores/team'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const teamStore = useTeamStore()
const authStore = useAuthStore()

const selectedTeam = computed(() => teamStore.selectedTeam)
const currentUser = computed(() => authStore.user)

const teamTasks = ref([])
const teamMembers = ref([])
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(30)

// フィルター関連
const selectedEmployee = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const categorySearched = ref(false)

// TaskModal関連
const selectedTask = ref(null)
const isModalVisible = ref(false)


// ページネーション（フィルタリングされた結果基準）
const totalPages = computed(() => {
    return Math.ceil(teamTasks.value.length / itemsPerPage.value)
})

const disableFilter = computed(() => {
  let result = !!(selectedEmployee.value || categorySearched.value || selectedStatus.value)
  console.log("disableFilter computed", result)
  return result
})

function applySearch() {
    categorySearched.value = true
}
watch(currentPage, (newPage) => {
    console.log("currentPage changed to", newPage)
    fetchTeamDetails()
})

async function fetchTeamDetails() {
    if (!selectedTeam.value?.id) return
    
    const option = {
        offset : (currentPage.value - 1) * itemsPerPage.value
        , limit : itemsPerPage.value}

    loading.value = true

    try {
        // チームタスクリスト取得
        const tasks = await taskService.getTeamTasks(selectedTeam.value.id, option)
        teamTasks.value = Array.isArray(tasks) ? tasks : []

        // チームメンバーリスト取得
        const members = await teamService.getTeamMembers(selectedTeam.value.id)
        teamMembers.value = Array.isArray(members) ? members : []

    } catch (error) {
        console.error('チーム詳細情報読み込み失敗:', error)
        teamTasks.value = []
        teamMembers.value = []
    } finally {
        loading.value = false
    }
}

async function applyEmployeeFilter() {
    currentPage.value = 1
    const option = {employee_id: selectedEmployee.value
        , offset : (currentPage.value - 1) * itemsPerPage.value
        , limit : itemsPerPage.value}
    try{
        const tasks = await taskService.getTeamTasks(selectedTeam.value.id, option)
        console.log("tasks", tasks)
        teamTasks.value = Array.isArray(tasks) ? tasks : []
    } catch (error) {
        console.error('チーム詳細情報読み込み失敗:', error)
        teamTasks.value = []
    } finally {
        loading.value = false
    }
}

async function applyStatusFilter() {
    currentPage.value = 1
    const option = {status: selectedStatus.value
        , offset : (currentPage.value - 1) * itemsPerPage.value
        , limit : itemsPerPage.value}
    try{
        const tasks = await taskService.getTeamTasks(selectedTeam.value.id, option)
        console.log("tasks", tasks)
        teamTasks.value = Array.isArray(tasks) ? tasks : []
    } catch (error) {
        console.error('チーム詳細情報読み込み失敗:', error)
        teamTasks.value = []
    } finally {
        loading.value = false
    }
}

async function applyCategorySearch() {
    currentPage.value = 1
    const option = {category: selectedCategory.value
        , offset : (currentPage.value - 1) * itemsPerPage.value
        , limit : itemsPerPage.value}
    try{
        const tasks = await taskService.getTeamTasks(selectedTeam.value.id, option)
        console.log("tasks", tasks)
        teamTasks.value = Array.isArray(tasks) ? tasks : []
    } catch (error) {
        console.error('チーム詳細情報読み込み失敗:', error)
        teamTasks.value = []
    } finally {
        loading.value = false
    }
}

function resetFilters() {
    selectedEmployee.value = ''
    selectedCategory.value = ''
    selectedStatus.value = ''
    categorySearched.value = false
    currentPage.value = 1
    fetchTeamDetails()
}

function goToDashboard() {
    router.push('/dashboard')
}

function previousPage() {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

function nextPage() {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

// TaskModal関連関数
function openTaskModal(task) {
    selectedTask.value = task
    isModalVisible.value = true
}

function closeTaskModal() {
    isModalVisible.value = false
    selectedTask.value = null
}

function handleTaskUpdated(updatedTask) {
    const index = teamTasks.value.findIndex(task => task.id === updatedTask.id)
    if (index !== -1) {
        teamTasks.value[index] = updatedTask
    }
}

function handleTaskDeleted(taskId) {
    // 削除されたものを除いて再読み込み
    teamTasks.value = teamTasks.value.filter(task => task.id !== taskId)
}

onMounted(() => {
    fetchTeamDetails()
})

// teamTasks変更検知
watch(teamTasks, (newTasks) => {
    console.log("teamTasks変更:", newTasks.length, "個の項目")
}, { deep: true })

</script>

<style scoped>
.team-details-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: white;
    z-index: 1000;
    display: flex;
    flex-direction: column;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    border-bottom: 2px solid #000;
    background-color: #f5f5f5;
}

.filter-section {
    display: flex;
    gap: 16px;
    align-items: center;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.filter-group label {
    font-size: 12px;
    font-weight: bold;
    color: #333;
}

.filter-group select {
    padding: 6px 8px;
    border: 1px solid #000;
    background-color: white;
    font-size: 12px;
    min-width: 120px;
}

.filter-group select:focus {
    outline: none;
    border-color: #007bff;
}

.filter-actions {
    display: flex;
    align-items: flex-end;
}

.reset-btn {
    padding: 6px 12px;
    border: 1px solid #000;
    background-color: #f8f9fa;
    cursor: pointer;
    font-size: 12px;
}

.reset-btn:hover {
    background-color: #e9ecef;
}

.team-info-section {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
}

.team-name {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    background-color: #e8f4f8;
    padding: 8px 16px;
    border: 2px solid #000;
    border-radius: 4px;
}

.close-section {
    padding-right: 20px;
}

.close-btn {
    padding: 8px 20px;
    border: 1px solid #000;
    background-color: #f0f0f0;
    cursor: pointer;
    font-size: 14px;
}

.close-btn:hover {
    background-color: #e5e5e5;
}

.content-section {
    flex: 1;
    padding: 20px;
    overflow: auto;
}

.table-container {
    width: 100%;
    border: 2px solid #000;
}

.details-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

.details-table th {
    background-color: #e0e0e0;
    border: 1px solid #000;
    padding: 8px;
    text-align: center;
    font-weight: bold;
}

.details-table td {
    border: 1px solid #000;
    padding: 8px;
    text-align: center;
    background-color: white;
}

.status-cell {
    font-weight: bold;
}

.status-pending {
    background-color: #fff3cd !important;
    color: #856404;
}

.status-in_progress {
    background-color: #d1ecf1 !important;
    color: #0c5460;
}

.status-completed {
    background-color: #d4edda !important;
    color: #155724;
}

.status-cancelled {
    background-color: #f8d7da !important;
    color: #721c24;
}

.detail-cell {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* テーブル行ホバー効果 */
.details-table tbody tr:hover {
    background-color: #f8f9fa;
}

/* 空行スタイル */
.details-table tbody tr:has(td:first-child:empty) {
    height: 35px;
}

.details-table tbody tr:has(td:first-child:empty):hover {
    background-color: white;
}

.pagination-row td {
    border: 1px solid #000;
    padding: 8px;
    text-align: center;
    background-color: #f8f9fa;
}

.pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.page-btn {
    padding: 5px 10px;
    border: 1px solid #000;
    background-color: #e0e0e0;
    cursor: pointer;
    font-size: 12px;
}

.page-btn:hover:not(:disabled) {
    background-color: #d0d0d0;
}

.page-btn:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
    opacity: 0.6;
}

.page-info {
    font-size: 12px;
    font-weight: bold;
}
</style>