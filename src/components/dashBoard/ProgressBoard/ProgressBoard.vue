<template lang="pug">
.panel.progress-board
  .panel-header
    span {{ teamName || 'All' }} Progress
    .loading-indicator(v-if="loading") Loading...
  .panel-body
    table
      thead
        tr
          th Member
          th Progress
      tbody
        MemberRow(
          v-for="member in members"
          :key="member.id"
          :member="member"
        )
</template>

<script setup>
import { defineProps } from 'vue'
// eslint-disable-next-line no-unused-vars
import MemberRow from './MemberRow.vue'

// props 정의
defineProps({
  members: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  teamName: {
    type: String,
    default: null
  }
})
</script>

<style scoped>
.progress-board {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.loading-indicator {
  font-size: 0.9rem;
  color: #666;
}

.panel-body {
  padding: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 8px;
  border-bottom: 2px solid #eee;
  font-weight: 600;
  color: #374151;
}

th:last-child {
  text-align: right;
}
</style>