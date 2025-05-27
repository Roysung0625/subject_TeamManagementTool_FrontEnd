<template lang="pug">
  .modal-overlay(v-if="isVisible" @click="closeModal")
    .modal-content(@click.stop)
      .modal-header
        h2 作業詳細内容
      
      .modal-body
        .error(v-if="error") {{ error }}
        
        input(
          v-model="editableTask.title"
          placeholder="Task Title"
          :disabled="!isEditing"
        )
        
        input(
          type="datetime-local"
          v-model="editableTask.due"
          :disabled="!isEditing"
        )
        
        select(v-model="editableTask.status" :disabled="!isEditing")
          option(value="pending") 待機
          option(value="in_progress") 進行中
          option(value="completed") 完了
          option(value="cancelled") 取消
        
        input(
          v-model="editableTask.category"
          placeholder="Category (e.g., work, personal, urgent)"
          :disabled="!isEditing"
        )
        
        select(v-model="editableTask.employee_id" :disabled="!isEditing")
          option(value="" disabled) 担当者を選択してください
          option(
            v-for="member in teamMembers"
            :key="member.id"
            :value="member.id"
          ) {{ member.name }}
        
        textarea(
          v-model="editableTask.detail"
          placeholder="Task Details"
          :disabled="!isEditing"
        )
        
        .button-group
          button.btn.edit-btn(
            v-if="!isEditing"
            @click="toggleEdit"
          ) 作業修正
          
          button.btn.save-btn(
            v-if="isEditing"
            @click="handleSave"
            :disabled="isSaving"
          ) {{ isSaving ? 'Saving...' : 'Save Task' }}
          
          button.btn.cancel-btn(
            v-if="isEditing"
            @click="cancelEdit"
          ) キャンセル
          
          button.btn.delete-btn(
            @click="handleDelete"
            :disabled="isDeleting"
          ) {{ isDeleting ? 'Deleting...' : 'Delete Task' }}
          
          button.btn.close-btn(
            @click="closeModal"
          ) 閉じる

</template>
<script setup>
/* eslint-disable */

import { ref, watch, computed } from 'vue'
import { taskService } from '@/services/taskService'
import teamService from '@/services/teamService'
import { useTeamStore } from '@/stores/team'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  task: {
    type: Object,
    default: null
  },
  isVisible: {
    type: Boolean,
    default: false
  },
  currentUser: {
    type: Object,
    default: null
  },
  teamMembers: {
    type: Array,
    default: () => []
  }
})

const teamStore = useTeamStore()
const authStore = useAuthStore()
const emit = defineEmits(['close', 'task-updated', 'task-deleted'])

const error = ref(null)
const isEditing = ref(false)
const isSaving = ref(false)
const isUpdating = ref(false)
const isDeleting = ref(false)
const selectedTeam = computed(() => teamStore.selectedTeam)

const editableTask = ref({
  title: '',
  due: '',
  employee_id: null,
  status: 'pending',
  category: '',
  detail: ''
})

const originalTask = ref({})

// props.taskが変更されるたびにeditableTask更新
watch(() => props.task, (newTask) => {
  console.log('TaskModal - task変更:', newTask)
  if (newTask) {
    // due_atをdatetime-local形式に変換
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

// isVisible変更検知
watch(() => props.isVisible, (visible) => {
  console.log('TaskModal - isVisible変更:', visible)
  if (!visible) {
    isEditing.value = false
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
  if (!editableTask.value.title || !editableTask.value.due || !editableTask.value.employee_id) {
    error.value = 'すべての必須フィールドを入力してください。'
    return
  }

  isSaving.value = true
  error.value = null
  
  try {
    const formData = {
      ...editableTask.value,
      due: new Date(editableTask.value.due).toISOString()
    }
    
    const response = await taskService.updateTask(props.task.id, formData)
    
    emit('task-updated', response)
    isEditing.value = false
    originalTask.value = { ...editableTask.value }
    
    console.log('Task更新成功')
  } catch (apiError) {
    error.value = apiError.message || 'タスク修正中にエラーが発生しました。'
  } finally {
    isSaving.value = false
  }
}

async function handleComplete() {
  isUpdating.value = true
  error.value = null
  
  try {
    const formData = {
      ...editableTask.value,
      status: 'completed',
      due: new Date(editableTask.value.due).toISOString()
    }
    
    const response = await taskService.updateTask(props.task.id, formData)
    
    emit('task-updated', response)
    
    console.log('Task完了処理成功')
  } catch (apiError) {
    error.value = apiError.message || 'タスク完了処理中にエラーが発生しました。'
  } finally {
    isUpdating.value = false
  }
}

async function handleDelete() {
  if (!confirm('この作業を削除してもよろしいですか？')) {
    return
  }
  
  isDeleting.value = true
  error.value = null
  
  try {
    await taskService.deleteTask(props.task.id)
    
    emit('task-deleted', props.task.id)
    closeModal()
    
    console.log('Task削除成功')
  } catch (apiError) {
    error.value = apiError.message || 'タスク削除中にエラーが発生しました。'
  } finally {
    isDeleting.value = false
  }
}

function closeModal() {
  console.log('TaskModal closeModal呼び出し')
  if (isEditing.value) {
    if (confirm('編集中の内容があります。本当に閉じますか？')) {
      isEditing.value = false
      editableTask.value = { ...originalTask.value }
      emit('close')
    }
  } else {
    emit('close')
  }
}

function formatDate(dateString) {
  if (!dateString) return '設定されていません'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '不正な日付'
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  } catch (error) {
    return '不正な日付'
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: white;
  width: 500px;
  max-width: 90vw;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  background-color: #f3f4f6;
  padding: 16px;
  text-align: center;
  border-radius: 8px 8px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
}

.modal-body {
  padding: 20px;
}

/* CreateTaskFormと同じスタイル */
.modal-body input, 
.modal-body textarea,
.modal-body select { 
  width: 100%; 
  margin-bottom: 8px; 
  padding: 8px; 
  box-sizing: border-box; 
  border: 1px solid #ddd; 
  border-radius: 4px;
}

.modal-body textarea { 
  resize: vertical; 
  min-height: 80px; 
}

.error {
  background-color: #fee;
  color: #c33;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 8px;
  border: 1px solid #fcc;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.btn { 
  background: #3b82f6; 
  color: #fff; 
  border: none; 
  padding: 8px 16px; 
  cursor: pointer; 
  border-radius: 4px;
  transition: background-color 0.2s;
  flex: 1;
  min-width: 100px;
}

.btn:hover:not(:disabled) {
  background: #2563eb;
}

.btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.edit-btn {
  background: #10b981;
}

.edit-btn:hover:not(:disabled) {
  background: #059669;
}

.save-btn {
  background: #3b82f6;
}

.cancel-btn {
  background: #6b7280;
}

.cancel-btn:hover:not(:disabled) {
  background: #4b5563;
}

.complete-btn {
  background: #10b981;
}

.complete-btn:hover:not(:disabled) {
  background: #059669;
}

.delete-btn {
  background: #ef4444;
}

.delete-btn:hover:not(:disabled) {
  background: #dc2626;
}

.close-btn {
  background: #6b7280;
}

.close-btn:hover:not(:disabled) {
  background: #4b5563;
}
</style>