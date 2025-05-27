<template lang="pug">
  .modal-overlay(v-if="isVisible" @click="closeModal")
    .modal-content(@click.stop)
      .modal-header
        h2 팀 목록 관리 상세
        .search-section
          input.search-input(
            v-model="addMemberListString"
            placeholder="추가할 팀원의 사번 ,로 구분"
          )
          button.search-btn(@click="handleAddMember") 추가
        .action-section
          button.delete-btn(
            @click="handleDeleteMembers"
            :disabled="selectedTeamMember.length === 0 || isDeleting"
          ) {{ isDeleting ? '삭제 중...' : '선택된 팀원 삭제' }}
      
      .modal-body
        .error(v-if="error") {{ error }}
        .loading(v-if="loading") 팀 목록을 불러오는 중...
        
        .table-container(v-else)
          table.teams-table
            thead
              tr
                th
                th 사번
                th 이름
            tbody
              tr(
                v-for="member in teamMembers"
                :key="member.id"
                :class="{ selected: selectedTeamMember.includes(member.id) }"
              )
                td
                  input(
                    type="checkbox"
                    :value="member.id"
                    v-model="selectedTeamMember"
                  )
                td {{ member.id }}
                td {{ member.name }}
        
        .button-group
          button.btn.close-btn(@click="closeModal") 닫기
</template>

<script setup>
/* eslint-disable */

import { ref, computed, watch } from 'vue'
import { useTeamStore } from '@/stores/team'
import { teamService } from '@/services/teamService'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const teamStore = useTeamStore()
const error = ref(null)
const addMemberListString = ref('')
const addMemberList = ref('')

// 팀 목록 가져오기
const selectedTeam = computed(() => teamStore.selectedTeam)
const teamMembers = ref([])
const currentTeamMembers = ref([])
const selectedTeamMember = ref([])
const isDeleting = ref(false)

// 모달이 열릴 때마다 초기화
watch(() => props.isVisible, (visible) => {
  if (visible) {
    error.value = null
    // 팀 목록 새로고침
    fetchTeamMembers()
  }
})

//팀 새로고침
watch(() => teamMembers, () => {
  currentTeamMembers.value = teamMembers.value.map(member => member.id)
  console.log('currentTeamMembers', currentTeamMembers.value)
})

//선택된 팀 목록
watch(() => selectedTeamMember.value, () => {
  console.log('selectedTeamMember', selectedTeamMember.value)
})

async function fetchTeamMembers() {
  const numericNum = Number(selectedTeam.value.id)
  try{
    teamMembers.value = await teamService.getTeamMembers(numericNum)
    console.log('teamMembers', teamMembers.value)
    currentTeamMembers.value = teamMembers.value.map(member => member.id)
    return teamMembers
  }catch(error){
    console.error('팀 멤버 조회 실패:', error)
    teamMembers.value = []
  }
}

async function handleAddMember() {
  addMemberList.value = [...currentTeamMembers.value, ...addMemberListString.value.split(',')]
  console.log('addMemberList', addMemberList.value)
  try{
    const response = await teamService.manageTeamMembers(selectedTeam.value.id, { employees : addMemberList.value })
    teamMembers.value = response
  }catch(error){
    console.error('팀 멤버 추가 실패:', error)
  }
  addMemberListString.value = ''
}

async function handleDeleteMembers() {
  //선택된 팀원 제외한 팀원 목록
  const remainMemberList = currentTeamMembers.value.filter(member => !selectedTeamMember.value.includes(member))
  try{
    const response = await teamService.manageTeamMembers(selectedTeam.value.id, { employees : remainMemberList })
    teamMembers.value = response
  }catch(error){
    console.error('팀 멤버 삭제 실패:', error)
  }
}

function closeModal() {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: white;
  width: 600px;
  max-width: 95vw;
  max-height: 90vh;
  border: 2px solid #000;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
}

.modal-header {
  background-color: #f0f0f0;
  padding: 16px 20px;
  border-bottom: 2px solid #000;
}

.modal-header h2 {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: bold;
}

.search-section {
  display: flex;
  gap: 8px;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #000;
  font-size: 14px;
}

.search-btn {
  background: #e0e0e0;
  color: #000;
  border: 1px solid #000;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
}

.search-btn:hover {
  background: #d0d0d0;
}

.modal-body {
  padding: 20px;
}

.error {
  background-color: #fee;
  color: #c33;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #fcc;
  font-size: 14px;
}

.table-container {
  border: 2px solid #000;
  margin-bottom: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.teams-table {
  width: 100%;
  border-collapse: collapse;
}

.teams-table th,
.teams-table td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid #ccc;
}

.teams-table th {
  background-color: #f0f0f0;
  font-weight: bold;
  border-bottom: 2px solid #000;
  position: sticky;
  top: 0;
}

.teams-table th:first-child,
.teams-table td:first-child {
  width: 40px;
  text-align: center;
}

.teams-table th:nth-child(2),
.teams-table td:nth-child(2) {
  width: 80px;
}

.teams-table tbody tr:hover {
  background-color: #f9f9f9;
}

.teams-table tbody tr.selected {
  background-color: #e3f2fd;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn {
  background: #e0e0e0;
  color: #000;
  border: 1px solid #000;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn:hover {
  background: #d0d0d0;
}

.close-btn {
  background: #e2e3e5;
  color: #383d41;
}

.close-btn:hover {
  background: #d6d8db;
}
</style> 