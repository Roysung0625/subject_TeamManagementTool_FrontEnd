import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * ユーザー関連状態管理ストア
 * Composition APIスタイルで実装
 */
export const useUserStore = defineStore('user', () => {
  // 状態
  const user = ref({
    name: '田中太郎',
    role: 'チームリーダー',
    avatar: '/avatars/default.png'
  })

  // 計算されたプロパティ
  const getUserInfo = computed(() => user.value)
  const userName = computed(() => user.value.name)
  const userRole = computed(() => user.value.role)
  const userAvatar = computed(() => user.value.avatar)

  // アクション
  /**
   * ユーザー情報更新
   * @param {Object} userInfo - 更新するユーザー情報
   */
  function updateUserInfo(userInfo) {
    user.value = { ...user.value, ...userInfo }
  }

  /**
   * ユーザーアバター更新
   * @param {string} avatarUrl - 新しいアバターURL
   */
  function updateAvatar(avatarUrl) {
    user.value.avatar = avatarUrl
  }

  /**
   * ユーザー役割更新
   * @param {string} role - 新しい役割
   */
  function updateRole(role) {
    user.value.role = role
  }

  // ストア返却
  return {
    // 状態
    user,
    
    // 計算されたプロパティ
    getUserInfo,
    userName,
    userRole,
    userAvatar,
    
    // アクション
    updateUserInfo,
    updateAvatar,
    updateRole
  }
}) 