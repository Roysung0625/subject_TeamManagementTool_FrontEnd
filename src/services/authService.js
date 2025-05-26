import apiClient from '@/utils/apiClient'
import { API_ENDPOINTS } from '@/config/api'
import { useAuthStore } from '@/stores/auth'

// 인증 관련 API 서비스
export const authService = {
  /**
   * 사용자 등록
   * @param {Object} userData - 등록할 사용자 정보
   * @param {string} userData.password - 비밀번호
   * @param {string} userData.name - 사용자 이름
   * @returns {Promise<Object>} 등록된 사용자 정보
   * @throws {Error} API 요청 실패 시 에러
   */
  async register(userData) {
    const authStore = useAuthStore()
    try {
      const data = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData)

      // 토큰 저장
      if (data.token) {
        apiClient.setToken(data.token)
      }
      //인증 데이터(token, employee) 저장
      authStore.setAuthData(data)

      return data
    } catch (error) {
      console.error('사용자 등록 실패:', error)
      throw error
    }
  },

  /**
   * 로그인
   * @param {Object} credentials - 로그인 정보
   * @param {string} credentials.email - 이메일 주소
   * @param {string} credentials.password - 비밀번호
   * @returns {Promise<Object>} 로그인 결과 (토큰 포함)
   * @throws {Error} API 요청 실패 시 에러
   */
  async login(credentials) {
    const authStore = useAuthStore()
    try {
      const data = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
      
      // 로그인 성공 시 토큰 저장
      if (data.token) {
        apiClient.setToken(data.token)
      }
      //인증 데이터(token, employee) 저장
      authStore.setAuthData(data)

      return data
    } catch (error) {
      console.error('로그인 실패:', error)
      throw error
    }
  },

  /**
   * 로그아웃
   * @returns {Promise<Object|null>} 로그아웃 결과
   * @throws {Error} API 요청 실패 시 에러
   */
  async logout() {
    try {
      const data = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
      
      // 로그아웃 시 토큰 제거
      apiClient.clearToken()
      localStorage.removeItem('auth_token')
      
      return data
    } catch (error) {
      console.error('로그아웃 실패:', error)
      throw error
    }
  },

  /**
   * 토큰 설정 (앱 시작 시 저장된 토큰 복원용)
   * @returns {string|null} 설정된 토큰 또는 null
   */
  setStoredToken() {
    const token = localStorage.getItem('auth_token')
    if (token) {
      apiClient.setToken(token)
      return token
    }
    return null
  },

  /**
   * 현재 토큰 확인
   * @returns {string|null} 현재 저장된 토큰 또는 null
   */
  getCurrentToken() {
    return localStorage.getItem('auth_token')
  },

  /**
   * 로그인 상태 확인
   * @returns {boolean} 로그인 여부 (true: 로그인됨, false: 로그인 안됨)
   */
  isAuthenticated() {
    return !!this.getCurrentToken()
  }
}

export default authService 