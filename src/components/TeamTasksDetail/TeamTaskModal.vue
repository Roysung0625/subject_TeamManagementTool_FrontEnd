<template lang="pug">
  .modal-overlay(v-if="isVisible" @click="closeModal")
    .modal-content(@click.stop)
      .modal-header
        h2 팀 작업 상세내용
        .team-info
          span.team-name {{`팀 이름: ${teamName}`}}
      
      .modal-body
        .error(v-if="error") {{ error }}
        
        .form-group
          label 작업 제목
          input(
            v-model="editableTask.title"
            placeholder="작업 제목을 입력하세요"
            :disabled="!isEditing"
          )
        
        .form-group
          label 마감일
          input(
            type="datetime-local"
            v-model="editableTask.due"
            :disabled="!isEditing"
          )
        
        .form-group
          label 상태
          select(v-model="editableTask.status" :disabled="!isEditing")
            option(value="pending") 대기
            option(value="in_progress") 진행중
            option(value="completed") 완료
            option(value="cancelled") 취소
        
        .form-group
          label 카테고리
          input(
            v-model="editableTask.category"
            placeholder="카테고리 (예: 개발, 디자인, 기획)"
            :disabled="!isEditing"
          )
        
        .form-group
          label 담당자
          select(v-model="editableTask.employee_id" :disabled="!isEditing")
            option(value="" disabled) 담당자를 선택하세요
            option(
              v-for="member in teamMembers"
              :key="member.id"
              :value="member.id"
            ) {{ member.name }} ({{ member.role || 'Employee' }})
        
        .form-group
          label 작업 상세내용
          textarea(
            v-model="editableTask.detail"
            placeholder="작업에 대한 상세한 설명을 입력하세요"
            :disabled="!isEditing"
            rows="4"
          )
        
        .button-group
          button.btn.edit-btn(
            v-if="!isEditing"
            @click="toggleEdit"
          ) 작업 수정
          
          button.btn.save-btn(
            v-if="isEditing"
            @click="handleSave"
            :disabled="isSaving"
          ) {{ isSaving ? '저장 중...' : '저장' }}
          
          button.btn.cancel-btn(
            v-if="isEditing"
            @click="cancelEdit"
          ) 취소
          
          button.btn.delete-btn(
            @click="handleDelete"
            :disabled="isDeleting"
          ) {{ isDeleting ? '삭제 중...' : '삭제' }}
          
          button.btn.close-btn(
            @click="closeModal"
          ) 닫기
</template>

<script setup>
/* eslint-disable */

import { ref, watch, computed } from 'vue'
import { taskService } from '@/services/taskService'

const props = defineProps({
  task: {
    type: Object,
    default: null
  },
  isVisible: {
    type: Boolean,
    default: false
  },
  teamMembers: {
    type: Array,
    default: () => []
  },
  teamName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'task-updated', 'task-deleted'])

const error = ref(null)
const isEditing = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)

const editableTask = ref({
  title: '',
  due: '',
  employee_id: null,
  status: 'pending',
  category: '',
  detail: ''
})

const originalTask = ref({})

// props.task가 변경될 때마다 editableTask 업데이트
watch(() => props.task, (newTask) => {
  console.log('TeamTaskModal - task 변경:', newTask)
  if (newTask) {
    // due_at을 datetime-local 형식으로 변환
    const dueValue = newTask.due_at ? 
      new Date(newTask.due_at).toISOString().slice(0, 16) : ''
    
    editableTask.value = {
      title: newTask.title || '',
      due: dueValue,
      employee_id: newTask.employee_id || null,
      status: newTask.status || 'pending',
      category: newTask.category || '',
      detail: newTask.detail || ''
    }
    originalTask.value = { ...editableTask.value }
  }
}, { immediate: true })

// isVisible 변경 감지
watch(() => props.isVisible, (visible) => {
  console.log('TeamTaskModal - isVisible 변경:', visible)
  if (!visible) {
    isEditing.value = false
    error.value = null
  }
}, { immediate: true })

function toggleEdit() {
  isEditing.value = true
  error.value = null
}

function cancelEdit() {
  isEditing.value = false
  editableTask.value = { ...originalTask.value }
  error.value = null
}

