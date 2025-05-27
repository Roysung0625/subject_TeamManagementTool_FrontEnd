import apiClient from '@/utils/apiClient'
import { API_ENDPOINTS, API_CONFIG } from '@/config/api'

// タスク関連APIサービス
export const taskService = {
  /**
   * タスク作成（本人またはAdmin）
   * @param {Object} taskData - 作成するタスク情報
   * @param {string} taskData.title - タスクタイトル
   * @param {string} [taskData.description] - タスク説明
   * @param {string} taskData.category - タスクカテゴリ
   * @param {string} taskData.status - タスクステータス（例：'pending', 'in_progress', 'completed'）
   * @param {number} taskData.employee_id - 担当者ID
   * @param {string} [taskData.due_date] - 期限（YYYY-MM-DD形式）
   * @param {string} [taskData.priority] - 優先度（例：'low', 'medium', 'high'）
   * @returns {Promise<Object>} 作成されたタスク情報
   * @throws {Error} APIリクエスト失敗時エラー
   */
  async createTask(taskData) {
    try {
      const data = await apiClient.post(API_ENDPOINTS.TASKS.CREATE, taskData)
      return data
    } catch (error) {
      console.error('タスク作成失敗:', error)
      throw error
    }
  },

  /**
   * タスク修正（所有者またはAdmin）
   * @param {number|string} taskId - 修正するタスクID
   * @param {Object} taskData - 修正するタスク情報
   * @param {string} [taskData.title] - タスクタイトル
   * @param {string} [taskData.description] - タスク説明
   * @param {string} [taskData.category] - タスクカテゴリ
   * @param {string} [taskData.status] - タスクステータス
   * @param {number} [taskData.employee_id] - 担当者ID
   * @param {string} [taskData.due_date] - 期限
   * @param {string} [taskData.priority] - 優先度
   * @returns {Promise<Object>} 修正されたタスク情報
   * @throws {Error} APIリクエスト失敗時エラー
   */
  async updateTask(taskId, taskData) {
    try {
      const data = await apiClient.patch(API_ENDPOINTS.TASKS.UPDATE(taskId), taskData)
      return data
    } catch (error) {
      console.error('タスク修正失敗:', error)
      throw error
    }
  },

  /**
   * タスク削除（所有者またはAdmin）
   * @param {number|string} taskId - 削除するタスクID
   * @returns {Promise<Object|null>} 削除結果（204 No Contentの場合null）
   * @throws {Error} APIリクエスト失敗時エラー
   */
  async deleteTask(taskId) {
    try {
      const data = await apiClient.delete(API_ENDPOINTS.TASKS.DELETE(taskId))
      return data
    } catch (error) {
      console.error('タスク削除失敗:', error)
      throw error
    }
  },

  /**
   * 特定タスク詳細照会（認証必要）
   * @param {number|string} taskId - 照会するタスクID
   * @returns {Promise<Object>} タスク詳細情報
   * @throws {Error} APIリクエスト失敗時エラー
   */
  async getTaskDetail(taskId) {
    try {
      const data = await apiClient.get(API_ENDPOINTS.TASKS.DETAIL(taskId))
      return data
    } catch (error) {
      console.error('タスク詳細照会失敗:', error)
      throw error
    }
  },

  /**
   * 特定社員の今日のタスク照会（認証必要）
   * @param {number|string} employeeId - 社員ID
   * @returns {Promise<Array>} 今日のタスクリスト配列
   * @throws {Error} APIリクエスト失敗時エラー
   */
  async getEmployeeTodayTasks(employeeId) {
    try {
      const data = await apiClient.get(API_ENDPOINTS.TASKS.BY_EMPLOYEE_TODAY(employeeId))
      return data
    } catch (error) {
      console.error('社員今日のタスク照会失敗:', error)
      throw error
    }
  },

  /**
   * 特定社員の全タスク照会（ページネーション）
   * @param {number|string} employeeId - 社員ID
   * @param {Object} [options={}] - 照会オプション
   * @param {number} [options.offset=0] - ページネーションオフセット
   * @param {Object} [options.filters] - フィルター条件
   * @param {string} [options.filters.category] - カテゴリフィルター
   * @param {string} [options.filters.status] - ステータスフィルター
   * @returns {Promise<Object>} タスクリストとページネーション情報
   * @throws {Error} APIリクエスト失敗時エラー
   */
  async getEmployeeTasks(employeeId, options = {}) {
    try {
      const queryParams = {
        offset: options.offset || 0,
        ...options.filters
      }
      
      const data = await apiClient.get(
        API_ENDPOINTS.TASKS.BY_EMPLOYEE(employeeId),
        queryParams
      )
      return data
    } catch (error) {
      console.error('社員タスク照会失敗:', error)
      throw error
    }
  },

  /**
   * 特定チームの全タスク照会（フィルタリング + ページネーション）
   * @param {number|string} teamId - チームID
   * @param {Object} [options={}] - 照会オプション
   * @param {number} [options.offset=0] - ページネーションオフセット
   * @param {string} [options.category] - カテゴリフィルター
   * @param {string} [options.status] - ステータスフィルター
   * @param {number} [options.employee_id] - 特定社員フィルター
   * @param {Object} [options.filters] - 追加フィルター条件
   * @returns {Promise<Object>} タスクリストとページネーション情報
   * @throws {Error} APIリクエスト失敗時エラー
   */
  async getTeamTasks(teamId, options = {}) {
    try {
      const queryParams = {
        offset: options.offset || 0,
        category: options.category,
        status: options.status,
        employee_id: options.employee_id,
        ...options.filters
      }
      
      const data = await apiClient.get(
        API_ENDPOINTS.TASKS.BY_TEAM(teamId),
        queryParams
      )
      return data
    } catch (error) {
      console.error('チームタスク照会失敗:', error)
      throw error
    }
  },

  /**
   * 特定チームの今日のタスク照会（認証必要）
   * @param {number|string} teamId - チームID
   * @returns {Promise<Array>} 今日のタスクリスト配列
   * @throws {Error} APIリクエスト失敗時エラー
   */
  async getTeamTodayTasks(teamId) {
    try {
      const data = await apiClient.get(API_ENDPOINTS.TASKS.BY_TEAM_TODAY(teamId))
      return data
    } catch (error) {
      console.error('チーム今日のタスク照会失敗:', error)
      throw error
    }
  },

  /**
   * ページネーションヘルパー関数
   * @param {number} [page=1] - ページ番号（1から開始）
   * @param {number} [pageSize=API_CONFIG.DEFAULT_PAGE_SIZE] - ページあたりの項目数
   * @returns {Object} ページネーションパラメータオブジェクト
   */
  buildPaginationParams(page = 1, pageSize = API_CONFIG.DEFAULT_PAGE_SIZE) {
    return {
      offset: (page - 1) * pageSize
    }
  },

  /**
   * フィルターヘルパー関数
   * @param {Object} [filters={}] - フィルター条件
   * @param {string} [filters.category] - カテゴリフィルター
   * @param {string} [filters.status] - ステータスフィルター
   * @param {number} [filters.employee_id] - 社員IDフィルター
   * @returns {Object} 有効なフィルターパラメータオブジェクト
   */
  buildFilterParams(filters = {}) {
    const validFilters = {}
    
    if (filters.category) validFilters.category = filters.category
    if (filters.status) validFilters.status = filters.status
    if (filters.employee_id) validFilters.employee_id = filters.employee_id
    
    return validFilters
  }
}

export default taskService 