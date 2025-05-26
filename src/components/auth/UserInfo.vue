<template lang="pug">
.user-info(v-if="user")
  .user-header
    h3 {{ title }}
    .user-avatar(v-if="showAvatar")
      span {{ userInitials }}
  
  .user-details
    .user-field(v-if="user.name")
      .field-label 사용자
      .field-value {{ user.name }}
    
    .user-field(v-if="user.email")
      .field-label 이메일
      .field-value {{ user.email }}
    
    .user-field(v-if="user.role")
      .field-label 역할
      .field-value
        .role-badge(:class="roleClass") {{ user.role }}
    
    .user-field(v-if="user.department")
      .field-label 부서
      .field-value {{ user.department }}
    
    .user-field(v-if="user.position")
      .field-label 직책
      .field-value {{ user.position }}
  
  .user-actions(v-if="showActions")
    slot(name="actions")
      BaseButton(
        variant="danger"
        size="small"
        @click="$emit('logout')"
      ) 로그아웃
</template>

<script setup>
import { computed } from 'vue'
// eslint-disable-next-line no-unused-vars
import BaseButton from '@/components/common/BaseButton.vue'

// eslint-disable-next-line no-undef
const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    default: '로그인 정보'
  },
  showAvatar: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

// eslint-disable-next-line no-undef
defineEmits(['logout'])

// 사용자 이니셜 계산
// eslint-disable-next-line no-unused-vars
const userInitials = computed(() => {
  if (!props.user?.name) return '?'
  return props.user.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// 역할에 따른 CSS 클래스
// eslint-disable-next-line no-unused-vars
const roleClass = computed(() => {
  const role = props.user?.role?.toLowerCase()
  switch (role) {
    case 'admin':
      return 'role-admin'
    case 'manager':
      return 'role-manager'
    case 'employee':
      return 'role-employee'
    default:
      return 'role-default'
  }
})
</script>

<style scoped>
.user-info {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.user-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.user-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.user-details {
  margin-bottom: 20px;
}

.user-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.user-field:last-child {
  border-bottom: none;
}

.field-label {
  font-weight: 500;
  color: #666;
  min-width: 60px;
}

.field-value {
  color: #333;
  text-align: right;
}

.role-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.role-admin {
  background-color: #dc3545;
  color: white;
}

.role-manager {
  background-color: #ffc107;
  color: #212529;
}

.role-employee {
  background-color: #28a745;
  color: white;
}

.role-default {
  background-color: #6c757d;
  color: white;
}

.user-actions {
  text-align: center;
}
</style> 