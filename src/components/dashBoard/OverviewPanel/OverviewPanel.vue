<template lang="pug">
.panel.overview
  .panel-header
    span Overview Panel
  .panel-body.overview-body
    button.btn.full(
      @click="$emit('team-details')"
    ) Team Details
    button.btn.full(
      @click="$emit('workspace-details')"
    ) Workspace Details
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  teamStats: {
    type: Object,
    default: () => ({})
  },
  workspaceStats: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['team-details', 'workspace-details'])
</script>

<style scoped>
.overview-body { 
  display: flex; 
  flex-direction: column; 
  gap: 8px; 
}

.btn.full { 
  width: 150%; 
  text-align: center; 
  padding: 12px 20px;
  font-size: 14px;
  min-height: 44px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn.full:hover {
  background-color: #2563eb;
}

.btn.small {
  padding: 6px 12px;
  font-size: 12px;
  min-height: 32px;
}

.btn.large {
  padding: 16px 24px;
  font-size: 16px;
  min-height: 52px;
}

.btn.extra-large {
  padding: 20px 32px;
  font-size: 18px;
  min-height: 60px;
}
</style>