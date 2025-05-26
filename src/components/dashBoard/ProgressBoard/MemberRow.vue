<template lang="pug">
tr
  td.member-name {{ member.name }}
  td.member-progress
    ProgressBar(:progress="member.progress")
    span.percent {{ member.progress }}%
</template>

<script setup>
import { defineProps } from 'vue'
// eslint-disable-next-line no-unused-vars
import ProgressBar from './ProgressBar.vue'
import { useTaskStore } from '@/stores/task'

const taskStore = useTaskStore()
const memberTasks = computed(() => taskStore.getTasksByMemberId(member.id))


// props 정의
defineProps({
  member: {
    type: Object,
    required: true,
    validator: (member) => {
      return ['id', 'name', 'progress'].every(key => key in member)
    }
  }
})
</script>
  
<style scoped>
.member-name { 
  padding: 6px 4px; 
  width: 30%; 
}

.member-progress { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  padding: 6px 4px; 
}

.percent { 
  width: 40px; 
  text-align: right; 
  font-size: 0.9rem; 
  color: #666;
}
</style>