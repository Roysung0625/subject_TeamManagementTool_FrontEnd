<template lang="pug">
.panel.create-task
  .panel-header
    span Create Task
  .panel-body
    input(
      v-model="form.title"
      placeholder="Task Title"
    )
    input(
      type="date"
      v-model="form.due"
    )
    select(v-model="form.assignee")
      option(value="") Select Assignee
      option(
        v-for="member in members"
        :key="member.id"
        :value="member.name"
      ) {{ member.name }}
    select(v-model="form.priority")
      option(value="") Select Priority
      option(value="high") High
      option(value="medium") Medium
      option(value="low") Low
    textarea(
      v-model="form.description"
      placeholder="Description"
    )
    button.btn(
      @click="handleCreate"
      :disabled="loading"
    ) {{ loading ? 'Creating...' : 'Create' }}
</template>

<script setup>
import { reactive, defineProps, defineEmits } from 'vue'

// eslint-disable-next-line no-unused-vars
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

const emit = defineEmits(['create'])

const form = reactive({ 
  title: '', 
  due: '', 
  description: '',
  assignee: '',
  priority: '',
  status: 'todo'
})

// eslint-disable-next-line no-unused-vars
function handleCreate() {
  if (!form.title || !form.due || !form.assignee || !form.priority) {
    alert('Please fill in all required fields')
    return
  }
  
  emit('create', { ...form })
  
  // Reset form
  form.title = ''
  form.due = ''
  form.description = ''
  form.assignee = ''
  form.priority = ''
}
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