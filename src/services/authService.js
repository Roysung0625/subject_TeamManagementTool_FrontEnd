import apiClient from '@/utils/apiClient'
import { API_ENDPOINTS } from '@/config/api'
import { useAuthStore } from '@/stores/auth'

// 認証関連APIサービス
export const authService = {
  /**
   * ユーザー登録
   * @param {Object} userData - 登録するユーザー情報
   * @param {string} userData.password - パスワード
   * @param {string} userData.name - ユーザー名
   * @returns {Promise<Object>} 登録されたユーザー情報
   * @throws {Error} APIリクエスト失敗時エラー
   */
  async register(userData) {
    const authStore = useAuthStore()
    try {
      const data = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData)

      // トークン保存
      if (data.token) {
        apiClient.setToken(data.token)
      }
      // 認証データ(token, employee)保存
      authStore.setAuthData(data)

      return data
    } catch (error) {
      console.error('ユーザー登録失敗:', error)
      throw error
    }
  },

  /**
   * ログイン
   * @param {Object} credentials - ログイン情報
   * @param {string} credentials.password - パスワード
   * @returns {Promise<Object>} ログイン結果（トークン含む）
   * @throws {Error} APIリクエスト失敗時エラー
   */
  async login(credentials) {
    const authStore = useAuthStore()
    try {
      const data = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
      console.log('data in authService.js', data)
      
      // ログイン成功時トークン保存
      if (data.token) {
        apiClient.setToken(data.token)
      }
      // 認証データ(token, employee)保存
      authStore.setAuthData(data)
      console.log('authStore.user in authService.js', authStore.user.value)

      return data
    } catch (error) {
      console.error('ログイン失敗:', error)
      throw error
    }
  },

  /**
   * ログアウト
   * @returns {Promise<Object|null>} ログアウト結果
   * @throws {Error} APIリクエスト失敗時エラー
   */
  async logout() {
    try {
      const data = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
      
      // ログアウト時トークン削除
      apiClient.clearToken()
      localStorage.removeItem('auth_token')
      
      return data
    } catch (error) {
      console.error('ログアウト失敗:', error)
      throw error
    }
  },

  /**
   * トークン設定（アプリ開始時保存されたトークン復元用）
   * @returns {string|null} 設定されたトークンまたはnull
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
   * 現在のトークン確認
   * @returns {string|null} 現在保存されているトークンまたはnull
   */
  getCurrentToken() {
    return localStorage.getItem('auth_token')
  },

  /**
   * ログイン状態確認
   * @returns {boolean} ログイン状況（true: ログイン済み, false: 未ログイン）
   */
  isAuthenticated() {
    return !!this.getCurrentToken()
  }
}

export default authService 