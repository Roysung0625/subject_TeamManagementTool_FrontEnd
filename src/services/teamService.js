import apiClient from '@/utils/apiClient'
import { API_ENDPOINTS } from '@/config/api'

// チーム関連APIサービス
export const teamService = {
  /**
   * チームリスト照会
   * @returns {Promise<Array>} チームリスト配列
   * @throws {Error} APIリクエスト失敗時エラー
   */
  async getTeams() {
    try {
      const data = await apiClient.get(API_ENDPOINTS.TEAMS.LIST)
      return data
    } catch (error) {
      console.error('チームリスト照会失敗:', error)
      throw error
    }
  },

  /**
   * チーム作成（Admin権限必要）
   * @param {Object} teamData - 作成するチーム情報
   * @param {string} teamData.name - チーム名
   * @returns {Promise<Object>} 作成されたチーム情報
   * @throws {Error} APIリクエスト失敗時エラー
   */
  async createTeam(teamData) {
    try {
      const data = await apiClient.post(API_ENDPOINTS.TEAMS.CREATE, teamData)
      return data
    } catch (error) {
      console.error('チーム作成失敗:', error)
      throw error
    }
  },

  /**
   * チーム情報修正（Admin権限必要）
   * @param {number} teamId - 修正するチームID
   * @param {Object} teamData - 修正するチーム情報
   * @param {string} teamData.name - チーム名
   * @returns {Promise<Object>} 修正されたチーム情報
   * @throws {Error} APIリクエスト失敗時エラー
   */
  async updateTeam(teamId, teamData) {
    try {                                //アドレス        | url                | body
      const data = await apiClient.patch(API_ENDPOINTS.TEAMS.UPDATE(teamId), teamData)
      return data
    } catch (error) {
      console.error('チーム修正失敗:', error)
      throw error
    }
  },

  /**
   * チーム削除（Admin権限必要）
   * @param {number} teamId - 削除するチームID
   * @returns {Promise<null>} 削除結果 - api上nullのみ返却
   * @throws {Error} APIリクエスト失敗時エラー
   */
  async deleteTeam(teamId) {
    try {
      const data = await apiClient.delete(API_ENDPOINTS.TEAMS.DELETE(teamId))
      return data
    } catch (error) {
      console.error('チーム削除失敗:', error)
      throw error
    }
  },

  /**
   * チーム詳細照会
   * @param {number} teamId - 照会するチームID
   * @returns {Promise<Object>} チーム詳細情報
   * @throws {Error} APIリクエスト失敗時エラー
   */
  async getTeamDetail(teamId) {
    try {
      const data = await apiClient.get(API_ENDPOINTS.TEAMS.DETAIL(teamId))
      return data
    } catch (error) {
      console.error('チーム詳細照会失敗:', error)
      throw error
    }
  },

  /**
   * 特定チームのメンバーリスト照会（認証必要）
   * @param {number} teamId - チームID
   * @returns {Promise<Array>} チームメンバーリスト配列
   * @throws {Error} APIリクエスト失敗時エラー
   */
  async getTeamMembers(teamId) {
    try {
      const data = await apiClient.get(API_ENDPOINTS.TEAMS.MEMBERS(teamId))
      return data
    } catch (error) {
      console.error('チームメンバーリスト照会失敗:', error)
      throw error
    }
  },

  /**
   * チームメンバー管理 - 追加/削除（Admin権限必要）
   * @param {number} teamId - チームID
   * @param {Object} memberData - メンバー管理データ
   * @param {Array<number>} [memberData] - 社員ID配列
   * @returns {Promise<Object>} メンバー管理結果
   * @throws {Error} APIリクエスト失敗時エラー
   */
  async manageTeamMembers(teamId, memberData) {
    try {
      const data = await apiClient.patch(API_ENDPOINTS.TEAMS.MANAGEMENT(teamId), memberData)
      return data
    } catch (error) {
      console.error('チームメンバー管理失敗:', error)
      throw error
    }
  },

  /**
   * 特定社員が所属するチームリスト照会（認証必要）
   * @param {number} employeeId - 社員ID
   * @returns {Promise<Array>} 社員が所属するチームリスト配列
   * @throws {Error} APIリクエスト失敗時エラー
   */
  async getEmployeeTeams(employeeId) {
    try {
      const data = await apiClient.get(API_ENDPOINTS.TEAMS.BY_EMPLOYEE(employeeId))
      return data
    } catch (error) {
      console.error('社員チームリスト照会失敗:', error)
      throw error
    }
  }
}

export default teamService