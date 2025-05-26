import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 사용자 관련 상태 관리 스토어
 * Composition API 스타일로 구현
 */
export const useUserStore = defineStore('user', () => {
  // 상태
  const user = ref({
    name: '홍길동',
    role: '팀 리더',
    avatar: '/avatars/default.png'
  })

  // 계산된 속성
  const getUserInfo = computed(() => user.value)
  const userName = computed(() => user.value.name)
  const userRole = computed(() => user.value.role)
  const userAvatar = computed(() => user.value.avatar)

  // 액션
  /**
   * 사용자 정보 업데이트
   * @param {Object} userInfo - 업데이트할 사용자 정보
   */
  function updateUserInfo(userInfo) {
    user.value = { ...user.value, ...userInfo }
  }

  /**
   * 사용자 아바타 업데이트
   * @param {string} avatarUrl - 새 아바타 URL
   */
  function updateAvatar(avatarUrl) {
    user.value.avatar = avatarUrl
  }

  /**
   * 사용자 역할 업데이트
   * @param {string} role - 새 역할
   */
  function updateRole(role) {
    user.value.role = role
  }

  // 스토어 반환
  return {
    // 상태
    user,
    
    // 계산된 속성
    getUserInfo,
    userName,
    userRole,
    userAvatar,
    
    // 액션
    updateUserInfo,
    updateAvatar,
    updateRole
  }
}) 