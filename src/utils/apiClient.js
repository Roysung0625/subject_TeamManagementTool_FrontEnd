import { getApiUrl, getAuthHeaders, DEFAULT_REQUEST_OPTIONS, HTTP_STATUS } from '@/config/api'

// API 클라이언트 클래스
class ApiClient {
  constructor() {
    this.token = null
  }

  // 토큰 설정
  setToken(token) {
    this.token = token
  }

  // 토큰 제거
  clearToken() {
    this.token = null
  }

  // 기본 요청 메서드
  //endpoint를 보내고, option은 기본 설정외에 설정할 것이 있으면 보낸다
  async request(endpoint, options = {}, queryParams = {}) {
    const url = getApiUrl(endpoint, queryParams)
    // Header {Authorization: Bearer token} 형식
    const headers = getAuthHeaders(this.token)
    
    // DEFAULT_REQUEST_OPTIONS의 모든 속성을 열거하고, options의 모든 속성을 열거한다, option은 같은 속성이 있으면 덮어씌운다
    const config = {
      ...DEFAULT_REQUEST_OPTIONS,
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    }

    try {
        //config는 사전에 정의
      const response = await fetch(url, config)
      
      // 204 No Content는 성공이지만 응답 본문이 없음
      if (response.status === HTTP_STATUS.NO_CONTENT) {
        return null
      }
      
      //에러 메세지 반환시, 
      if (!response.ok) {
        //json 파싱이 실패할 경우 빈 객체 반환하게
        const errorData = await response.json().catch(() => ({}))
        //된다면 에러 메세지를 받고, 없을 경우 에러코드로 Error 생성
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`)
        error.status = response.status
        error.data = errorData
        throw error
      }
      
      //json 파싱, js 객체로 변환
      const data = await response.json()
      return data
    } catch (error) {
      console.error('API 요청 오류:', error)
      throw error
    }
  }

  // GET 요청
  async get(endpoint, queryParams = {}, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options
    }, queryParams)
  }

  // POST 요청
  async post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
      ...options
    })
  }

  // PUT 요청
  async put(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
      ...options
    })
  }

  // DELETE 요청
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options
    })
  }

  // PATCH 요청
  async patch(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null,
      ...options
    })
  }
}

// 싱글톤 인스턴스 생성
const apiClient = new ApiClient()

export default apiClient 