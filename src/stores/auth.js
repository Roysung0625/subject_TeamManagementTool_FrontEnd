import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/utils/apiClient'

/**
 * 인증 관련 상태 관리 스토어
 * 순수한 상태 관리만 담당 (API 호출은 service에서 처리)
 */
//id = auth, 사용할땐 const authStore = useAuthStore();
export const useAuthStore = defineStore('auth', () => {
  // 상태 
  const user = ref(null)
  const token = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // 계산된 속성
  // \!! 이중부정 => ex) !!null -> !true -> false (null은 false 값이므로 false가 됨)
  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || null)
  const userName = computed(() => user.value?.name || '')
  const userId = computed(() => user.value?.id || '')

  // 상태 관리 액션들
  
  /**
   * 로그인 성공 시 상태 업데이트
   * @param {Object} authData - 인증 데이터
   * @param {string} authData.token - JWT 토큰
   * @param {Object} authData.user - 사용자 정보
   */
  function setAuthData(authData) {
    token.value = authData.token
    user.value = authData.employee || authData.data?.employee
    
    // API 클라이언트에 토큰 설정
    apiClient.setToken(authData.token)
    
    // 에러 초기화
    error.value = null
  }

  /**
   * 인증 데이터 초기화 (로그아웃)
   */
  function clearAuthData() {
    user.value = null
    token.value = null
    error.value = null
    
    // localStorage 정리
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_info')
    
    // API 클라이언트 토큰 제거
    apiClient.clearToken()
  }


  /**
   * 로딩 상태 설정
   * @param {boolean} loading - 로딩 상태
   */
  function setLoading(loading) {
    isLoading.value = loading
  }

  /**
   * 에러 메시지 설정
   * @param {string} errorMessage - 에러 메시지
   */
  function setError(errorMessage) {
    error.value = errorMessage
  }

  /**
   * 에러 메시지 초기화
   */
  function clearError() {
    error.value = null
  }

  /**
   * 토큰 유효성 검사
   * @returns {boolean} 토큰 유효 여부
   */
  function validateToken() {
    if (!token.value) return false
    
    try {
      // JWT 토큰 디코딩 (간단한 만료 시간 체크)
      const payload = JSON.parse(atob(token.value.split('.')[1]))
      const currentTime = Date.now() / 1000
      
      if (payload.exp && payload.exp < currentTime) {
        // 토큰 만료
        clearAuthData()
        return false
      }
      
      return true
    } catch (err) {
      console.error('토큰 검증 실패:', err)
      clearAuthData()
      return false
    }
  }

  // 스토어 반환
  return {
    // 상태
    user,
    token,
    isLoading,
    error,
    
    // 계산된 속성
    isAuthenticated,
    userRole,
    userName,
    userId,
    
    // 상태 관리 액션
    setAuthData,
    clearAuthData,
    setLoading,
    setError,
    clearError,
    validateToken
  }
}) 