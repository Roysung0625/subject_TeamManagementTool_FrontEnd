<template lang="pug">
.user-tag
  .user-info
    span.name {{ props.username }}
    span.role {{ props.role}}
  .user-actions
    button.logout-btn(@click="handleLogout") Logout
</template>

<script setup>
/* eslint-disable */
import { defineProps } from 'vue' 
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'

const router = useRouter()

const props = defineProps({
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
console.log('in UserTag.vue props : ', props.username, props.role)

async function handleLogout() {
  console.log('Logout clicked')
  authService.logout()
  router.push('/login')
}
</script>

<style scoped>
.user-tag {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
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
  flex: 1;
}

.name {
  font-weight: 600;
  color: #1f2937;
}

.role {
  font-size: 0.9rem;
  color: #6b7280;
}

.user-actions {
  margin-left: auto;
}

.logout-btn {
  padding: 6px 12px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #dc2626;
}
</style>