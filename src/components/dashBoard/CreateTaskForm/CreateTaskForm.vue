<template lang="pug">
.panel.create-task
  .panel-header
    span Create Task
  .panel-body
    .error(v-if="error") {{ error }}
    input(
      v-model="form.title"
      placeholder="Task Title"
      :disabled="isCreating"
    )
    input(
      type="datetime-local"
      v-model="form.due"
      :disabled="isCreating"
    )
    select(v-model="form.employee_id" :disabled="currentMemberRole !== 'Admin' || isCreating")
      option(
        v-for="member in members"
        :key="member.id"
        :value="member.id"
      ) {{ member.name }}
    select(v-model="form.status" :disabled="isCreating")
      option(value="pending") 待機
      option(value="in_progress") 遂行中
      option(value="done") 完了
    input(
      v-model="form.category"
      placeholder="Category (e.g., work, personal, urgent)"
      :disabled="isCreating"
    )
    textarea(
      v-model="form.detail"
      placeholder="Task Details"
      :disabled="isCreating"
    )
    button.btn(
      @click="handleCreate"
      :disabled="isCreating"
    ) {{ isCreating ? 'Creating...' : 'Create Task' }}
</template>

<script setup>
/* eslint-disable */
import { reactive, defineProps, defineEmits, ref, watch, computed} from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTeamStore } from '@/stores/team'
import { taskService } from '@/services/taskService'
import {teamService} from '@/services/teamService'

// Props 정의
const props = defineProps({
  members: {
    type: Array,
    default: () => []
  },
  teams: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Events 정의
const emit = defineEmits(['create', 'task-created'])

const authStore = useAuthStore()
const teamStore = useTeamStore()

const currentMemberId = computed(() => authStore.userId)
const currentMemberRole = computed(() => authStore.userRole)
const currentMemberName = computed(() => authStore.userName)
const selectedTeam = computed(() => teamStore.selectedTeam)

const error = ref(null)
const isCreating = ref(false)
const members = ref([])

// console.log('currentMemberRole', currentMemberRole.value)
// console.log('currentSelectedTeam', currentSelectedTeam.value)
// console.log('members', members.value)

//ref와 같은 반응형 '객체', ref는 객체를 새로 할당하지만 reactive는 객체 안을 바꾸는 식 (가볍다)
const form = reactive({ 
  employee_id: null,
  title: '',
  status: 'pending',
  category: '',
  detail: '',
  due: ''
})

console.log('form after initialization', form)

async function createTask() {
  console.log('createTask in CreateTaskForm.vue 호출됨')
  console.log('form in CreateTaskForm.vue', form)
  
  // 필수 필드 검증
  if (!form.title || !form.due || !form.employee_id) {
    error.value = '모든 필수 필드를 입력해주세요.'
    return
  }

  // due 날짜를 ISO 형식으로 변환
  const formData = {
    ...form,
    due: new Date(form.due).toISOString()
  }
  
  isCreating.value = true
  error.value = null
  
  try {
    console.log('전송할 데이터:', formData)
    const response = await taskService.createTask(formData)
    console.log('태스크 생성 성공:', response)
    
    // 부모 컴포넌트에 태스크 생성 완료 이벤트 발생
    emit('task-created', response)
    emit('create', response)
    
    // 폼 초기화
    resetForm()
    
  } catch (apiError) {
    console.error('API 태스크 생성 실패:', apiError)
    error.value = apiError.message || '태스크 생성 중 오류가 발생했습니다.'
  } finally {
    isCreating.value = false
  }
}

function resetForm() {
  form.title = ''
  form.due = ''
  form.category = ''
  form.detail = ''
  form.status = 'pending'
  // employee_id는 watch에서 자동으로 설정되므로 건드리지 않음
}

function handleCreate() {
  if (!form.title || !form.due || !form.employee_id) {
    console.log('form validation failed:', {
      title: form.title,
      due: form.due,
      employee_id: form.employee_id
    })
    alert('Please fill in all required fields (Title, Due Date, Assignee)')
    return
  }

  createTask()
}

async function getTeamMembers() {
  if (!selectedTeam?.value?.id) {
    console.log('선택된 팀이 없습니다. in CreateTaskForm.vue')
    members.value = []
    return
  }

  try {
    console.log('selectedTeam.value.id in CreateTaskForm.vue', selectedTeam.value.id)
    const response = await teamService.getTeamMembers(selectedTeam.value.id)
    console.log('팀 멤버 목록: in CreateTaskForm.vue', response)
    members.value = response
  } catch (error) {
    console.error('팀 멤버 목록 가져오기 실패:', error)
    members.value = []
  }
}

// watch에서 immediate: true로 변경하여 초기 로드 시에도 실행
watch(selectedTeam, (newTeam) => {
  console.log('selectedTeam 변경됨:', newTeam)
  getTeamMembers()
}, { immediate: true })

</script>

<style scoped>
.create-task input, 
.create-task textarea,
.create-task select { 
  width: 100%; 
  margin-bottom: 8px; 
  padding: 8px; 
  box-sizing: border-box; 
  border: 1px solid #ddd; 
  border-radius: 4px;
}

.create-task textarea { 
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

.btn { 
  background: #3b82f6; 
  color: #fff; 
  border: none; 
  padding: 8px 16px; 
  cursor: pointer; 
  border-radius: 4px;
  width: 100%;
  transition: background-color 0.2s;
}

.btn:hover:not(:disabled) {
  background: #2563eb;
}

.btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>