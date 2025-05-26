<template>
    <div class="bar">
      <div class="fill" :style="{ width: progress + '%' }"></div>
    </div>
</template>
  
<script setup>
  import { defineProps } from 'vue'
  const props = defineProps({ progress: Number })
</script>
  
<style scoped>
  .bar {
    background: #eee;
    height: 8px;
    border: 1px solid #000;
    border-radius: 4px;
    overflow: hidden;
  }
  .fill {
    background: #3b82f6;
    height: 100%;
  }
</style>