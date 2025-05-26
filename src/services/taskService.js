import apiClient from '@/utils/apiClient'
import { API_ENDPOINTS, API_CONFIG } from '@/config/api'

// 태스크 관련 API 서비스
export const taskService = {
  /**
   * 태스크 생성 (본인 또는 Admin)
   * @param {Object} taskData - 생성할 태스크 정보
   * @param {string} taskData.title - 태스크 제목
   * @param {string} [taskData.description] - 태스크 설명
   * @param {string} taskData.category - 태스크 카테고리
   * @param {string} taskData.status - 태스크 상태 (예: 'pending', 'in_progress', 'completed')
   * @param {number} taskData.employee_id - 담당자 ID
   * @param {string} [taskData.due_date] - 마감일 (YYYY-MM-DD 형식)
   * @param {string} [taskData.priority] - 우선순위 (예: 'low', 'medium', 'high')
   * @returns {Promise<Object>} 생성된 태스크 정보
   * @throws {Error} API 요청 실패 시 에러
   */
  async createTask(taskData) {
    try {
      const data = await apiClient.post(API_ENDPOINTS.TASKS.CREATE, taskData)
      return data
    } catch (error) {
      console.error('태스크 생성 실패:', error)
      throw error
    }
  },

  /**
   * 태스크 수정 (소유자 또는 Admin)
   * @param {number|string} taskId - 수정할 태스크 ID
   * @param {Object} taskData - 수정할 태스크 정보
   * @param {string} [taskData.title] - 태스크 제목
   * @param {string} [taskData.description] - 태스크 설명
   * @param {string} [taskData.category] - 태스크 카테고리
   * @param {string} [taskData.status] - 태스크 상태
   * @param {number} [taskData.employee_id] - 담당자 ID
   * @param {string} [taskData.due_date] - 마감일
   * @param {string} [taskData.priority] - 우선순위
   * @returns {Promise<Object>} 수정된 태스크 정보
   * @throws {Error} API 요청 실패 시 에러
   */
  async updateTask(taskId, taskData) {
    try {
      const data = await apiClient.patch(API_ENDPOINTS.TASKS.UPDATE(taskId), taskData)
      return data
    } catch (error) {
      console.error('태스크 수정 실패:', error)
      throw error
    }
  },

  /**
   * 태스크 삭제 (소유자 또는 Admin)
   * @param {number|string} taskId - 삭제할 태스크 ID
   * @returns {Promise<Object|null>} 삭제 결과 (204 No Content인 경우 null)
   * @throws {Error} API 요청 실패 시 에러
   */
  async deleteTask(taskId) {
    try {
      const data = await apiClient.delete(API_ENDPOINTS.TASKS.DELETE(taskId))
      return data
    } catch (error) {
      console.error('태스크 삭제 실패:', error)
      throw error
    }
  },

  /**
   * 특정 태스크 상세 조회 (인증 필요)
   * @param {number|string} taskId - 조회할 태스크 ID
   * @returns {Promise<Object>} 태스크 상세 정보
   * @throws {Error} API 요청 실패 시 에러
   */
  async getTaskDetail(taskId) {
    try {
      const data = await apiClient.get(API_ENDPOINTS.TASKS.DETAIL(taskId))
      return data
    } catch (error) {
      console.error('태스크 상세 조회 실패:', error)
      throw error
    }
  },

  /**
   * 특정 사원의 오늘 태스크 조회 (인증 필요)
   * @param {number|string} employeeId - 사원 ID
   * @returns {Promise<Array>} 오늘 태스크 목록 배열
   * @throws {Error} API 요청 실패 시 에러
   */
  async getEmployeeTodayTasks(employeeId) {
    try {
      const data = await apiClient.get(API_ENDPOINTS.TASKS.BY_EMPLOYEE_TODAY(employeeId))
      return data
    } catch (error) {
      console.error('사원 오늘 태스크 조회 실패:', error)
      throw error
    }
  },

  /**
   * 특정 사원의 모든 태스크 조회 (페이지네이션)
   * @param {number|string} employeeId - 사원 ID
   * @param {Object} [options={}] - 조회 옵션
   * @param {number} [options.offset=0] - 페이지네이션 오프셋
   * @param {Object} [options.filters] - 필터 조건
   * @param {string} [options.filters.category] - 카테고리 필터
   * @param {string} [options.filters.status] - 상태 필터
   * @returns {Promise<Object>} 태스크 목록과 페이지네이션 정보
   * @throws {Error} API 요청 실패 시 에러
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
      console.error('사원 태스크 조회 실패:', error)
      throw error
    }
  },

  /**
   * 특정 팀의 모든 태스크 조회 (필터링 + 페이지네이션)
   * @param {number|string} teamId - 팀 ID
   * @param {Object} [options={}] - 조회 옵션
   * @param {number} [options.offset=0] - 페이지네이션 오프셋
   * @param {string} [options.category] - 카테고리 필터
   * @param {string} [options.status] - 상태 필터
   * @param {number} [options.employee_id] - 특정 사원 필터
   * @param {Object} [options.filters] - 추가 필터 조건
   * @returns {Promise<Object>} 태스크 목록과 페이지네이션 정보
   * @throws {Error} API 요청 실패 시 에러
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
      console.error('팀 태스크 조회 실패:', error)
      throw error
    }
  },

  /**
   * 특정 팀의 오늘 태스크 조회 (인증 필요)
   * @param {number|string} teamId - 팀 ID
   * @returns {Promise<Array>} 오늘 태스크 목록 배열
   * @throws {Error} API 요청 실패 시 에러
   */
  async getTeamTodayTasks(teamId) {
    try {
      const data = await apiClient.get(API_ENDPOINTS.TASKS.BY_TEAM_TODAY(teamId))
      return data
    } catch (error) {
      console.error('팀 오늘 태스크 조회 실패:', error)
      throw error
    }
  },

  /**
   * 페이지네이션 헬퍼 함수
   * @param {number} [page=1] - 페이지 번호 (1부터 시작)
   * @param {number} [pageSize=API_CONFIG.DEFAULT_PAGE_SIZE] - 페이지당 항목 수
   * @returns {Object} 페이지네이션 매개변수 객체
   */
  buildPaginationParams(page = 1, pageSize = API_CONFIG.DEFAULT_PAGE_SIZE) {
    return {
      offset: (page - 1) * pageSize
    }
  },

  /**
   * 필터 헬퍼 함수
   * @param {Object} [filters={}] - 필터 조건
   * @param {string} [filters.category] - 카테고리 필터
   * @param {string} [filters.status] - 상태 필터
   * @param {number} [filters.employee_id] - 사원 ID 필터
   * @returns {Object} 유효한 필터 매개변수 객체
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