async function handleSave() {
  if (!editableTask.value.title.trim()) {
    error.value = '작업 제목을 입력해주세요.'
    return
  }
  
  if (!editableTask.value.due) {
    error.value = '마감일을 설정해주세요.'
    return
  }
  
  if (!editableTask.value.employee_id) {
    error.value = '담당자를 선택해주세요.'
    return
  }

  isSaving.value = true
  error.value = null
  
  try {
    const formData = {
      ...editableTask.value,
      due_at: new Date(editableTask.value.due).toISOString(),
      title: editableTask.value.title.trim(),
      category: editableTask.value.category.trim(),
      detail: editableTask.value.detail.trim()
    }
    
    const response = await taskService.updateTask(props.task.id, formData)
    
    emit('task-updated', response)
    isEditing.value = false
    originalTask.value = { ...editableTask.value }
    
    console.log('팀 태스크 업데이트 성공')
  } catch (apiError) {
    console.error('팀 태스크 업데이트 실패:', apiError)
    error.value = apiError.message || '태스크 수정 중 오류가 발생했습니다.'
  } finally {
    isSaving.value = false
  }
}

async function handleDelete() {
  if (!confirm('정말로 이 작업을 삭제하시겠습니까?\n삭제된 작업은 복구할 수 없습니다.')) {
    return
  }
  
  isDeleting.value = true
  error.value = null
  
  try {
    await taskService.deleteTask(props.task.id)
    
    emit('task-deleted', props.task.id)
    closeModal()
    
    console.log('팀 태스크 삭제 성공')
  } catch (apiError) {
    console.error('팀 태스크 삭제 실패:', apiError)
    error.value = apiError.message || '태스크 삭제 중 오류가 발생했습니다.'
  } finally {
    isDeleting.value = false
  }
}

function closeModal() {
  console.log('TeamTaskModal closeModal 호출')
  if (isEditing.value) {
    if (confirm('편집 중인 내용이 있습니다. 정말로 닫으시겠습니까?')) {
      isEditing.value = false
      editableTask.value = { ...originalTask.value }
      error.value = null
      emit('close')
    }
  } else {
    emit('close')
  }
}

function formatDate(dateString) {
  if (!dateString) return '설정되지 않음'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '잘못된 날짜'
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  } catch (error) {
    return '잘못된 날짜'
  }
}

function getAssigneeName(employeeId) {
  const member = props.teamMembers.find(m => m.id === employeeId)
  return member ? `${member.name} (${member.role || '직원'})` : '미지정'
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
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: bold;
}

.team-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.team-name {
  background-color: #e0e0e0;
  padding: 4px 8px;
  border: 1px solid #000;
  font-size: 12px;
  font-weight: bold;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: bold;
  font-size: 14px;
}

.form-group input, 
.form-group textarea,
.form-group select { 
  width: 100%; 
  padding: 8px; 
  box-sizing: border-box; 
  border: 1px solid #000; 
  font-size: 14px;
}

.form-group textarea { 
  resize: vertical; 
  min-height: 80px; 
  font-family: inherit;
}

.form-group input:disabled,
.form-group textarea:disabled,
.form-group select:disabled {
  background-color: #f5f5f5;
  color: #666;
}

.error {
  background-color: #fee;
  color: #c33;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #fcc;
  font-size: 14px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}

.btn { 
  background: #e0e0e0; 
  color: #000; 
  border: 1px solid #000; 
  padding: 8px 16px; 
  cursor: pointer; 
  font-size: 14px;
  transition: background-color 0.2s;
  flex: 1;
  min-width: 100px;
}

.btn:hover:not(:disabled) {
  background: #d0d0d0;
}

.btn:disabled {
  background: #f0f0f0;
  cursor: not-allowed;
  opacity: 0.6;
}

.edit-btn {
  background: #d4edda;
  color: #155724;
}

.edit-btn:hover:not(:disabled) {
  background: #c3e6cb;
}

.save-btn {
  background: #cce5ff;
  color: #004085;
}

.save-btn:hover:not(:disabled) {
  background: #b3d9ff;
}

.cancel-btn {
  background: #f8d7da;
  color: #721c24;
}

.cancel-btn:hover:not(:disabled) {
  background: #f1b0b7;
}

.delete-btn {
  background: #f8d7da;
  color: #721c24;
}

.delete-btn:hover:not(:disabled) {
  background: #f1b0b7;
}

.close-btn {
  background: #e2e3e5;
  color: #383d41;
}

.close-btn:hover:not(:disabled) {
  background: #d6d8db;
}
</style> 