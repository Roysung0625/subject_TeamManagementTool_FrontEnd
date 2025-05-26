<template>
    <li class="task-item">
      <span class="task-title">{{ task.title }}</span>
      <span class="task-date">{{ task.due }}</span>
    </li>
</template>
  
<script setup>
  import { defineProps } from 'vue'
  const props = defineProps({ task: Object })
</script>
  
<style scoped>
  .task-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 0.95rem; }
  .task-date { font-size: 0.85rem; color: #555; }
</style>