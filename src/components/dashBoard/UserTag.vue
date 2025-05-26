<template>
    <div class="user-tag">{{ username }}</div>
</template>
  
<script setup>
  import { defineProps } from 'vue'
  const props = defineProps({ username: String })
</script>
  
<style scoped>
  .user-tag {
    position: absolute;
    top: 16px;
    right: 16px;
    background: #d9d9d9;
    padding: 4px 12px;
    border: 1px solid #000;
    border-radius: 4px;
    font-size: 1rem;
  }
</style>