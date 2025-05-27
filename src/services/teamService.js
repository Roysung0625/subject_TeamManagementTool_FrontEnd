import apiClient from '@/utils/apiClient'
import { API_ENDPOINTS } from '@/config/api'

// 팀 관련 API 서비스
export const teamService = {
  /**
   * 팀 목록 조회
   * @returns {Promise<Array>} 팀 목록 배열
   * @throws {Error} API 요청 실패 시 에러
   */
  async getTeams() {
    try {
      const data = await apiClient.get(API_ENDPOINTS.TEAMS.LIST)
      return data
    } catch (error) {
      console.error('팀 목록 조회 실패:', error)
      throw error
    }
  },

  /**
   * 팀 생성 (Admin 권한 필요)
   * @param {Object} teamData - 생성할 팀 정보
   * @param {string} teamData.name - 팀 이름
   * @returns {Promise<Object>} 생성된 팀 정보
   * @throws {Error} API 요청 실패 시 에러
   */
  async createTeam(teamData) {
    try {
      const data = await apiClient.post(API_ENDPOINTS.TEAMS.CREATE, teamData)
      return data
    } catch (error) {
      console.error('팀 생성 실패:', error)
      throw error
    }
  },

  /**
   * 팀 정보 수정 (Admin 권한 필요)
   * @param {number} teamId - 수정할 팀 ID
   * @param {Object} teamData - 수정할 팀 정보
   * @param {string} teamData.name - 팀 이름
   * @returns {Promise<Object>} 수정된 팀 정보
   * @throws {Error} API 요청 실패 시 에러
   */
  async updateTeam(teamId, teamData) {
    try {                                //주소        | url                | body
      const data = await apiClient.patch(API_ENDPOINTS.TEAMS.UPDATE(teamId), teamData)
      return data
    } catch (error) {
      console.error('팀 수정 실패:', error)
      throw error
    }
  },

  /**
   * 팀 삭제 (Admin 권한 필요)
   * @param {number} teamId - 삭제할 팀 ID
   * @returns {Promise<null>} 삭제 결과 - api상 null만 반환
   * @throws {Error} API 요청 실패 시 에러
   */
  async deleteTeam(teamId) {
    try {
      const data = await apiClient.delete(API_ENDPOINTS.TEAMS.DELETE(teamId))
      return data
    } catch (error) {
      console.error('팀 삭제 실패:', error)
      throw error
    }
  },

  /**
   * 팀 상세 조회
   * @param {number} teamId - 조회할 팀 ID
   * @returns {Promise<Object>} 팀 상세 정보
   * @throws {Error} API 요청 실패 시 에러
   */
  async getTeamDetail(teamId) {
    try {
      const data = await apiClient.get(API_ENDPOINTS.TEAMS.DETAIL(teamId))
      return data
    } catch (error) {
      console.error('팀 상세 조회 실패:', error)
      throw error
    }
  },

  /**
   * 특정 팀의 멤버 목록 조회 (인증 필요)
   * @param {number} teamId - 팀 ID
   * @returns {Promise<Array>} 팀 멤버 목록 배열
   * @throws {Error} API 요청 실패 시 에러
   */
  async getTeamMembers(teamId) {
    try {
      const data = await apiClient.get(API_ENDPOINTS.TEAMS.MEMBERS(teamId))
      return data
    } catch (error) {
      console.error('팀 멤버 목록 조회 실패:', error)
      throw error
    }
  },

  /**
   * 팀 멤버 관리 - 추가/삭제 (Admin 권한 필요)
   * @param {number} teamId - 팀 ID
   * @param {Object} memberData - 멤버 관리 데이터
   * @param {Array<number>} [memberData] - 사원 ID 배열
   * @returns {Promise<Object>} 멤버 관리 결과
   * @throws {Error} API 요청 실패 시 에러
   */
  async manageTeamMembers(teamId, memberData) {
    try {
      const data = await apiClient.patch(API_ENDPOINTS.TEAMS.MANAGEMENT(teamId), memberData)
      return data
    } catch (error) {
      console.error('팀 멤버 관리 실패:', error)
      throw error
    }
  },

  /**
   * 특정 사원이 속한 팀 목록 조회 (인증 필요)
   * @param {number} employeeId - 사원 ID
   * @returns {Promise<Array>} 사원이 속한 팀 목록 배열
   * @throws {Error} API 요청 실패 시 에러
   */
  async getEmployeeTeams(employeeId) {
    try {
      const data = await apiClient.get(API_ENDPOINTS.TEAMS.BY_EMPLOYEE(employeeId))
      return data
    } catch (error) {
      console.error('사원 팀 목록 조회 실패:', error)
      throw error
    }
  }
}

export default teamService