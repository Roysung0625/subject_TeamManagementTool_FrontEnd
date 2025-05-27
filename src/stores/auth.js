import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/utils/apiClient'

/**
 * 認証関連状態管理ストア
 * 純粋な状態管理のみ担当（API呼び出しはserviceで処理）
 */
//id = auth, 使用時は const authStore = useAuthStore();
export const useAuthStore = defineStore('auth', () => {
  // 状態 
  const user = ref(null)
  const token = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // 計算されたプロパティ
  // !! 二重否定 => ex) !!null -> !true -> false (nullはfalse値なのでfalseになる)
  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || null)
  const userName = computed(() => user.value?.name || '')
  const userId = computed(() => user.value?.id || '')

  // 状態管理アクション
  
  /**
   * ログイン成功時状態更新
   * @param {Object} authData - 認証データ
   * @param {string} authData.token - JWTトークン
   * @param {Object} authData.user - ユーザー情報
   */
  function setAuthData(authData) {
    console.log('setAuthData in auth.js', authData)
    console.log('authData.employee in auth.js', authData.employee)

    token.value = authData.token
    user.value = authData.employee || authData.data?.employee
    
    // APIクライアントにトークン設定
    apiClient.setToken(authData.token)
    
    // エラー初期化
    error.value = null
  }

  /**
   * 認証データ初期化（ログアウト）
   */
  function clearAuthData() {
    user.value = null
    token.value = null
    error.value = null
    
    // localStorage整理
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_info')
    
    // APIクライアントトークン削除
    apiClient.clearToken()
  }

  /**
   * ローディング状態設定
   * @param {boolean} loading - ローディング状態
   */
  function setLoading(loading) {
    isLoading.value = loading
  }

  /**
   * エラーメッセージ設定
   * @param {string} errorMessage - エラーメッセージ
   */
  function setError(errorMessage) {
    error.value = errorMessage
  }

  /**
   * エラーメッセージ初期化
   */
  function clearError() {
    error.value = null
  }

  /**
   * トークン有効性検査
   * @returns {boolean} トークン有効性
   */
  function validateToken() {
    if (!token.value) return false
    
    try {
      // JWTトークンデコード（簡単な有効期限チェック）
      const payload = JSON.parse(atob(token.value.split('.')[1]))
      const currentTime = Date.now() / 1000
      
      if (payload.exp && payload.exp < currentTime) {
        // トークン期限切れ
        clearAuthData()
        return false
      }
      
      return true
    } catch (err) {
      console.error('トークン検証失敗:', err)
      clearAuthData()
      return false
    }
  }

  // ストア返却
  return {
    // 状態
    user,
    token,
    isLoading,
    error,
    
    // 計算されたプロパティ
    isAuthenticated,
    userRole,
    userName,
    userId,
    
    // 状態管理アクション
    setAuthData,
    clearAuthData,
    setLoading,
    setError,
    clearError,
    validateToken
  }
}) 