<template lang="pug">
.user-tag
  .user-info
    span.name {{ username }}
    span.role {{ role }}
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  username: {
    type: String,
    required: true,
    default: 'No Name'
  },
  role: {
    type: String,
    required: true,
    default: 'No Role'
  }
})
</script>

<style scoped>
.user-tag {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.name {
  font-weight: 600;
  color: #1f2937;
}

.role {
  font-size: 0.9rem;
  color: #6b7280;
}
</style>