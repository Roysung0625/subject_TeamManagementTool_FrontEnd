<template>
    <div class="panel task-list">
      <div class="panel-header"><span>소속 팀 내 할일</span></div>
      <ul class="panel-body">
        <TaskItem v-for="t in tasks" :key="t.id" :task="t" />
      </ul>
    </div>
</template>
  
<script setup>
  import { defineProps, defineEmits } from 'vue'
  import TaskItem from './TaskItem.vue'
  
  const props = defineProps({ tasks: Array })
</script>
  
<style scoped>
  .panel-body { list-style: none; margin: 0; padding: 8px; }
</style>