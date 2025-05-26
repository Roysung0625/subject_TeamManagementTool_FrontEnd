<template>
    <tr>
      <td class="member-name">{{ member.name }}</td>
      <td class="member-progress">
        <ProgressBar :progress="member.progress" />
        <span class="pct">{{ member.progress }}%</span>
      </td>
    </tr>
</template>
  
<script setup>
  import { defineProps } from 'vue'
  import ProgressBar from './ProgressBar.vue'
  const props = defineProps({ member: Object })
</script>
  
<style scoped>
  .member-name { padding: 6px 4px; width: 30%; }
  .member-progress { display: flex; align-items: center; gap: 8px; padding: 6px 4px; }
  .pct { width: 40px; text-align: right; font-size: 0.9rem; }
</style>